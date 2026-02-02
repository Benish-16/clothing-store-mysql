import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import alertContext from "../context/alert/alertContext";

export default function EditProduct() {
  const navigate = useNavigate();
  const { showAlert } = useContext(alertContext);
  const { state: product } = useLocation();


  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [variants, setVariants] = useState(product?.variants || []);

  if (!product) return <p>No product data</p>;





  const addColor = () => {
    setVariants([
      ...variants,
      { color: "", images: "", sizes: [] }
    ]);
  };

  const deleteColor = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addSize = (index) => {
    const updated = [...variants];
    updated[index].sizes.push({ size: "", quantity: 0 });
    setVariants(updated);
  };

  const deleteSize = (index, sindex) => {
    const updated = [...variants];
    updated[index].sizes = updated[index].sizes.filter((_, i) => i !== sindex);
    setVariants(updated);
  };

  // ===== Save Changes =====
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/product/update/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            name,
            description,
            price,
            variants,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showAlert("Product updated successfully!", "success");
        navigate(-1);
      } else {
        showAlert("Failed to update product.", "danger");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      showAlert("Server error while updating product.", "danger");
    }
  };

  // ===== JSX =====
  return (
    <main className="main mt-5">
      <div className="container my-4">
        <h3>Edit Product</h3>

        {/* Product Name */}
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />

        {/* Description */}
        <textarea
          className="form-control mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description"
          rows={3}
        />

        {/* Price */}
        <input
          type="number"
          className="form-control mb-3"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
          min={0}
        />

        {/* Variants */}
        {variants.map((variant, index) => (
          <div key={index} className="border p-3 mb-3 rounded">
            <div className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                value={variant.color}
                placeholder="Color"
                onChange={(e) => {
                  const updated = [...variants];
                  updated[index].color = e.target.value;
                  setVariants(updated);
                }}
              />
            </div>

            <input
              className="form-control mb-2"
              value={variant.images}
              placeholder="Image URL"
              onChange={(e) => {
                const updated = [...variants];
                updated[index].images = e.target.value;
                setVariants(updated);
              }}
            />

            {variant.sizes.map((s, sindex) => (
              <div key={sindex} className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="Size"
                  value={s.size}
                  onChange={(e) => {
                    const updated = [...variants];
                    const value = e.target.value.toUpperCase();
                    const exists = updated[index].sizes.some(
                      (item, i) => item.size === value && i !== sindex
                    );
                    if (exists) {
                      alert("Size already exists for this color");
                      return;
                    }
                    updated[index].sizes[sindex].size = value;
                    setVariants(updated);
                  }}
                />

                <input
                  type="number"
                  className="form-control"
                  placeholder="Qty"
                  value={s.quantity}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[index].sizes[sindex].quantity = Number(e.target.value);
                    setVariants(updated);
                  }}
                  step={1}
                  onKeyDown={(e) => e.preventDefault()}
                />

                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteSize(index, sindex)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              className="btn btn-outline-secondary mx-2"
              onClick={() => addSize(index)}
            >
              + Add Size
            </button>

            <button
              className="btn btn-danger"
              onClick={() => deleteColor(index)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ))}

        <button className="btn btn-outline-dark mb-3" onClick={addColor}>
          + Add Color
        </button>

        <div className="d-flex gap-2">
          <button onClick={handleSaveChanges} className="btn btn-success">
            Save Changes
          </button>

          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
