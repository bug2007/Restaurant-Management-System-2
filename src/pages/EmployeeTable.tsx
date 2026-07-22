import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteTable, getTables, queryClient } from "../util/http.js";
import useTitle from "../hooks/useTitle.js";
import EnhancedTable from "../components/EnhancedTable.js";
import { useState } from "react";
import { Typography, Box, Button } from "@mui/material";

import type { EmployeeTable, HeadCell, SingleRow } from "../types.ts";
import TransitionsModal from "../components/TransitionsModal.tsx";

const headCells: HeadCell<EmployeeTable>[] = [
  {
    id: "tableNumber",
    label: "Table Number",
    sortable: true,
    renderImage: (row) => `https://bssrms.runasp.net/images/table/${row.image}`,
    render: (row) => row.tableNumber,
  },
  {
    id: "numberOfSeats",
    label: "Total Seats",
    sortable: true,
    render: (row) => row.numberOfSeats,
  },
  {
    id: "isOccupied",
    label: "Booking Status",
    sortable: false,
    render: (row) => (row.isOccupied ? "Not available" : "Available"),
  },
  {
    id: "employees",
    label: "Assigned Employees",
    sortable: false,
    render: (row) => row.employees.map((employee) => employee.name).join(", "),
  },
  {
    id: "actions",
    label: "Actions",
    sortable: false,
    render: () => null,
  },
];

export default function EmployeeTable() {
  useTitle("Table Management");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState("");
  const [tableToDelete, setTableToDelete] = useState<SingleRow["id"]>(-1)
  
  const { data, isPending } = useQuery({
    queryKey: ["tables", page, perPage, sort],
    queryFn: ({ signal }) => getTables({ signal, page, perPage, sort }),
  });

  const total = data?.total || 0;
  const end = total % 5 === 0 ? total : total + 5;

  let rowsPerPageOptions: number[] = [];
  for (let i = 5; i <= end; i += 5) {
    rowsPerPageOptions.push(i);
  }

  const { mutate, data: deleteData, reset, isPending: isPendingDeletion, isSuccess, isError: isErrorDeleting, error: deleteError } = useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables']
      })
    },
  })

  function handleStartDelete(id: SingleRow["id"]) {
    reset()
    setTableToDelete(id)
  }
  function handleStopDelete() {
    setTableToDelete(-1)
  }
  function handleDelete() {
    mutate({id: tableToDelete})
  }

  return (
    <>
    <TransitionsModal open={tableToDelete !== -1} onClose={isPendingDeletion ? undefined : handleStopDelete}>
          {!isSuccess && !isErrorDeleting && (
            <>
            <Box sx={{width: '90%'}}>
              <Typography variant="h6" sx={{lineHeight: 1.5, mb: 1}}>Are you sure you want to delete this table?</Typography>
              <Typography sx={{fontSize: 15}}>This action cannot be undone.</Typography>
            </Box>
            <Box sx={{mt: 4, display: 'flex', justifyContent: 'end', gap: 2}}>
              <Button variant="contained" color="inherit" sx={{textTransform: 'none', fontSize: 16}} onClick={handleStopDelete} disabled={isPendingDeletion}>Cancel</Button>
              <Button variant="contained" color="error" sx={{textTransform: 'none', fontSize: 16}} onClick={handleDelete} disabled={isPendingDeletion}>{isPendingDeletion ? 'Deleting...' : 'Delete'}</Button>
            </Box>
            </>
          )}
          {(isSuccess || deleteError) && (
            <>
              <Typography variant="h6" color="error" sx={{lineHeight: 1.5, textAlign: 'center'}}>
                {isSuccess ? deleteData?.message : deleteError?.message}
              </Typography>
              <Button variant="contained" color="inherit" sx={{mt: 3, width: 'fit-content', textTransform: 'none', fontSize: 14, alignSelf: 'center'}} onClick={handleStopDelete}>Close</Button>
            </>
          )}
        </TransitionsModal>
    <EnhancedTable
      handleStartDelete={handleStartDelete}
      headCells={headCells}
      isPending={isPending}
      rows={data?.data || []}
      total={total}
      currentPage={data?.current_page || 1}
      rowsPerPage={data?.per_page || 0}
      rowsPerPageOptions={rowsPerPageOptions}
      onPageChange={setPage}
      onRowsPerPageChange={(value: number) => {
        setPerPage(value);
        setPage(1);
      }}
      sort={sort}
      onSortChange={setSort}
    />
    </>
  );
}
