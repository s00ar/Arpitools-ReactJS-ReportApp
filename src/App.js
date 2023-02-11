import React from "react";
import {
  createBrowserRouter,
  BrowserRouter as Router,
  HashRouter
} from "react-router-dom";
import { Route, Routes } from "react-router-dom";
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
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Home />} />
          <Route path="/reset-passowrd" element={<Reset />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;