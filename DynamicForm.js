import React, { useState, useEffect } from "react";
import "./DynamicForm.css"; // Optional CSS for responsiveness and styling

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  const mockApiResponses = {
    userInfo: {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    addressInfo: {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    paymentInfo: {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  const handleFormTypeChange = (e) => {
    const selectedForm = e.target.value;
    setFormType(selectedForm);
    setFormData(mockApiResponses[selectedForm]?.fields || []);
    setFormValues({});
  };

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });

    const requiredFields = formData.filter((field) => field.required).length;
    const filledFields = Object.entries(formValues).filter(
      ([key, val]) => val && formData.some((field) => field.name === key && field.required)
    ).length;

    setProgress(Math.round(((filledFields + 1) / requiredFields) * 100));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData([...submittedData, formValues]);
      setFormValues({});
      setProgress(0);
      alert("Form submitted successfully!");
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  const validateForm = () => {
    return formData.every(
      (field) =>
        !field.required || (formValues[field.name] && formValues[field.name].trim() !== "")
    );
  };

  const handleEdit = (index) => {
    setFormValues(submittedData[index]);
    setSubmittedData(submittedData.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    alert("Entry deleted successfully.");
  };

  return (
    <div className="dynamic-form">
      <header>
        <h1>Dynamic Form Implementation</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Form Type:</label>
          <select value={formType} onChange={handleFormTypeChange}>
            <option value="">-- Select --</option>
            <option value="userInfo">User Information</option>
            <option value="addressInfo">Address Information</option>
            <option value="paymentInfo">Payment Information</option>
          </select>
        </div>

        {formData.map((field) => (
          <div key={field.name}>
            <label>
              {field.label} {field.required && "*"}
            </label>
            {field.type === "dropdown" ? (
              <select
                value={formValues[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              >
                <option value="">-- Select --</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formValues[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            )}
          </div>
        ))}

        {formType && (
          <>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <button type="submit">Submit</button>
          </>
        )}
      </form>

      {submittedData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer>
        <p>Dynamic Form Footer - Responsive Design</p>
      </footer>
    </div>
  );
};

export default DynamicForm;
