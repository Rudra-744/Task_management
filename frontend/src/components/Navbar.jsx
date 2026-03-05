import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axiosInstance.post("/auth/logout");
    navigate("/auth");
  };

  return (
    <nav className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🗂️ TaskFlow</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
