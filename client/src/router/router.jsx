import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import NotificationBootstrap from "../providers/NotificationBootstrap";
import Loader from "../components/Loader";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const CreateTicketPage = lazy(() => import("../pages/CreateTicketPage"));
const AllTicketsPage = lazy(() => import("../pages/AllTicketsPage"));
const MyTicketsPage = lazy(() => import("../pages/MyTicketsPage"));
const TicketDetailsPage = lazy(() => import("../pages/TicketDetailsPage"));

function PageLoader({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <NotificationBootstrap />
      <PageLoader>{children}</PageLoader>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PageLoader>
        <LoginPage />
      </PageLoader>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedPage>
        <HomePage />
      </ProtectedPage>
    ),
  },
  {
    path: "/tickets/create",
    element: (
      <ProtectedPage>
        <CreateTicketPage />
      </ProtectedPage>
    ),
  },
  {
    path: "/tickets/all",
    element: (
      <ProtectedPage>
        <AllTicketsPage />
      </ProtectedPage>
    ),
  },
  {
    path: "/tickets/my",
    element: (
      <ProtectedPage>
        <MyTicketsPage />
      </ProtectedPage>
    ),
  },
  {
    path: "/tickets/:id",
    element: (
      <ProtectedPage>
        <TicketDetailsPage />
      </ProtectedPage>
    ),
  },
]);

export default router;
