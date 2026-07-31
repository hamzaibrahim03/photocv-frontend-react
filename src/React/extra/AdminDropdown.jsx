import { useState, useEffect } from "react";
import { Link } from "react-router";

function AdminDropdown({
    isLoggedIn,
    profileImageUrl,
    username,
    handleLogout,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <div className="admin-dropdown position-relative" style={{ display: "flex", alignItems: "center", gap: "12px", }} >
            {/* Profile Icon */}
            <div className="icon profile-mobile">
                {isLoggedIn && profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", }} />
                ) : (
                    <i className="fa-regular fa-user-circle" style={{ fontSize: "44px" }} />
                )}
            </div>

            {/* Username OR Login */}
            {isLoggedIn ? (
                <span className="notification-desktop">
                    {username}
                </span>
            ) : (
                <Link to="/login" className="notification-desktop" style={{ textDecoration: "none" }} >
                    Login
                </Link>
            )}

            {/* Dropdown Arrow */}
            <i className="fa-solid fa-chevron-down down notification-desktop" style={{ cursor: "pointer" }} onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
            }}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="dropdown-menu show" style={{ position: "absolute", top: "100%", right: 0, }} >
                    {isLoggedIn ? (
                        <button className="dropdown-item" onClick={handleLogout} >
                            Log Out
                        </button>
                    ) : (
                        <Link className="dropdown-item" to="/signup">
                            Register
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDropdown;