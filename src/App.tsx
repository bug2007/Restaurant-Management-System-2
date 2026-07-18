import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./util/http";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import AppNavigation from "./components/AppNavigation";
import Foods from "./pages/Foods";
import NewOrder from "./pages/NewOrder";
import Orders from "./pages/Orders";
import EmployeeTable from "./pages/EmployeeTable";
import { checkAuthLoader } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <AppNavigation />,
    loader: checkAuthLoader,
    children: [
      {
        index: true,
        element: <Navigate to="employees" replace />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "tables",
        element: <EmployeeTable />,
      },
      {
        path: "foods",
        element: <Foods />,
      },
      {
        path: "new-order",
        element: <NewOrder />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

// gradient color:
// light: f7f2ab
// dark: bda734
