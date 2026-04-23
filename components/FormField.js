import React from "react";

export default function FormField({
  label,
  id,
  error,
  className = "",
  children,
  helper,
}) {
  return (
    <div className={`form-field ${className} ${error ? "form-field--error" : ""}`}>
      <div className="form-field__header">
        <label htmlFor={id}>{label}</label>
        {error ? <span>{error}</span> : helper ? <span>{helper}</span> : null}
      </div>
      {children}
    </div>
  );
}
