import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { APIPRODUCT, PRODUCTBASEURL } from "../../API";
import App from "../../App";
import ModalDelete from "../../component/ModalDelete";
import { useToast } from "../../context/ToastContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { notifySuccess, notifyError } = useToast();

  const navigate = useNavigate();

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await APIPRODUCT.delete(`/products/${selectedProduct.id}`);
      setProducts(products.filter((product) => product.id !== selectedProduct.id));
      setShowModal(false);
      notifySuccess("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      notifyError("Error deleting product");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await APIPRODUCT.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) =>
        row.image ? (
          <img
            src={`${PRODUCTBASEURL}/uploads/${row.image}`}
            alt={row.name}
            style={{ maxHeight: "100px" }}
          />
        ) : null,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="btn btn-primary mr-2" onClick={() => navigate(`/product/edit/${row.id}`)}>Edit</button>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteClick(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredProducts = searchText
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : products;

  return (
    <App title="Product List">
      <DataTable
        title="Product"
        pagination
        subHeader
        subHeaderComponent={
          <div className="d-flex align-items-center justify-content-between col-12">
            <input
              className="form-control col-3 ms-0"
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="btn btn-primary mr-4"
              onClick={() => navigate("/product/add")}
            >
              Add Product
            </button>
          </div>
        }
        highlightOnHover
        striped
        columns={columns}
        data={filteredProducts}
      />

      <ModalDelete
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
      />
    </App>
  );
};

export default ProductList;
