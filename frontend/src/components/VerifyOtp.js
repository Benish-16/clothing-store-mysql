import React, { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";

export default function VerifyOtp({ email, setStep, setOtpf }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { showAlert } = useContext(alertContext);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("OTP verified", "success");
        setOtpf(finalOtp);
        setStep(3);
      } else {
        showAlert(data.error, "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "danger");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <form
        onSubmit={handleVerify}
        className="bg-white p-5 rounded-4 shadow-lg"
       
      >
        <h3 className="text-center mb-4 fw-bold">Verify OTP</h3>
        <p className="text-center text-muted mb-4">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        <div className="d-flex justify-content-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              className="form-control text-center mx-1 border border-2 rounded"
              style={{
                width: "50px",
                height: "50px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                transition: "all 0.2s",
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              required
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 py-2 fw-bold"
          style={{ fontSize: "1.1rem" }}
        >
          Verify OTP
        </button>

       
      </form>
    </div>
  );
}
