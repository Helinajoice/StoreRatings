import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RoleHome from "./pages/RoleHome";
import AdminDashboard from "./pages/AdminDashboard";
import ManageStores from "./pages/ManageStores";
import ManageUsers from "./pages/ManageUsers"; 
import AdminApprovals from "./pages/AdminApprovals";
import AdminRatings from "./pages/AdminRatings";
import UserDetails from "./pages/UserDetails";
import UserDashboard from "./pages/UserDashboard";
import StoreList from "./pages/StoreList";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import UpdatePassword from "./pages/UpdatePassword";
import MyRatings from "./pages/MyRatings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<RoleHome />} />
        <Route path="/admin/user/:userId" element={<UserDetails />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/my-ratings" element={<MyRatings />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/stores" element={<ManageStores />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/ratings" element={<AdminRatings />} />
      </Routes>
    </Router>
  );
}

export default App;
