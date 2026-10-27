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
        <div className="admin-dropdown position-relative" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={toggleDropdown} role="button" aria-haspopup="true" aria-expanded={isDropdownOpen} >
                {isLoggedIn && profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ cursor: "pointer", width: '38px', height: '38px', borderRadius: '50%' }} />
                ) : (
                    <i className="fa-regular fa-user-circle" style={{ fontSize: "44px" }} />
                )}
                <span>
                    {isLoggedIn ? firstName : "Login"}
                    <i className="fa-solid fa-chevron-down ms-2"></i>
                </span>
            </div>
            <div className={`dropdown-menu${isDropdownOpen ? " show" : ""}`}>
                {isLoggedIn ? (
                    <>
                        <a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => { setIsDropdownOpen(false); navigate("/dashboard/profile"); }}>
                            Profile
                        </a>
                        <a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => { setIsDropdownOpen(false); handleLogout(); }}>
                            Log Out
                        </a>
                    </>
                ) : (
                    <>
                        <a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => { setIsDropdownOpen(false); navigate("/login"); }}>
                            Login
                        </a>
                        <a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => { setIsDropdownOpen(false); navigate("/signup"); }}>
                            Register
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
export default AdminDropdown;
