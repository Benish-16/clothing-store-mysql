import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import alertContext from "../context/alert/alertContext";

export default function ResetPassword({ email, otpf }) {
  const navigate = useNavigate();
  const { showAlert } = useContext(alertContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return showAlert("Passwords do not match", "danger");
    }

    if (!email || !otpf) {
      return showAlert("Reset session expired. Please try again.", "danger");
    }

    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp: otpf,
        newPassword: password,
      }),
    });
         const data = await res.json();

    if (res.ok) {
      showAlert("Password reset successful", "success");
      navigate("/login");
    } else {
      showAlert(data.error, "danger");
    }
  };

  return (
      <div className="w-100" style={{ maxWidth: "1000px" }}>
    <div className="card bg-dark text-white mx-auto" style={{ borderRadius: "1rem", width: "450px"  }}>
      <div className="card-body p-4 p-md-5 text-center">
                <h2 className="text-center fw-bold mb-4">
                  Reset Password
                </h2>

                <form onSubmit={handleReset}>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-outline-light btn-lg w-100"
                  >
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>
      
      
  );
}
