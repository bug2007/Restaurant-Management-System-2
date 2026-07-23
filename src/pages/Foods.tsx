import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteFood, getFoods, queryClient } from "../util/http.js";
import useTitle from "../hooks/useTitle.js";
import EnhancedTable from "../components/EnhancedTable.js";
import { useState } from "react";
import TransitionsModal from "../components/TransitionsModal.tsx";
import { Typography, Box, Button } from "@mui/material";
import type { Food, HeadCell, SingleRow } from "../types.ts";
import CloseIconDeleteModal from "../components/CloseIconDeleteModal.tsx";

const headCells: HeadCell<Food>[] = [
  {
    id: "name",
    label: "Name",
    sortable: true,
    renderImage: (row) =>
      `https://bssrms.runasp.net/images/food/${row.image}`,
    render: (row) => row.name,
  },
  {
    id: "price",
    label: "Price",
    sortable: true,
    render: (row) => row.price,   
  },
  {
    id: "discountType",
    label: "Discount Type",
    sortable: false,
    render: (row) => row.discountType,
  },
  {
    id: "discount",
    label: "Discount",
    sortable: false,
    render: (row) => row.discountType === "None" ? "-" : row.discountType === "Percentage" ? `${row.discount}%` : row.discount
  },
  {
    id: "discountPrice",
    label: "Discounted Price",
    sortable: false,
    render: (row) => row.discountPrice,
  },
  {
    id: "actions",
    label: "Actions",
    sortable: false,
    render: () => null,
  },
];

export default function Employees() {
  useTitle("Food Management");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState("");
  const [foodToDelete, setFoodToDelete] = useState<SingleRow["id"]>(-1)
  
  const { data, isPending } = useQuery({
    queryKey: ["foods", page, perPage, sort],
    queryFn: ({ signal }) => getFoods({ signal, page, perPage, sort }),
  });

  const total = data?.total || 0;
  const end = total % 5 === 0 ? total : total + 5;

  let rowsPerPageOptions: number[] = [];
  for (let i = 5; i <= end; i += 5) {
    rowsPerPageOptions.push(i);
  }

  const { mutate, data: deleteData, reset, isPending: isPendingDeletion, isSuccess, isError: isErrorDeleting, error: deleteError } = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['foods']
      })
    },
  })

  function handleStartDelete(id: SingleRow["id"]) {
    reset()
    setFoodToDelete(id)
  }
  function handleStopDelete() {
    setFoodToDelete(-1)
  }
  function handleDelete() {
    mutate({id: foodToDelete})
  }

  return (
    <>
    <TransitionsModal sx={{display: 'flex', flexDirection: 'column'}} open={foodToDelete !== -1} onClose={isPendingDeletion ? undefined : handleStopDelete}>
          <CloseIconDeleteModal onClose={isPendingDeletion ? undefined : handleStopDelete} />
          {!isSuccess && !isErrorDeleting && (
            <>
            <Box sx={{width: '90%'}}>
              <Typography variant="h6" sx={{lineHeight: 1.5, mb: 1}}>Are you sure you want to delete this food item?</Typography>
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
      type="Food"
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
