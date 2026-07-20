import { useQuery } from "@tanstack/react-query"
import { getEmployees } from "../util/http.js"
import useTitle from "../hooks/useTitle.js";
import EnhancedTable from "../components/Table.jsx";
import { useState } from "react";


export default function Employees() {
    useTitle('Food Management')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState<number | undefined>(undefined);
    const [sort, setSort] = useState('');

    const { data, isPending, isError, error} = useQuery({
        queryKey: ['employees', page, perPage, sort],
        queryFn: ({signal}) => getEmployees({signal, page, perPage, sort}) 
    })

    const total = data?.total || 0;
    const end = total % 5 === 0 ? total : total + 5;
    
    let rowsPerPageOptions: number[] = []
    for (let i=5; i<=end; i+=5) {
        rowsPerPageOptions.push(i)
    }
    
    return (
        <EnhancedTable 
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