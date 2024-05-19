import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { APIUSER, getCsrfToken } from "../../API";
import { Load } from "../../assets/img";
import { useToken } from "../../context";

const Login = () => {
  const { setToken, isAuthenticated } = useToken();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true); 
      try {
        await getCsrfToken();
        const response = await APIUSER.post("/auth/login", {
          email: values.email,
          password: values.password,
        });

        const data = response.data;
        if (data.success === true) {
          setToken(data.data.token);
          navigate("/");
        } else {
          setErrorMessage("Invalid email or password.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false); 
      }
    },
  });

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <a href="../../index2.html" className="h1">
              <b>Login</b>
            </a>
          </div>
          <div className="card-body">
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <form onSubmit={formik.handleSubmit}>
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
                <input
                  type="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <span
                    id="exampleInputEmail1-error"
                    className="error invalid-feedback"
                  >
                    Please enter a email address
                  </span>
                ) : null}
              </div>

              <div className="input-group mb-3">
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
                <input
                  type={showPassword ? "text" : "password"} 
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <span
                    id="exampleInputPassword-error"
                    className="error invalid-feedback"
                  >
                    Please enter a password
                  </span>
                ) : null}
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label" htmlFor="showPassword">
                  Show Password
                </label>
              </div>

              <div className="row mb-3">
                <div className="col-12 col-md-6">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? <div>Signing In <img src={Load} alt="loading" height="20" width="20" className="ms-2"/></div> : "Sign In"}
                  </button>
                </div>
              </div>
            </form>

            {/* <p className="mb-1">
              <a href="forgot-password.html">I forgot my password</a>
            </p>
            <p className="mb-0">
              <a href="register.html" className="text-center">
                Register a new membership
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
