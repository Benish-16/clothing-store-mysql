import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart/CartState";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import '../ProductDetail.css'
import { useLocation } from "react-router-dom";


export default function ProductDetail() {
    const location = useLocation();

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useContext(authContext);
  const { showAlert } = useContext(alertContext);

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-dark loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <i className="bi bi-exclamation-circle"></i>
        <h3>Product not found</h3>
        <button className="btn btn-dark" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

const handleDelete = async (productId) => {
  
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/product/delete",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    showAlert("Product deleted","success");
  navigate(-1);
      
  } else {
    showAlert( "Delete failed","danger");
  }
};

  const selectedStock = selectedVariant && selectedSize
    ? selectedVariant.sizes.find((s) => s.size === selectedSize)?.quantity
    : null;

  const getStockClass = () => {
    if (selectedStock === null) return '';
    if (selectedStock > 5) return 'in-stock';
    if (selectedStock > 0) return 'low-stock';
    return 'out-of-stock';
  };

  const getStockMessage = () => {
    if (selectedStock === null) return '';
    if (selectedStock > 5) return `In Stock (${selectedStock} available)`;
    if (selectedStock > 0) return `Low Stock - Only ${selectedStock} left!`;
    return 'Out of Stock';
  };
const Wrapper = user?.admin? "main" : "div";
 

const wrapperProps = user?.admin
  ? { className: "main"  ,style: { maxWidth: "1200px" }}
  : {
      className: "container py-4 fade-in",
      style: { maxWidth: "1200px" },
    };
  return (
     
  <Wrapper {...wrapperProps}>

      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
        <span>Back to Shopping</span>
      </button>

      <div className="row g-5 align-items-start mt-2">
       
        <div className="col-lg-6">
          <div className="product-image-container">
            <img
              src={selectedVariant?.images || product.variants[0]?.images}
              className="img-fluid w-100"
              alt={product.name}
            />

         
            {user?.admin && (
              <div className="admin-actions">
                <button
                  className="admin-action-btn"
                  title="Edit Product"
                  onClick={() => navigate("/editproduct", { state: product})}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>

              <button
  className="admin-action-btn delete"
  title="Delete Product"
  onClick={() => handleDelete(product._id)}>
   <i className="bi bi-trash-fill"></i>

</button>
              </div>
            )}

         
            {selectedStock !== null && selectedStock > 0 && selectedStock <= 5 && (
              <div className="stock-badge">
                <i className="bi bi-exclamation-triangle-fill"></i>
                Only {selectedStock} left!
              </div>
            )}
          </div>
        </div>

    
        <div className="col-lg-6 ">
          <div className="d-flex flex-column h-100">
         
            {user?.admin && (
              <span className="admin-badge">
                <i className="bi bi-shield-check"></i>
                ADMIN VIEW
              </span>
            )}

           
            <h1 className="product-title">{product.name}</h1>

           
            <p className="product-description mt-2">{product.description}</p>

          
            <div className="price-container">
              <h2 className="product-price">
                ₹{product.price.toLocaleString("en-IN")}
              </h2>
              <small className="price-tax-info">Inclusive of all taxes</small>
            </div>

          
            <hr className="section-divider mt-2" />

         
            <div className="mb-4">
              <div className="section-header">
             
               
              </div>
              <div className="color-selector">
                {product.variants.map((v) => (
                  <span
                    key={v.color}
                    className={`color-circle ${
                      selectedVariant?.color === v.color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: v.color }}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedSize("");
                    }}
                  />
                ))}
              </div>
            </div>

          
            {selectedVariant && (
              <div className="mb-4">
                <div className="section-header">
                  <p className="section-title">Select Size</p>
                  {selectedSize && (
                    <span className="section-value">Size: {selectedSize}</span>
                  )}
                </div>
                <div className="size-selector mt-2">
                  {selectedVariant.sizes.map((s) => (
                    <span
                      key={s.size}
                      className={`size-box ${
                        selectedSize === s.size ? "selected" : ""
                      } ${s.quantity === 0 ? "out-of-stock" : ""}`}
                      onClick={() => s.quantity > 0 && setSelectedSize(s.size)}
                    >
                      {s.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            
            {selectedStock !== null && (
              <div className={`stock-info ${getStockClass()}`}>
                <i className={`bi ${
                  selectedStock > 5 
                    ? 'bi-check-circle-fill' 
                    : selectedStock > 0 
                    ? 'bi-exclamation-triangle-fill' 
                    : 'bi-x-circle-fill'
                }`}></i>
                <span>{getStockMessage()}</span>
              </div>
            )}

         
            {!user?.admin && (
              <div className="mt-auto">
                <button
                  className="add-to-cart-btn"
                  disabled={!selectedVariant || !selectedSize || selectedStock === 0}
                  onClick={() =>
                    addToCart({
                      productId: product._id,
                      color: selectedVariant.color,
                      size: selectedSize,
                      quantity: 1,
                      price: product.price,
                    })
                  }
                >
                  <i className="bi bi-bag-plus-fill" style={{ fontSize: '1.2rem' }}></i>
                  <span>Add to Cart</span>
                </button>
                
                {(!selectedVariant || !selectedSize) && (
                  <p className="add-to-cart-helper">
                    Please select color and size
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}