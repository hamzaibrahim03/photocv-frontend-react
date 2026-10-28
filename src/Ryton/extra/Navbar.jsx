import { useEffect, useState } from "react";
import AdminDropdown from './AdminDropdown'
import { NavLink, Outlet } from "react-router"
function Navbar() {
    const [homeData, sethomeData] = useState([]);
    const [navOpen, setNavOpen] = useState(false);
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

    useEffect(() => {
        const settings = homeData?.clubSettings?.original?.data?.settings;
        if (!settings) return;

        const root = document.documentElement.style;
        const vars = {
            '--club-text': settings.text_color,
            '--club-primary': settings.primary_color,
            '--club-background': settings.background_color,
            '--club-secondary': settings.secondary_color,
            '--club-accent': settings.accent_color,
        };
        Object.entries(vars).forEach(([key, value]) => {
            if (value) root.setProperty(key, value);
        });

        let bodyFont = settings.typography || null;
        try {
            const parsedFonts = settings.fonts ? JSON.parse(settings.fonts) : null;
            if (parsedFonts?.body) bodyFont = parsedFonts.body;
        } catch { /* fonts wasn't valid JSON (e.g. a plain font name) - keep typography */ }

        if (bodyFont) {
            root.setProperty('--club-body-font', `'${bodyFont}', Inter, sans-serif`);
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${bodyFont.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
            document.head.appendChild(link);
        }
    }, [homeData]);
    return (
        <>
            <section>
                <div>
                    <div className="container d-flex justify-content-between align-items-center" style={{ maxWidth: '1900px' }}>
                        <a className="navbar-brand d-flex align-items-center" href="/">
                            <img src={homeData?.clubSettings?.original?.data?.settings?.logo_url} id="logo" alt="Ryton" />
                        </a>
                        <button className="navbar-toggler me-2" type="button" onClick={() => setNavOpen((prev) => !prev)} aria-expanded={navOpen} aria-controls="navbarSupportedContent" aria-label="Toggle navigation" >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse custom-collapse${navOpen ? " show" : ""}`} id="navbarSupportedContent">
                            <ul className="navbar-nav mb-2 mb-lg-0 custom-nav" style={{ gap: '10px' }} onClick={() => setNavOpen(false)}>
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
                                    {/* <NotificationBell /> */}
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
            </section>
        </>
    )
}
export default Navbar
