import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpf, setOtpf] = useState("");

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "1rem" }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {step === 1 && (
          <ForgotPassword setStep={setStep} setEmail={setEmail} />
        )}
        {step === 2 && (
          <VerifyOtp
            email={email}
            setStep={setStep}
            setOtpf={setOtpf}
          />
        )}
        {step === 3 && (
          <ResetPassword email={email} otpf={otpf} />
        )}
      </div>
    </div>
  );
}
