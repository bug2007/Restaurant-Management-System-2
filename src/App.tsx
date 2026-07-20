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
    children: [
      {
        index: true,
        loader: checkAuthLoader,
        element: <Navigate to="employees" replace />, // pressing back goes back to whatever page the user was on before /dashboard, not to /dashboard itself. that wud lead user to /dashboard/employees again so user wud bounce back and forth
      },
      {
        path: "employees",
        loader: checkAuthLoader,
        element: <Employees />,
      },
      {
        path: "tables",
        loader: checkAuthLoader,
        element: <EmployeeTable />,
      },
      {
        path: "foods",
        loader: checkAuthLoader,
        element: <Foods />,
      },
      {
        path: "new-order",
        loader: checkAuthLoader,
        element: <NewOrder />,
      },
      {
        path: "orders",
        loader: checkAuthLoader,
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
