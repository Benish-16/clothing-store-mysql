import React, { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "./ProductItem";
import authContext from "../context/auth/authContext";

import { useNavigate } from "react-router-dom";

export default function ProductItemsPage() {
      const navigate = useNavigate();
  const { user } = useContext(authContext);
  const { category, type } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
        `http://localhost:5000/api/product/fetchproduct?category=${category}&type=${type}`
        );
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, type]);
  
  const handleDelete = (id) => {
  setProducts(product => product.filter(p => p._id !== id));
};
console.log(type,category);
const Wrapper = user?.admin? "main" : "div";
  return (
    <Wrapper className={user?.admin? "main" : "container py-5 mt-5 "}>

    
    <h2 className="mb-4 text px-5" >
      {type}s for {category}
    </h2>
  

  

    {loading && <p className="text-center mt-5">Loading products...</p>}

    {!loading && products.length === 0 && (
      <p className="text-center mt-5">No products found....</p>
    )}
 
    <div className="row g-4">
      {products.map((product) => (
        <ProductItem
          key={product._id}
          product={product}
          onDelete={handleDelete}
        />
      ))}
    </div>
     {user?.admin === true && (
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-dark d-flex align-items-center gap-2"
          onClick={() => navigate("/addproduct", { state: { category ,type} })}
        >
          <i className="bi bi-plus-lg"></i>
          Add Product
        </button>
      </div>
    )}
  </Wrapper>
 
);

}
