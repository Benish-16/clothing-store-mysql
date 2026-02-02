import React, { useState } from "react";
import { useContext } from "react";

 import alertContext from "../context/alert/alertContext";
export default function ForgotPassword({ setStep, setEmail}) {


  const [emailInput, setEmailInput] = useState("");
     const { showAlert } = useContext(alertContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput }),
    });

    const data = await res.json();

    if (res.ok) {
      setEmail(emailInput);
      setStep(2);
   showAlert("Otp send to your mail",'success');
    } else {
         showAlert(data.error,'danger');
    }
  };

  return (
    <section
  className="gradient-custom d-flex align-items-center justify-content-center"
  style={{
    minHeight: "80vh",
  
  }}
>
  <div className="w-100" style={{ maxWidth: "1000px" }}>
    <div className="card bg-dark text-white mx-auto" style={{ borderRadius: "1rem", width: "450px"  }}>
      <div className="card-body p-4 p-md-5 text-center">
        <h2 className="fw-bold mb-2 text-uppercase">Forgot Password</h2>
        <p className="text-white-50 mb-4">
          Enter your email to receive an OTP
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-outline form-white mb-4">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>

          <button className="btn btn-outline-light btn-lg w-100" type="submit">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  </div>
</section>


  );
}
