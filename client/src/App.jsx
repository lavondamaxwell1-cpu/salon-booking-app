import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Stylists from "./pages/Stylists.jsx";
import StylistDetails from "./pages/StylistDetails.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import StylistDashboard from "./pages/StylistDashboard.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateStylistProfile from "./pages/CreateStylistProfile.jsx";
import EditStylistProfile from "./pages/EditStylistProfile.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stylists" element={<Stylists />} />
        <Route path="/stylists/:id" element={<StylistDetails />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stylist-dashboard"
          element={
            <RoleRoute allowedRole="stylist">
              <StylistDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/create-stylist-profile"
          element={
            <RoleRoute allowedRole="stylist">
              <CreateStylistProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/edit-stylist-profile"
          element={
            <RoleRoute allowedRole="stylist">
              <EditStylistProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <RoleRoute allowedRole="admin">
              <ManageUsers />
            </RoleRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
