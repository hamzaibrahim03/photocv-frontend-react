import Navbar from "./extra/Navbar";
import "./assets/css/clubpublic.css"
import { useEffect, useState } from "react";
import Loader from './extra/LoaderAll';
import he from "he";
import { useNavigate } from "react-router";

function ClubPublic() {
    const navigate = useNavigate();
    const [clubData, setclubData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getclubData();
        const carouselEl = document.querySelector('#carouselExampleIndicators')
        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl)
        }
    }, [])
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    async function getclubData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/about-us"
        let response = await fetch(url)
        response = await response.json()
        setclubData(response.data)
    }
    console.log(clubData)

    const hexToRgba = (hex, alpha) => {
        if (!hex) return `rgba(0,0,0,${alpha})`;

        let r = 0,
            g = 0,
            b = 0;

        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }

        return `rgba(${r},${g},${b},${alpha})`;
    };
    const getByRole = (role) => {
        return clubData?.clubOfficials?.filter((person) =>
            person.roles?.includes(role)
        ) || [];
    };
    return (
        <>
            <div style={{ backgroundColor: clubData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: clubData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: clubData?.clubSettings?.original?.data?.settings?.background_color, height: '108px' }}>
                            <Navbar />
                        </nav>

                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        clubData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="cp-hero-section" style={{ backgroundImage: `url(${clubData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="cp-hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {clubData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="cp-cabout" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {clubData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="cp-overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="cp-prehead" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="cp-icon-circles" style={{ color: clubData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="cp-icon-circles" style={{ color: clubData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="cp-icon-circles" style={{ color: clubData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <span className="cp-flickr-dots">
                                                                        <i className="fa fa-circle"></i>
                                                                        <i className="fa fa-circle"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        <div className="cp-contents">
                            <section>
                                <div className="cp-container" style={{ maxWidth: '1820px' }} id="cp-heads">
                                    <div className="cp-events-header">
                                        <h2 className="cp-heading" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>{clubData?.aboutUs?.title}</h2>
                                        <div className="cp-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="cp-search-input" id="cp-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="cp-container" style={{ maxWidth: '1820px' }} id="cp-overall">
                                    <p className="cp-memtext">{he.decode(clubData?.aboutUs?.description)}</p>

                                    <div className="cp-divider4"></div>
                                    <section>
                                        <div className="cp-container" style={{ maxWidth: '1820px' }}>
                                            <h5 className="cp-heading" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>Club Officials</h5>

                                            <div className="row">
                                                <div className="col-md-4">
                                                    <h2 className="cp-main">Executive Committee</h2>
                                                    {getByRole("President").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                President
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("super_admin").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Chairman
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("club-admin").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Vice-Chair
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("Publicity & Events Officer").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Secretary
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("General Members").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Programme Secretary
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("General Members").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Treasurer
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="col-md-4">
                                                    <h2 className="cp-main">Competition Secretaries</h2>
                                                    {getByRole("General Members").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Prints
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("General Members").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                PDI
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("General Members").map((person) => (
                                                        <div v-for="person in getByRole('')" key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                External
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div >
                                                <div className="col-md-4">
                                                    <h2 className="cp-main">Technical & Committee</h2>
                                                    {getByRole("General Members").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Webmaster
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("Internal Comp Secretary").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                IT Co-ordinator
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    {getByRole("Social Secretary").map((person) => (
                                                        <div key={person.email} className="cp-official" >
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                Social Secretary
                                                            </h1>
                                                            <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                {person.first_name} {person.last_name}
                                                            </h1>
                                                            <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                <i className="fa fa-envelope"></i> {person.email}
                                                            </small>
                                                        </div>
                                                    ))}

                                                    <div>
                                                        <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                            Committee Members
                                                        </h1>
                                                        {getByRole("member").slice(0, 3).map((person) => (
                                                            <div key={person.email} className="cp-official">
                                                                <h1 className="cp-list" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {person.first_name} {person.last_name}
                                                                </h1>
                                                                <small className="cp-email" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    <i className="fa fa-envelope"></i> {person.email}
                                                                </small>
                                                            </div>
                                                        ))}
                                                    </div >
                                                </div >
                                            </div >
                                        </div >
                                    </section >
                                    <div className="cp-divider4"></div>

                                    <h5 className="cp-head">Selection Committee</h5>
                                    <p>It had previously been agreed that henceforth the External Competition committee should comprise the three competition secretaries plus any competition NCPF judges that are members of the club.</p>

                                </div >
                            </section >

                            <section id="cp-joincontainer">
                                <div className="cp-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="cp-cls" className="cp-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: clubData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="cp-clubheading" className="cp-heading" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="cp-clubsub" className="cp-head" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="cp-btn" id="cp-join-club" onClick={() => navigate('/rytonclub')} style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="cp-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="cp-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="cp-footer-heading" className="cp-heading cp-footer-heading" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}> {clubData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="cp-footer-description" className="cp-head cp-footer-description mx-auto" style={{ maxWidth: '1145px', color: clubData?.clubSettings?.original?.data?.settings?.text_color }}> {clubData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="cp-container cp-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="cp-contact-col">
                                                <h5 className="cp-head mb-4" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="cp-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cp-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="cp-footer-text mb-0" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}> {clubData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="cp-icon-circles ms-3" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="cp-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cp-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="cp-footer-text mb-0" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}> {clubData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="cp-icon-circles ms-3" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="cp-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cp-cla">
                                                    <p className="cp-footer-text mb-0" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}> {clubData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="cp-icon-circles ms-3" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={clubData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="cp-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="cp-social-col">
                                                <h5 className="cp-head mb-4 text-md-start text-center" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="cp-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cp-cle">
                                                    <div className="cp-ficon-circles me-3" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="cp-facebook">
                                                        <p className="cp-footer-text fw-bold mb-1" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="cp-footer-link" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {clubData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="cp-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cp-cle">
                                                    <div className="cp-ficon-circles me-3" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="cp-facebook">
                                                        <p className="cp-footer-text fw-bold mb-1" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="cp-footer-link" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {clubData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="cp-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cp-cle">
                                                    <div className="cp-ficon-circles me-3" style={{ color: clubData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="cp-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="cp-facebook">
                                                        <p className="cp-footer-text fw-bold mb-1" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="cp-footer-link" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {clubData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="cp-site-footer">
                                <div className="cp-footer-content">
                                    <p className="cp-memtext" id="cp-fcopy">Copyright &copy; 2025 – {clubData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="cp-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div >
                    </div >
                )
                }
            </div >
        </>
    )
}

export default ClubPublic