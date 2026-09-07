import Navbar from "./extra/Navbar";
import "./assets/css/rytonstyle.css"
import { useEffect, useMemo, useState } from "react";
import Loader from './extra/LoaderAll';
import { NavLink, useNavigate } from "react-router";
function ClubGalleryPublic() {
    const navigate = useNavigate();
    const [clubgallerydata, setclubgalleryData] = useState([]);
    const [randomMemberGallery, setrandomMemberGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getclubgalleryData();
        getrandomMemberGallery();
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
    async function getclubgalleryData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/galleries"
        let response = await fetch(url)
        response = await response.json()
        setclubgalleryData(response.data)
    }
    async function getrandomMemberGallery() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/random-member-galleries";
        let response = await fetch(url);
        response = await response.json();
        setrandomMemberGallery(response.data.randomGalleries);
    }
    console.log(clubgallerydata)
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
    const goToGallery = (id) => {
        console.log(clubgallerydata)
        console.log(id)
        navigate(`/rytongal/club/${id}`)
    }
    const suggestions = useMemo(() => {
        if (!Array.isArray(randomMemberGallery)) return [];
        return randomMemberGallery.map(member => {
            const firstGallery = member.galleries?.[0]
            const firstPhoto = firstGallery?.photos?.[0]
            const firstRole = member.roles?.[0]
            return {
                gallery_id: firstGallery?.id || "",
                gallery_name: firstGallery?.gallery_name || "",
                profile_image: member.profile_image_url,
                total_photos: firstGallery?.photos?.length || 0,
                image: firstPhoto?.image_url || "",
                title: firstPhoto?.title || "",
                comments_count: firstPhoto?.comments_count || 0,
                likes_count: firstPhoto?.likes_count || 0,
                uploaded_by: firstPhoto?.uploaded_by || "",
                member_name: member.first_name + " " + member.last_name,
                role: firstRole?.name
                    ? firstRole.name.charAt(0).toUpperCase() + firstRole.name.slice(1)
                    : "",
            };
        });
    }, [randomMemberGallery]);
    const columns = 5;
    return (
        <>
            <div style={{ backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, fontFamily: clubgallerydata?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        clubgallerydata?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${clubgallerydata?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }}>
                                                <div className="hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {clubgallerydata?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>
                                                            <p className="cabout" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }}>
                                                                {clubgallerydata?.clubSettings?.original?.data?.club?.about}
                                                            </p>
                                                            <button id="overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                                Join Our Club
                                                            </button>
                                                            <p className="prehead" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }}>
                                                                An NYCE Club based in Apps, North East England
                                                            </p>
                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }}>
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }}>
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }}>
                                                                    <span className="flickr-dots">
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
                        <div className="contents">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="heads">
                                    <div className="events-header">
                                        <nav className="breadcrumb">
                                            <NavLink to="/rytongal" className="events-title breadcrumb-item" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                Galleries
                                            </NavLink>
                                            <span className="events-title breadcrumb-separator" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                &gt;
                                            </span>
                                            <span className="events-title breadcrumb-item active">
                                                Club Galleries
                                            </span>
                                        </nav>
                                        <div className="search-bar">
                                            <i className="fas fa-search"></i>
                                            <input model="search" type="search" className="search-input" id="dt-search-1" placeholder="Search" aria-controls="example1" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="overall">
                                    <section id="gallery-container">
                                        <div className="container" style={{ maxWidth: '1820px' }}>
                                            <div style={{ height: "auto", border: "none", backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                <div className="gallery-pics">
                                                    {clubgallerydata?.clubGalleries?.original?.data.map((gallery, index) => (
                                                        <div className="gallery-pics-item" onClick={() => goToGallery(gallery.gallery_id)}>
                                                            <img src={gallery.photos[0].image} alt={gallery.photos[0].title} style={{ objectFit: "cover", objectPosition: "top" }} />
                                                            <div className="gallery-pics-info" style={{ backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                <span style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                    {gallery.gallery_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="suggestions-header d-flex justify-content-between align-items-center">
                                        <h3>More from Member Galleries</h3>
                                        <button id="view" onClick={() => navigate('/rytongal/member')} style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, border: "none" }}>View All</button>
                                    </div>
                                    <div className="suggestions-gallery">
                                        {suggestions.slice(0, 4).map((item, index) => (
                                            <div key={index} className="suggestions-card" style={{ position: "relative", flex: "1" }}>
                                                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                <div className="img-overlay" style={{ backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                    {item.profile_image ? (
                                                        <img className="event-img" style={{ borderRadius: "50%", height: "50px", marginTop: "0px", width: "50px" }} src={item.profile_image} alt="Uploader" />
                                                    ) : (
                                                        <div className="fallback-box d-flex justify-content-center align-items-center" style={{ borderRadius: "50%" }}><i className="fa-regular fa-user-circle" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, fontSize: '44px' }}></i></div>
                                                    )}
                                                    <div className="d-flex flex-column">
                                                        <span className="names" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                            {item.member_name}
                                                        </span>
                                                        <span className="role" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                            {item.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                            <section id="joincontainer">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>
                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {clubgallerydata?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {clubgallerydata?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {clubgallerydata?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {clubgallerydata?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {clubgallerydata?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={clubgallerydata?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {clubgallerydata?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {clubgallerydata?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {clubgallerydata?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {clubgallerydata?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </div>
                )
                }
            </div>
        </>
    )
}
export default ClubGalleryPublic
