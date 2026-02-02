import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Product from './ProductComponents/Product';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { womenCategories, menCategories } from './data/categories';
import ProductItem from './ProductComponents/ProductItem';
import ProductItemsPage from './ProductComponents/ProductItemsPage';
import ForgotPasswordFlow from './components/ForgotPasswordFlow';

import  { useContext, useState } from "react";
import AlertState from './context/alert/StateAlert';
import alertContext from './context/alert/alertContext';

import Alert from "./components/Alert";
import Cart from './pages/Cart';
import { CartProvider } from "./context/cart/CartState";
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import ProductPage from './admin/ProductPage';
import AuthState from "./context/auth/AuthState"; 
import EditProduct from './admin/EditProduct';
import Contact from './components/Contact';
import Customerview from './admin/Custormerview';

import Dashboard from './admin/Dashboard';
import Type from './admin/Type';
import AboutUs from './components/AboutUs';
import AdminMessage from './admin/AdminMessage';

import Footer from './components/Footer';
import Home from './components/Home';
import authContext from "./context/auth/authContext";
import EditType from './admin/EditType';
import Sidebar from './admin/Sidebar';
import ProductDetail from './ProductComponents/ProductDetail';
function AppContent() {
  const { user } = useContext(authContext);

  return (
    <>
      {!user?.admin && <Navbar /> }
      <Alert/>     {user?.admin && <Sidebar />}
      <div className="main-content">
        <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/women" element={<Product category="women" />} />
     <Route path="/edittype/:id" element={<EditType />} />
     <Route path="/product/:id" element={<ProductDetail></ProductDetail>} />

       
        <Route path="/men" element={<Product category="Men"   />} />
      <Route path="/product/:category/:type" element={<ProductItemsPage/>} />
       <Route path="/forgot-password" element={< ForgotPasswordFlow/>} />
          <Route path="/checkout" element={<Checkout />} />
      <Route path="/confirmation" element={<Confirmation/>} />
           <Route path="/addproduct" element={<ProductPage/>} />
               <Route path="/editproduct" element={<EditProduct/>} />
                <Route path="/Customerview" element={<Customerview/>} />
                   <Route path="/Contactview" element={<AdminMessage/>} />
 <Route
          path="/"
          element={user?.admin ? <Dashboard /> : <Home />}
        />


     <Route path="/type" element={<Type/>} />
                     <Route path="/cart" element={<Cart/>} />
 <Route path="/contact" element={<Contact/>} />
  <Route path="/about" element={<AboutUs/>} />
      </Routes>
      </div>
      {!user?.admin && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthState>
      < AlertState>
      <CartProvider>
      <Router>
        <AppContent />
      </Router>
      </CartProvider>
      </AlertState>
    </AuthState>
  );
}

export default App;
