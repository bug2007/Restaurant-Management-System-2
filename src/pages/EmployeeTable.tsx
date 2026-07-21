import { useQuery } from "@tanstack/react-query"
import { getTables } from "../util/http.js"
import useTitle from "../hooks/useTitle.js";
import EnhancedTable from "../components/Table.jsx";
import { useState } from "react";

import type { EmployeeTable, HeadCell } from "../types.ts";

const headCells: HeadCell<EmployeeTable>[] = [
  { 
    id: 'tableNumber',
    label: 'Table Number',
    sortable: true,
    renderImage: (row) => `https://bssrms.runasp.net/images/table/${row.image}`,
    render: (row) => row.tableNumber,
  },
  {
    id: 'numberOfSeats',
    label: 'Total Seats',
    sortable: true,
    render: (row) => row.numberOfSeats,
  },
  {
    id: 'isOccupied',
    label: 'Booking Status',
    sortable: false,
    render: (row) => (row.isOccupied ? "Not available" : "Available"),
  },
  {
    id: 'employees',
    label: 'Assigned Employees',
    sortable: false,
    render: (row) => row.employees.map(employee => employee.name).join(", "),
  },
  {
    id: 'actions',
    label: 'Actions',
    sortable: false,
    render: () => null,
  },
];

export default function EmployeeTable() {
    useTitle('Table Management')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState<number | undefined>(undefined);
    const [sort, setSort] = useState('');

    const { data, isPending} = useQuery({
        queryKey: ['tables', page, perPage, sort],
        queryFn: ({signal}) => getTables({signal, page, perPage, sort}) 
    })

    const total = data?.total || 0;
    const end = total % 5 === 0 ? total : total + 5;
    
    let rowsPerPageOptions: number[] = []
    for (let i=5; i<=end; i+=5) {
        rowsPerPageOptions.push(i)
    }
    
    return (
        <EnhancedTable 
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
    )
} 