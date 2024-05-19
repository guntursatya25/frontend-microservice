import React from "react";

const ModalDelete = ({ show, onHide, onConfirm, productName }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Confirm Delete</h4>
            <button type="button" className="close" onClick={onHide}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete {productName}?</p>
          </div>
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-default" onClick={onHide}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
