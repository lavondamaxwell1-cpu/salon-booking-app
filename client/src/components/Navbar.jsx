import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-pink-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          GlowUp Salon
        </Link>

        <div className="flex gap-6 text-lg items-center">
          <Link to="/" className="hover:text-pink-100">
            Home
          </Link>

          <Link to="/stylists" className="hover:text-pink-100">
            Stylists
          </Link>

          {user?.role === "customer" && (
            <Link to="/my-appointments" className="hover:text-pink-100">
              Appointments
            </Link>
          )}

          {user?.role === "stylist" && (
            <>
              <Link to="/stylist-dashboard" className="hover:text-pink-100">
                Stylist Dashboard
              </Link>

              <Link
                to="/create-stylist-profile"
                className="hover:text-pink-100"
              >
                Create Profile
              </Link>

              <Link to="/edit-stylist-profile" className="hover:text-pink-100">
                Edit Profile
              </Link>
              <Link to="/stylist-calendar" className="hover:text-pink-100">
                Calendar
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin-dashboard" className="hover:text-pink-100">
                Admin Dashboard
              </Link>
              <Link to="/manage-users" className="hover:text-pink-100">
                Manage Users
              </Link>
            </>
          )}
          {!user ? (
            <>
              <Link to="/login" className="hover:text-pink-100">
                Login
              </Link>

              <Link to="/register" className="hover:text-pink-100">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="font-semibold">Hi, {user.name}</span>

              <button
                onClick={handleLogout}
                className="bg-white text-pink-500 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
