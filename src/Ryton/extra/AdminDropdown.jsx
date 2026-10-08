import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
function AdminDropdown({ dashboardData }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isLoggedIn = !!token;
    const firstName = storedUser?.first_name || dashboardData?.data?.user_details?.first_name || "";
    const profileImage = storedUser?.profile_image_url || dashboardData?.data?.user_details?.profile_image_url || "";
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".admin-dropdown")) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    return (
        <div className="admin-dropdown position-relative" style={{ display: "flex", alignItems: "center", gap: "12px", }}>
            {isLoggedIn && profileImage ? (
                <img src={profileImage} alt="Profile" style={{ cursor: "pointer" }} />
            ) : (
                <i className="fa-regular fa-user-circle" style={{ fontSize: "44px" }} />
            )}
            <span>
                {isLoggedIn ? firstName : "Login"}
                <i className="fa-solid fa-chevron-down ms-2"></i>
            </span>
            <div className="dropdown-menu">
                {isLoggedIn ? (
                    <>
                        <a onClick={() => navigate("/dashboard/profile")}>
                            Profile
                        </a>
                        <a onClick={handleLogout}>
                            Log Out
                        </a>
                    </>
                ) : (
                    <>
                        <a onClick={() => navigate("/login")}>
                            Login
                        </a>
                        <a onClick={() => navigate("/signup")}>
                            Register
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
export default AdminDropdown;
