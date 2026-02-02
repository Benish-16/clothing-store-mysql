import React, { useState, useEffect } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";

export default function EditType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

const { name, image } = location.state || {};

  const [formData, setFormData] = useState({
    name: name || "",
  image: image || ""
  });


  const [loading, setLoading] = useState(!name); 


  useEffect(() => {
    const fetchType = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/type/${id}`);
        const data = await res.json();
        setFormData({
          name: data.name,
          image: data.image,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchType();
  }, [id]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5000/api/type/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      navigate(-1); 
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
         <main className="main mt-5">
    <div className="container py-5 mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 fw-bold text-center">Edit Type</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        
        <div className="mb-3">
          <label className="form-label">Type Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
           disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

      
        <div className="d-flex justify-content-between">
          

          <button type="submit" className="btn btn-dark">
            Update Type
          </button>
        </div>
      </form>
    </div>
         </main>
  );
}
