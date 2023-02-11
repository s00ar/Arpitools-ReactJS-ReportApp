import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reset from "./pages/Reset";

function App() {
  const router = createBrowserRouter([
    {
      path: "report/",
      element: <Home />,
    },
    {
      path: "reset-passowrd/",
      element: <Reset />,
    },
    {
      path: "*",
      element: <Login />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;