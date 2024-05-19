import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Login from "../pages/Auth/Login";
import { useToken } from "../context";
import { AddProduct, ProductList } from "../pages/Product";
import { Loader } from "../component";
import EditProduct from "../pages/Product/EditProduct";

function PrivateRoute({ element }) {
  const { isAuthenticated, isLoading } = useToken();

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Loader />
    element: <PrivateRoute element={<App />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/product",
    element: <PrivateRoute element={<ProductList />} />,
  },
  {
    path: "/product/add",
    element: <PrivateRoute element={<AddProduct />} />,
  },
  {
    path: "/product/edit/:id",
    element: <PrivateRoute element={<EditProduct />} />,
  }
]);

export default router;
