import React,{useState} from "react";
import "../ProductItem.css";
import { useNavigate } from "react-router-dom";

export default function ProductItem({ product,onDelete  }) {

  const navigate = useNavigate();

  if (!product) return null;

  const variants = product.variants || [];
  const { name, price } = product;

  return (
    <div className="col-sm-6 col-md-4 col-lg-4 mb-3">
      <div
        className="card product-card border-0 shadow-sm"
        style={{ cursor: "pointer" }}
        onClick={() =>navigate(`/product/${product.id}` )
}
      >
        <img
          src={variants?.[0]?.images}
          className="card-img-top product-img"
          alt={name}
        />

        <div className="card-body text-center">
          <h6 className="card-title mb-1">{name}</h6>
          <p className="fw-bold mb-0">₹{price}</p>
        </div>
      </div>
    </div>
  );
}
