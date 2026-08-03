import Navbar from "./extra/Navbar";
import "./assets/css/membergallerypublic.css"
import { useEffect, useMemo, useState } from "react";
import Loader from './extra/LoaderAll';
import { NavLink, useNavigate } from "react-router";

function MemberGalleryPublic() {
    const navigate = useNavigate();
    const [membergallerydata, setmembergalleryData] = useState([]);
    const [randomClubGallery, setrandomClubGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getmembergalleryData();
        getrandomClubGallery();
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

    async function getmembergalleryData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/galleries"
        let response = await fetch(url)
        response = await response.json()
        setmembergalleryData(response.data)
    }

    async function getrandomClubGallery() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/random-club-galleries";

        let response = await fetch(url);
        response = await response.json();

        setrandomClubGallery(response.data.randomGalleries);
    }
    console.log(membergallerydata)

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
        console.log(membergallerydata)
        console.log(id)
        navigate(`/rytongal/member/${id}`)
    }

    const suggestion = useMemo(() => {
        if (!Array.isArray(randomClubGallery)) return [];

        return randomClubGallery.map((club) => {
            const firstPhoto = club.photos?.[0];

            return {
                gallery_id: club.gallery_id,
                gallery_name: club.gallery_name,
                total_photos: club.total_photos,
                image: firstPhoto?.image || "",
                title: firstPhoto?.title || "",
                comments_count: firstPhoto?.comments_count || 0,
                likes_count: firstPhoto?.likes_count || 0,
                uploaded_by: firstPhoto?.uploaded_by || "",
                photo_id: firstPhoto?.photo_id || "",
            };
        });
    }, [randomClubGallery]);
    const columns = 5;
    return (
        <>
            <div style={{ backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, fontFamily: membergallerydata?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>

                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        membergallerydata?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="mgp-hero-section" style={{ backgroundImage: `url(${membergallerydata?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="mgp-hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {membergallerydata?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="mgp-cabout" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {membergallerydata?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="mgp-overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="mgp-prehead" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="mgp-icon-circles" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="mgp-icon-circles" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="mgp-icon-circles" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <span className="mgp-flickr-dots">
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


                        <div className="mgp-contents">
                            <section>
                                <div className="mgp-container" style={{ maxWidth: '1820px' }} id="mgp-heads">
                                    <div className="mgp-events-header">
                                        <nav className="mgp-breadcrumb">
                                            <NavLink to="/rytongal" className="mgp-events-title mgp-breadcrumb-item" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Galleries
                                            </NavLink>

                                            <span className="mgp-events-title mgp-breadcrumb-separator" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="mgp-events-title mgp-breadcrumb-item mgp-active">
                                                Members
                                            </span>
                                        </nav>
                                        <div className="mgp-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input model="search" type="search" className="mgp-search-input" id="mgp-dt-search-1" placeholder="Search" aria-controls="example1" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="mgp-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }} id="mgp-overall">

                                    <section id="mgp-galcontainer">
                                        <div className="mgp-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                            <div style={{ height: 'auto', border: 'none', backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }}>

                                                <div className="mgp-clubpics">
                                                    {membergallerydata?.memberGalleries?.map((item, index) => (
                                                        <div className="mgp-clubpics-item" onClick={() => goToGallery(item.id)}>
                                                            <div>
                                                                <img src={item?.galleries?.[0]?.photos?.[0]?.image_url} alt={item.galleries?.[0]?.gallery_name} style={{ objectFit: 'cover', objectPosition: 'top' }} />
                                                                <div className="mgp-clubpics-info" style={{ backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                    <div style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                        {item.galleries?.[0]?.gallery_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section >
                                </div >
                            </section >

                            <section>
                                <div className="mgp-container" style={{ maxWidth: '1650px', width: '1650px' }}>
                                    <div className="mgp-suggestion-header d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="mgp-heading" style={{ fontWeight: '500' }}>More from Club Galleries</h3>

                                        <button id="mgp-view" onClick={() => navigate('/rytongal/club')} style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, border: 'none' }}>View All</button>
                                    </div>

                                    <div className="mgp-suggestion-gallery" style={{ padding: 0 }}>
                                        {suggestion.slice(0, 4).map((item, index) => (
                                            <div key={index} className="mgp-suggestion-card">
                                                <img src={item.image} alt={item.title} />
                                                <div className="mgp-img-overlay" style={{ backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7), textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                                    <p className="mgp-photo-title">{item.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>


                            <section id="mgp-joincontainer">
                                <div className="mgp-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="mgp-cls" className="mgp-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="mgp-clubheading" className="mgp-heading" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="mgp-clubsub" className="mgp-head" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="mgp-btn" id="mgp-join-club" onClick={() => navigate('/rytonclub')} style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="mgp-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="mgp-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="mgp-footer-heading" className="mgp-heading mgp-footer-heading" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {membergallerydata?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="mgp-footer-description" className="mgp-head mgp-footer-description mx-auto" style={{ maxWidth: '1145px', color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {membergallerydata?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="mgp-container mgp-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="mgp-contact-col">
                                                <h5 className="mgp-head mb-4" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="mgp-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="mgp-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="mgp-footer-text mb-0" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {membergallerydata?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="mgp-icon-circles ms-3" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="mgp-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="mgp-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="mgp-footer-text mb-0" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {membergallerydata?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="mgp-icon-circles ms-3" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="mgp-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="mgp-cla">
                                                    <p className="mgp-footer-text mb-0" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}> {membergallerydata?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="mgp-icon-circles ms-3" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={membergallerydata?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="mgp-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="mgp-social-col">
                                                <h5 className="mgp-head mb-4 text-md-start text-center" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="mgp-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="mgp-cle">
                                                    <div className="mgp-ficon-circles me-3" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="mgp-facebook">
                                                        <p className="mgp-footer-text fw-bold mb-1" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="mgp-footer-link" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {membergallerydata?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="mgp-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="mgp-cle">
                                                    <div className="mgp-ficon-circles me-3" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="mgp-facebook">
                                                        <p className="mgp-footer-text fw-bold mb-1" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="mgp-footer-link" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {membergallerydata?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="mgp-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="mgp-cle">
                                                    <div className="mgp-ficon-circles me-3" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="mgp-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="mgp-facebook">
                                                        <p className="mgp-footer-text fw-bold mb-1" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="mgp-footer-link" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {membergallerydata?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="mgp-site-footer">
                                <div className="mgp-footer-content">
                                    <p className="mgp-memtext" id="mgp-fcopy">Copyright &copy; 2025 – {membergallerydata?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="mgp-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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


export default MemberGalleryPublic