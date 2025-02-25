import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/login/Login";
import CustomerDetails from "./pages/customerDetails/CustomerDetails";
import Cart from "./pages/cart/Cart";
import Payment from "./pages/payment/Payment";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/hoc/protected";
import Success from "./pages/success/success";
import "./custom.scss";
import List from "./components/productList/List";

function App() {
  return (   
    <Routes> 
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="categories" element={<ProtectedRoute><CustomerDetails /></ProtectedRoute>} />
        <Route path="categories/:label" element={<ProtectedRoute><List /></ProtectedRoute>} />
        <Route path="checkout/cart" element={<ProtectedRoute requireUser={true}><Cart /></ProtectedRoute>} />
        <Route path="checkout/payment" element={<ProtectedRoute requireUser={true}><Payment /></ProtectedRoute>} />
        <Route path="success" element={<ProtectedRoute requireUser={true}><Success /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute requireUser={true}><Profile /></ProtectedRoute>}/>
      </Route>
    </Routes>
    
  );
}

export default App;
