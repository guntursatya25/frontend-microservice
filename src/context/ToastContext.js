import React, { createContext, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ToastContext = createContext();
const MySwal = withReactContent(Swal);

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastProvider = ({ children }) => {
  const toast = (type, title, message) => {
    MySwal.fire({
      icon: type,
      title: title,
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const notifySuccess = (message) => {
    toast("success", "Success", message);
  };

  const notifyError = (message) => {
    toast("error", "Error", message);
  };

  const notifyWarning = (message) => {
    toast("warning", "Warning", message);
  };

  const notifyInfo = (message) => {
    toast("info", "Info", message);
  };

  return (
    <ToastContext.Provider
      value={{
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
