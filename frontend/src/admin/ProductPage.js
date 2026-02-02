import React, { useState,useContext } from "react";

import alertContext from "../context/alert/alertContext";

import { useLocation, Navigate, useNavigate } from "react-router-dom";

export default function ProductPage({ onSubmit }) {
      const { showAlert } = useContext(alertContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [color, setColor] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
 
  const location = useLocation();
   const navigate = useNavigate();
const category = location.state?.category;
const type = location.state?.type;


const handleSubmit = async (e) => {
  e.preventDefault();

  const sizes = [{ size, quantity: Number(quantity) }];
  const variants = [{ color, images: imgurl, sizes }];

  const productData = {
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    category,
    type,
    variants,
  };
  console.log(JSON.stringify(productData));
  try {
    const res = await fetch("http://localhost:5000/api/product/addproduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    
    });

    const data = await res.json();

    if (res.ok) {
      showAlert("Product added", "success");
      navigate(-1);
   
    } else {
      showAlert(data?.message || "Something went wrong", "danger");
    }
  } catch (err) {
    showAlert("Server error", "danger");
    console.error(err);
  }
};

  return (
         <main className="main mt-5">
    <div className="d-flex justify-content-center my-3 ">
      <form
        onSubmit={handleSubmit}
        className="p-3 border rounded shadow-sm w-100"
        style={{ maxWidth: "600px" }} 
      >
        <h3 className="mb-4 text-center">Add New Product</h3>

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
             minLength={3}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
            minLength={15}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
         <div className="mb-3">
          <label className="form-label"> Color</label>
          <input
         
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
           <select className="form-select" value={category} disabled>
    <option value={category}>{category}</option>
    </select>
        </div>
         <div className="mb-3">
           <select className="form-select" value={type} disabled>
    <option value={type}>{type}</option>
    </select>
        </div>
      

 
   <div className="mb-3 p-3 border rounded">
           <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                value={imgurl}
                onChange={(e) => setImgurl(e.target.value)}
                required
              />
        </div>
         <div className="mb-3 p-3 border rounded">
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                placeholder="S, M, L"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              /></div>
              <div className="mb-3 p-3 border rounded">
          
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min={0}
              />
       </div>

        <button type="submit" className="btn btn-dark w-100 mt-3">
          Submit Product
        </button>
      </form>
    </div>
    </main>
  );
}
