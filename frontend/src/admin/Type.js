import React, { useState ,useContext} from "react";
import { useLocation } from "react-router-dom";
import alertContext from "../context/alert/alertContext";

import {  Navigate, useNavigate } from "react-router-dom";
export default function AddType() {
     const navigate = useNavigate();
  const location = useLocation();
        const { showAlert } = useContext(alertContext);
  const categoryFromRoute = location.state?.category || "";

  const [formData, setFormData] = useState({
    name: "",
    category: categoryFromRoute,
    image: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const payload = {
      name: formData.name.trim(),
      category:
        formData.category.charAt(0).toUpperCase() +
        formData.category.slice(1).toLowerCase(),
      image: formData.image.trim()
    };

    try {
      const res = await fetch("http://localhost:5000/api/type/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
      
        showAlert( "Failed to add type",'danger');
       
        return;
      }

      showAlert(`Type "${payload.name}" added successfully!`,'success');
      navigate(-1);

 
      setFormData((prev) => ({ ...prev, name: "", image: "" }));
    } catch (error) {
      console.error(error);
      showAlert("Server error. Please try again.",'danger');
    }
  };

  return (
         <main className="main mt-5">
    <div className="container my-4 px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light text-center">
              <h5 className="mb-0">Add Product Type</h5>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Type Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Type Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="e.g. Shirt, T-Shirt"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select className="form-select" value={formData.category} disabled>
                    <option value={formData.category}>{formData.category}</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100">
                  Add Type
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
        </main>
  );
}
