import Navbar from "./extra/Navbar";
import "./assets/css/gallerypublic.css"
import { useEffect, useState } from "react";
import Loader from './extra/LoaderAll';
import { useNavigate } from "react-router";

function GalleryPublic() {
    const [galleryData, setgalleryData] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getgalleryData();
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

    async function getgalleryData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/galleries"
        let response = await fetch(url)
        response = await response.json()
        setgalleryData(response.data)
    }
    console.log(galleryData)

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


    const columns = 5;
    return (
        <>
            <div style={{ backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: galleryData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>

                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        galleryData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${galleryData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {galleryData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="cabout" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {galleryData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="prehead" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
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
                                        <h2 className="events-title" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>Galleries</h2>
                                        <div className="search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="overall">
                                    <section id="galcontainer">
                                        <div className="container" style={{ maxWidth: '1820px' }} >
                                            <div style={{ height: 'auto', border: 'none', backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                <div className="d-flex justify-content-between align-items-end" id="cl">
                                                    <div style={{ alignItems: 'flex-end' }}>
                                                        <h5 id="clubheading" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>Club Galleries</h5>
                                                        <h5 id="clubsub" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                            A preview of galleries made up of amazing photographs from club members
                                                        </h5>
                                                    </div>

                                                    <button className="btn btn-sm" id="view" onClick={() => navigate('/rytongal/club')} style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color }}>View All</button>
                                                </div>
                                                <div className="clubpics">
                                                    {galleryData?.clubGalleries?.original?.data.slice(0, 8).map((gallery, index) => (
                                                        <div key={gallery.id} className="clubpics-item">
                                                            <img src={gallery.photos[0].image} alt={gallery.photos[0].title} style={{ objectFit: 'cover', objectPosition: 'top' }} />
                                                            <div className="clubpics-info" style={{ backgroundColor: hexToRgba(galleryData?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                <span style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                    {gallery.gallery_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section id="galcontainer">
                                        <div className="container" style={{ maxWidth: '1820px' }} >
                                            <div style={{ height: 'auto', border: 'none', backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                <div className="d-flex justify-content-between align-items-end" id="cl">
                                                    <div style={{ alignItems: 'flex-end' }}>
                                                        <h5 id="clubheading" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, marginLeft: '-5px' }}>Member Galleries</h5>
                                                        <h5 id="clubsub" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px', marginLeft: '-5px' }}>
                                                            A preview of galleries uploaded by our amazing photographers from the club
                                                        </h5>
                                                    </div>

                                                    <button className="btn btn-sm" id="view" onClick={() => navigate('/rytongal/member')} style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color }}>View All</button>
                                                </div>
                                                <div className="clubpics" style={{ marginTop: "-5px" }}>
                                                    {galleryData?.memberGalleries?.slice(1, 9).map((member) => {
                                                        const gallery = member.galleries?.[0];
                                                        const photo = gallery?.photos?.[0];

                                                        return (
                                                            <div key={member.id} className="clubpics-item">
                                                                <img src={photo?.image_url} alt={member.username} style={{ objectFit: "cover", objectPosition: "top" }} />

                                                                <div className="clubpics-info" style={{ backgroundColor: hexToRgba(galleryData?.clubSettings?.original?.data?.settings?.primary_color,), }} >
                                                                    <div style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                                        {gallery?.gallery_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </section >
                                </div >
                            </section >



                            <section id="joincontainer">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}> {galleryData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}> {galleryData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}> {galleryData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}> {galleryData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}> {galleryData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={galleryData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {galleryData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {galleryData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {galleryData?.clubSettings?.original?.data?.settings?.flickr_link}
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
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {galleryData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: galleryData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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


export default GalleryPublic