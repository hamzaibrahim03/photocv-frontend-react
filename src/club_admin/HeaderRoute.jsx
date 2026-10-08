import React from "react";
import { useNavigate } from "react-router";
function HeaderRoute({ title = "Dashboard", dashboardData }) {
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
    return (
        <>
            <div className="nav-header">
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="left-header">
                        <h2 style={{ fontFamily: 'Inter', fontWeight: '300', fontStyle: 'Light', fontSize: '36px', color: '#4C4036', lineHeight: '100%', marginBottom: '0%' }}>{title}</h2>
                    </div>
                    <div className="right-header">
                        <div className="icon">
                            {/* <NotificationBell /> */}
                        </div>
                        <div className="admin-dropdown">
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
                                        <a onClick={() => navigate("/register")}>
                                            Register
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
export default HeaderRoute;
