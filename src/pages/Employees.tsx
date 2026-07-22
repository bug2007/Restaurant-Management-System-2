import { useQuery, useMutation } from "@tanstack/react-query";
import { getEmployees, queryClient, deleteEmployee } from "../util/http.js";
import useTitle from "../hooks/useTitle.js";
import EnhancedTable from "../components/EnhancedTable.js";
import { useState } from "react";
import { Button, Typography, Box } from "@mui/material";

import type { Employee, HeadCell, SingleRow } from "../types.ts";
import TransitionsModal from "../components/TransitionsModal.tsx";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const headCells: HeadCell<Employee>[] = [
  {
    id: "fullName",
    label: "Employee",
    sortable: false,
    renderImage: (row) =>
      `https://bssrms.runasp.net/images/user/${row.user.image}`,
    render: (row) => row.user.fullName,
  },
  {
    id: "email",
    label: "Email",
    sortable: true,
    render: (row) => row.user.email,
  },
  {
    id: "designation",
    label: "Designation",
    sortable: true,
    render: (row) => row.designation,
  },
  {
    id: "joinDate",
    label: "Join Date",
    sortable: true,
    render: (row) => formatDate(row.joinDate),
  },
  {
    id: "phoneNumber",
    label: "Phone",
    sortable: false,
    render: (row) => row.user.phoneNumber,
  },
  {
    id: "actions",
    label: "Actions",
    sortable: false,
    render: () => null,
  },
];

export default function Employees() {
  useTitle("Employee Management");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState<SingleRow["id"]>("")

  const { data, isPending } = useQuery({
    queryKey: ["employees", page, perPage, sort],
    queryFn: ({ signal }) => getEmployees({ signal, page, perPage, sort }),
  });

  const total = data?.total || 0;
  const end = total % 5 === 0 ? total : total + 5;

  let rowsPerPageOptions: number[] = [];
  for (let i = 5; i <= end; i += 5) {
    rowsPerPageOptions.push(i);
  }

  const { mutate, data: deleteData, reset, isPending: isPendingDeletion, isSuccess, isError: isErrorDeleting, error: deleteError } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees']
      })
    },
  })

 
  function handleStartDelete(id: SingleRow["id"]) {
    setEmployeeToDelete(id)
    reset()
  }
  function handleStopDelete() {
    setEmployeeToDelete("")
  }
  function handleDelete() {
    mutate({id: employeeToDelete})
  }

  return (
    <>
    
    <TransitionsModal open={!!employeeToDelete} onClose={isPendingDeletion ? undefined : handleStopDelete}>
      {!isSuccess && !isErrorDeleting && (
        <>
        <Box sx={{width: '90%'}}>
          <Typography variant="h6" sx={{lineHeight: 1.5, mb: 1}}>Are you sure you want to delete this employee?</Typography>
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
            {isSuccess ? `${deleteData?.message}.` : deleteError?.message}
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
