import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { APIPRODUCT } from "../../API";
import App from "../../App";
import { Load } from "../../assets/img";
import { useToast } from "../../context/ToastContext";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateInput(name, value);
  };

  const handleFileChange = (file) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    validateInput("image", file);
  };

  const validateInput = (name, value) => {
    let error = "";
    if (name === "name" && !value) {
      error = "Name is required";
    } else if (name === "price" && (!value || value <= 0)) {
      error = "Price must be a positive number";
    } else if (name === "description" && !value) {
      error = "Description is required";
    } else if (name === "image" && !value) {
      error = "Image is required";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formData).forEach((key) => {
      validateInput(key, formData[key]);
    });

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      notifyError("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    const { name, price, description, image } = formData;
    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("image", image);

    try {
      const response = await APIPRODUCT.post("/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
      navigate("/product");
      notifySuccess("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      setIsLoading(false);
      notifyError("Error adding product");
    }
  };

  return (
    <App title="Add Product">
      <form onSubmit={handleSubmit} className="col-12 col-md-6 ">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  {errors.price && (
                    <small className="text-danger">{errors.price}</small>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                  {errors.description && (
                    <small className="text-danger">{errors.description}</small>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Image</label>
                  <div
                    {...getRootProps()}
                    className="dropzone"
                    style={{
                      border: "2px dashed #007bff",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <input {...getInputProps()} />
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    ) : isDragActive ? (
                      <p>Drop the files here...</p>
                    ) : (
                      <p>
                        Drag or drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                  {errors.image && (
                    <small className="text-danger">{errors.image}</small>
                  )}
                </div>
              </div>
            </div>
            <button className="btn btn-primary mt-4" type="submit">
              {isLoading ? (
                <div>
                  Adding Product
                  <img
                    src={Load}
                    alt="loading"
                    height="20"
                    width="20"
                    className="ms-2"
                  />
                </div>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </App>
  );
};

export default AddProduct;
