import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { APIPRODUCT } from "../../API";
import App from "../../App";
import { Load } from "../../assets/img";
import { useToast } from "../../context/ToastContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await APIPRODUCT.get(`/products/${id}`);
        const { name, price, description, image } = response.data;
        setFormData({ name, price, description, image });
        if (image) {
          setPreview(`http://localhost:8001/uploads/${image}`);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notifyError("Error fetching product");
      }
    };

    fetchProduct();
  }, [id, notifyError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const { name, price, description, image } = formData;
    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    if (image && typeof image === "object") {
      productData.append("image", image);
    }

    try {
      const response = await APIPRODUCT.put(`/products/${id}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
      navigate("/product");
      notifySuccess("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      setIsLoading(false);
      notifyError("Error updating product");
    }
  };

  return (
    <App title="Edit Product">
      <form onSubmit={handleSubmit} className="col-6">
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
                </div>
              </div>
            </div>
            <button className="btn btn-primary mt-4" type="submit">
              {isLoading ? (
                <div>
                  Updating Product
                  <img
                    src={Load}
                    alt="loading"
                    height="20"
                    width="20"
                    className="ms-2"
                  />
                </div>
              ) : (
                "Update Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </App>
  );
};

export default EditProduct;
