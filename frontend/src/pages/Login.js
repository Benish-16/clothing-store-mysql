import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";

export default function Login() {
       const { showAlert } = useContext(alertContext);
  const navigate = useNavigate();
  const { login } = useContext(authContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });


  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();

      if (json.success) {
        login(json.authToken, json.user);
        navigate("/");
      } 
      
      else {
        
        showAlert(json.error,'danger');
      }
    } catch (err) {
  
         showAlert("Something went wrong. Please try again.",'danger');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">

                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-4">
                    Please enter your email and password
                  </p>

               
                 

                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={onChange}
                      className="form-control form-control-lg"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={onChange}
                      className="form-control form-control-lg"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <p className="small mb-4">
                    <Link className="text-white-50" to="/forgot-password">
                      Forgot password?
                    </Link>
                  </p>

                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white-50 fw-bold">
                      Sign Up
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
