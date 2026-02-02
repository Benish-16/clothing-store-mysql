import React ,{useState,useContext} from 'react';
import alertContext from "../context/alert/alertContext";
import { useNavigate} from "react-router-dom";
import { validatePassword } from "../utils/validatePassword";
export default function Signup() {
      const { showAlert } = useContext(alertContext);
    const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
         email: "",
         password: "",
         name:"",
         cpassword:""
       });
  const [passwordErrors, setPasswordErrors] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
const { name, email, password, cpassword } = credentials;
if (password !== cpassword) {
  showAlert("Passwords do not match",'danger');
  return;
}


    const response = await fetch("http://localhost:5000/api/auth/createuser", {
       
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       name,email,password
      })
    });

    const json = await response.json();
    console.log(json);
    if(json.success){
localStorage.setItem('token',json.authToken);
navigate('/')
 
 
}
    else{
 showAlert(json.error, 'danger');
    }
  };
   const onChange = (e) => {
  setCredentials({ ...credentials, [e.target.name]: e.target.value });
};


    return (
    <form className="vh-100 gradient-custom" onSubmit={handleSubmit}>

      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">

                <div className="mb-md-5 mt-md-4 pb-5">

                  <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                  <p className="text-white-50 mb-5">Please enter your details to create an account!</p>

                
                  <div data-mdb-input-init className="form-outline form-white mb-4">
                    <input 
                      type="text" 
                      id="name" 
                        name="name"
                      className="form-control form-control-lg" 
                      placeholder="Full Name"
                         value={credentials.name}
                           onChange={onChange}

                    />
                  </div>

              
                  <div data-mdb-input-init className="form-outline form-white mb-4">
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="form-control form-control-lg" 
                      placeholder="Email"
                         value={credentials.email} 
                           onChange={onChange}
                    />
                  </div>

               
                  <div data-mdb-input-init className="form-outline form-white mb-4">
                <input 
  type="password" 
  id="password" 
  name="password"
  className="form-control form-control-lg" 
  placeholder="Password" 
  value={credentials.password}
  onChange={(e) => {
    onChange(e);
    const errors = validatePassword(e.target.value);
    setPasswordErrors(errors);
  }}
/>
{passwordErrors.length > 0 && (
  <div className="text-start mb-3">
    {passwordErrors.map((err, index) => (
      <small key={index} className="text-danger d-block">
        • {err}
      </small>
    ))}
  </div>
)}

                  </div>

               
                  <div data-mdb-input-init className="form-outline form-white mb-4">
                    <input 
                      type="password" 
                      id="cpassword" 
                       name="cpassword"
                      className="form-control form-control-lg" 
                      placeholder="Confirm Password" 
                         value={credentials.cpassword}
                           onChange={onChange}
                    />
                  </div>

            
                  <button 
                    data-mdb-button-init 
                    data-mdb-ripple-init 
                    className="btn btn-outline-light btn-lg px-5" 
                    type="submit"
                  
                  >
                    Sign Up
                  </button>

                
                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" className="text-white mx-4 px-2"><i className="fab fa-twitter fa-lg"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                  </div>

                </div>

                <div>
                  <p className="mb-0">
                    Already have an account? <a href="#!" className="text-white-50 fw-bold">Login</a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
