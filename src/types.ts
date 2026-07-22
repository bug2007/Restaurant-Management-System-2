import React from "react";

export interface SingleRow {
    id: string | number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  image: string | null;
  phoneNumber: string;
}

export interface Employee {
  id: string;
  designation: string;
  joinDate: string;
  user: User;
}

export interface AssignedEmployee {
  employeeTableId: number;
  employeeId: string;
  name: string;
}

export interface EmployeeTable {
  id: number;
  tableNumber: string;
  numberOfSeats: number;
  isOccupied: boolean;
  image: string | null;
  employees: AssignedEmployee[];
}

export interface HeadCell<T> {
  id: string;
  label: string;
  sortable: boolean;
  renderImage?: (row: T) => string | null;
  render: (row: T) => React.ReactNode;
}
 
export interface EnhancedTableHeadProps<T extends SingleRow> {   //T can be any type, as long as it has at least the properties of SingleRow
  order: "asc" | "desc";
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: string
  ) => void;
  headCells: HeadCell<T>[];
}

export interface EnhancedTableProps<T extends SingleRow> {
  rows: T[];
  total: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  isPending: boolean;
  headCells: HeadCell<T>[];
  handleStartDelete: (id: SingleRow["id"]) => void;
}