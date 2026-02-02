import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../context/auth/authContext";
import "../App.css";

export default function Product({ category }) {
    const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const limit = 6;
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(
        `http://localhost:5000/api/type/category/${category}?page=${page}&limit=${limit}`

        );
        const data = await res.json();
           setTypes(data.types);
                  setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, [category,page]);


  const handleDelete = async (id) => {
  

    try {
      await fetch(`http://localhost:5000/api/type/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTypes(types.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
const Wrapper = user?.admin? "main" : "div";
  return (
     
  <Wrapper className={user?.admin? "main" : "container mt-5 "}>


      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold">Shop by Category</h1>
        <p className="text-muted fs-5">
          Discover your favorite styles — timeless and effortless.
        </p>
      </header>

      <div className="row g-3 mb-5">
        {types.map((type) => (
          <div key={type._id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              
              <img
                src={type.image}
                className="card-img-top"
                alt={type.name}
                style={{ objectFit: "cover", height: "350px", cursor: "pointer" }}
                onClick={() =>
                  navigate(`/product/${category}/${type.name}`)
                }
              />

              <div className="card-body text-center">
                <h5 className="card-title">{type.name}</h5>

              
                {user?.admin==1 && (
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <button
                      className="btn btn-outline-dark btn-sm w-50 d-flex align-items-center justify-content-center gap-2"
                      onClick={() =>
                   navigate(`/edittype/${type._id}`, {
  state: {
    name: type.name,
    image: type.image
  }
})

                      }
                    >
                     <i className="bi bi-pencil-square"></i>
  
                    </button>

                    <button
                      className="btn btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleDelete(type._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

   
      {user?.admin==1 &&   (
        <div className="d-flex justify-content-end mb-4">
          <button
            className="btn btn-dark d-flex align-items-center gap-2"
            onClick={() => navigate("/type", { state: { category } })}
          >
            <i className="bi bi-plus-lg"></i>
            Add Type
          </button>
        </div>
      )}
       <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
  <button
    className="btn btn-outline-dark"
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
  >
    &laquo; Previous
  </button>

  <span className="fw-bold">
    Page {page} of {totalPages}
  </span>

  <button
    className="btn btn-outline-dark"
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    disabled={page === totalPages}
  >
    Next &raquo;
  </button>
</div>

    </Wrapper>
    
  );
}
