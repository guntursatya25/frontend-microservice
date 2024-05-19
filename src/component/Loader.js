import React from "react";
import { Load } from "../assets/img";
const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      <p>Loading...</p>
      <img src={Load} alt="loadingg" height="60" width="60" />
    </div>
  );
};

export default Loader;
