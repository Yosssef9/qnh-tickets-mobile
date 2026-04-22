import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateTicketPage from "../pages/CreateTicketPage";
import AllTicketsPage from "../pages/AllTicketsPage";
import MyTicketsPage from "../pages/MyTicketsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets/create",
    element: (
      <ProtectedRoute>
        <CreateTicketPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets/all",
    element: (
      <ProtectedRoute>
        <AllTicketsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets/my",
    element: (
      <ProtectedRoute>
        <MyTicketsPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
