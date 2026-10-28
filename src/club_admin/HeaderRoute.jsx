import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
function HeaderRoute({ title = "Dashboard", dashboardData }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isLoggedIn = !!token;
    const firstName = storedUser?.first_name || dashboardData?.data?.user_details?.first_name || "";
    const profileImage = storedUser?.profile_image_url || dashboardData?.data?.user_details?.profile_image_url || "";
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <>
            <div className="nav-header">
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="left-header">
                        <h2 style={{ fontFamily: 'Inter', fontWeight: '300', fontStyle: 'Light', fontSize: '36px', color: '#4C4036', lineHeight: '100%', marginBottom: '0%' }}>{title}</h2>
                    </div>
                    <div className="right-header">
                        <div className="icon">
                        </div>
                        <div className="hr-user-dropdown" ref={menuRef}>
                            <div className="hr-user-trigger" onClick={() => setIsOpen((prev) => !prev)} role="button" aria-haspopup="true" aria-expanded={isOpen} >
                                {isLoggedIn && profileImage ? (
                                    <img src={profileImage} alt="Profile" />
                                ) : (
                                    <i className="fa-regular fa-user-circle" style={{ fontSize: "44px" }} />
                                )}
                                <span>
                                    {isLoggedIn ? firstName : "Login"}
                                    <i className="fa-solid fa-chevron-down ms-2"></i>
                                </span>
                            </div>
                            <div className={`hr-user-menu${isOpen ? " open" : ""}`}>
                                {isLoggedIn ? (
                                    <>
                                        <a onClick={() => { setIsOpen(false); navigate("/about"); }}>
                                            Profile
                                        </a>
                                        <a onClick={() => { setIsOpen(false); handleLogout(); }}>
                                            Log Out
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <a onClick={() => { setIsOpen(false); navigate("/login"); }}>
                                            Login
                                        </a>
                                        <a onClick={() => { setIsOpen(false); navigate("/signup"); }}>
                                            Register
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default HeaderRoute;
