import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../util/http.js";
import useTitle from "../hooks/useTitle.js";
import EnhancedTable from "../components/EnhancedTable.js";
import { useState } from "react";

import type { Employee, HeadCell } from "../types.ts";

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
  );
}
