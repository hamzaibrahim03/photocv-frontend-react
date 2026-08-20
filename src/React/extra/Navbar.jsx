import { useEffect, useState } from "react";
import AdminDropdown from './AdminDropdown'
import { NavLink, Outlet } from "react-router"
import "../assets/css/navbar.css"
import NotificationBell from "./NotificationBell";
function Navbar() {
    const [homeData, sethomeData] = useState([]);
    useEffect(() => {
        gethomeData();
        const carouselEl = document.querySelector('#carouselExampleIndicators')
        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl)
        }
    }, [])

    async function gethomeData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/home"
        let response = await fetch(url)
        response = await response.json()
        sethomeData(response.data)
    }

    return (
        <>
            <div>

                <div className="container d-flex justify-content-between align-items-center" style={{ maxWidth: '1820px' }}>
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src={homeData?.clubSettings?.original?.data?.settings?.logo_url} id="logo" alt="Ryton" />
                    </a>

                    <button className="navbar-toggler me-2" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse custom-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 custom-nav" style={{ gap: '10px' }}>

                            <div>
                                <li className="nav-item active">
                                    <NavLink to="/" className="nav-link" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                        Home
                                    </NavLink>
                                </li>
                            </div>
                            <li className="nav-item">
                                <NavLink to="/rytonevent" className="nav-link" href="/rytonevent" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                    Events
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/rytoncomp" className="nav-link" href="/rytoncomp" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                    Competitions
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/rytongal" className="nav-link" href="/rytongal" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                    Galleries
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/rytonnews" className="nav-link" href="/rytonnews" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                    News
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/rytonnotice" className="nav-link" href="/rytonnotice" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                    Notice
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/rytonclub" className="nav-link" href="/rytonclub" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                    Club
                                </NavLink>
                            </li>
                        </ul>

                        <div className="right-header d-flex align-items-center" style={{ marginLeft: '160px' }}>
                            <a className="icon notification-desktop">
                                <NotificationBell />
                            </a>
                            <div className="divider"></div>
                            <a className="icon notification-desktop">
                            </a>
                            <div id="notification-divider"></div>
                            <AdminDropdown />

                        </div>
                    </div>

                </div>
                <Outlet />
            </div>
        </>
    )
}

export default Navbar
