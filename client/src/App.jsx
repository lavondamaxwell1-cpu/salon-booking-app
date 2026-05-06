import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Stylists from "./pages/Stylists.jsx";
import StylistDetails from "./pages/StylistDetails.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";

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
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/book/:id" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
