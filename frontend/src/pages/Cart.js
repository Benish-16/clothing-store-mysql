import React from "react";
import { useCart } from "../context/cart/CartState";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, addToCart,removeFromCart, loading } = useCart();
  const [deliveryType, setDeliveryType] = React.useState("Standard");
const [shipping, setShipping] = React.useState(5);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
const add=( item,qty)=>{
  console.log("id",item.product_id);
  const cartItem = {
    productId: item.product_id,
    color: item.variant_color,
    size: item.size,
    image: item.variant_image,
    quantity: qty,
    price: item.price,
 
  };
  console.log( cartItem);

    addToCart(cartItem, qty);

}
  if (loading) {
    return <h3 className="text-center mt-5">Loading cart...</h3>;
  }

  return (
    <section className="h-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-4 py-lg-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card rounded-4 shadow-sm">
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-8 col-12">
                    <div className="p-4 p-lg-5">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Shopping Cart</h2>
                        <span className="text-muted">{totalItems} items</span>
                      </div>
                      <hr />

                      {cartItems.length === 0 && (
                        <p className="text-center text-muted">
                          Your cart is empty
                        </p>
                      )}

                      {cartItems.map((item) => (
                        <div key={item.id}>
                          <div className="row align-items-center gy-3 mb-4">
                    
                            <div className="col-md-2 col-4">
                              <img
                                src={item.variant_image}
                                alt={item.name}
                                className="img-fluid rounded"
                                style={{
                                  maxHeight: "90px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>

                            <div className="col-md-3 col-8">
                              <h6 className="mb-1">{item.name}</h6>
                              <small className="text-muted">
                                Color: {item.variant_color}
                              </small>
                              <br />
                              <small className="text-muted">
                                Size: {item.size}
                              </small>
                            </div>

                         
                            <div className="col-md-3 col-12 d-flex justify-content-center align-items-center">
                              <button
                                onClick={() =>add(item, -1)}
                                className="btn btn-outline-secondary btn-sm px-3"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>

                              <input
                                type="number"
                                value={item.quantity}
                                readOnly
                                className="form-control form-control-sm mx-2 text-center"
                                style={{ width: "60px" }}
                              />

                              <button
                                onClick={() => add(item, 1)}
                                className="btn btn-outline-secondary btn-sm px-3"
                              >
                                +
                              </button>
                            </div>

                       
                            <div className="col-md-2 col-6 text-md-end">
                              <strong>€ {(item.price * item.quantity).toFixed(2)}</strong>
                            </div>

                           
                            <div className="col-md-2 col-6 text-end">
                              <button
                                className="btn btn-link text-danger fs-5"
                                onClick={() => removeFromCart(item)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <hr />
                        </div>
                      ))}

                      <a href="/" className="text-decoration-none text-dark">
                        ← Back to shop
                      </a>
                    </div>
                  </div>

            
                  <div className="col-lg-4 col-12 bg-light">
                    <div className="p-4 p-lg-5">
                      <h4 className="fw-bold mb-4">Summary</h4>
                      <hr />

                      <div className="d-flex justify-content-between mb-3">
                        <span>Items ({totalItems})</span>
                        <span>€ {(subtotal ).toFixed(2)}</span>
                      </div>

                      <h6 className="text-uppercase">Shipping</h6>
<select
  className="form-select mb-4"
  onChange={(e) => {
    const value = Number(e.target.value);
    setShipping(value);
    setDeliveryType(value === 5 ? "Standard" : "Express");
  }}
>
                        <option value={5}>Standard Delivery - €5.00</option>
                        <option value={10}>Express Delivery - €10.00</option>
                      </select>

                     

                      <hr />

                      <div className="d-flex justify-content-between mb-4">
                        <strong>Total</strong>
                        <strong>€ {(subtotal + shipping).toFixed(2)}</strong>
                      </div>

                    <button
  className="btn btn-dark w-100 btn-lg"
  onClick={() =>
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        shippingCost: shipping,
        deliveryType,
        total: subtotal + shipping,
      },
    })
  }
>
  Checkout
</button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
