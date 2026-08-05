import Navbar from "./extra/Navbar";
import "./assets/css/singleclub.css"
import { useEffect, useMemo, useState } from "react";
import Loader from './extra/LoaderAll';
import { NavLink, useNavigate, useParams } from "react-router";
import Hea from "./assets/icons/gallery/heart.svg"
import Com from "./assets/icons/gallery/comment.svg"

function RytonClubGallerySingle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [clubgallerydata, setclubgalleryData] = useState([]);
    const [randomMemberGallery, setrandomMemberGallery] = useState([]);
    const [randomClubGallery, setrandomClubGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getclubgalleryData();
        getrandomMemberGallery();
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

    async function getclubgalleryData() {
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/gallery/${id}`
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

    async function getrandomClubGallery() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/random-club-galleries";

        let response = await fetch(url);
        response = await response.json();

        setrandomClubGallery(response.data.randomGalleries);
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

    const suggestion = useMemo(() => {
        if (!Array.isArray(randomClubGallery)) return [];

        return randomClubGallery.map(gallery => {
            const firstPhoto = gallery.photos?.[0];

            return {
                gallery_id: gallery.gallery_id,
                gallery_name: gallery.gallery_name,
                total_photos: gallery.total_photos,
                image: firstPhoto?.image,
                title: firstPhoto?.title,
                comments_count: firstPhoto?.comments_count,
                likes_count: firstPhoto?.likes_count,
            };
        });
    }, [randomClubGallery]);

    const openSlide = (clickedImage) => {
        if (!clickedImage) return;

        const photos =
            clubgallerydata?.clubGallery?.original?.data?.photos || [];

        const startIndex = photos.findIndex(
            photo => photo.photo_id === clickedImage.photo_id
        );
        console.log(photos)
        localStorage.setItem(
            "selectedImages",
            JSON.stringify(photos)
        );

        localStorage.setItem(
            "startIndex",
            startIndex
        );

        navigate(`/rytonclubslide?gallery=${id}`);
    };

    const groupedImages = useMemo(() => {
        const photos =
            clubgallerydata?.clubGallery?.original?.data?.photos || [];

        const groups = [];

        for (let i = 0; i < photos.length; i += 5) {
            groups.push(photos.slice(i, i + 5));
        }

        return groups;
    }, [clubgallerydata]);
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
                                            <div className="hero-section" style={{ backgroundImage: `url(${clubgallerydata?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {clubgallerydata?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="cabout" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {clubgallerydata?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="prehead" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
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
                                            <NavLink to="/rytongal" className="events-title breadcrumb-item" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Galleries
                                            </NavLink>

                                            <span className="events-title breadcrumb-separator" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <NavLink to="/rytongal/club" className="events-title breadcrumb-item" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Club Galleries
                                            </NavLink>

                                            <span className="events-title breadcrumb-separator" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="events-title breadcrumb-item active">
                                                {clubgallerydata?.clubGallery?.original?.data?.gallery_name}
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
                                    <section className="gallery-wrapper">
                                        <div className="gallery-grid">
                                            {groupedImages.map((group, gIndex) => (
                                                <>
                                                    {gIndex === 1 && (
                                                        <div className="suggestion-section" style={{ maxWidth: '1820px' }}>
                                                            <div className="suggestion-header d-flex justify-content-between align-items-center" style={{ padding: '0px' }}>
                                                                <h3 className="heading" style={{ fontWeight: '500' }}>You may also like</h3>
                                                                <button id="view" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, border: "none" }}>View All</button>
                                                            </div>
                                                            <div className="suggestion-gallery" style={{ padding: 0 }}>
                                                                {suggestion.slice(0, 4).map((item) => (
                                                                    <div className="suggestion-card" key={item.photo_id} >
                                                                        <img src={item.image} alt={item.title} />
                                                                        <div className="img-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.65) }}>
                                                                            <p>{item.title}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="gallery-row">
                                                        {group[0] && (
                                                            <div className="gallery-big">
                                                                <img src={group[0].image} alt={group[0].title} onClick={() => openSlide(group[0])} />
                                                                <div className="overlay d-flex justify-content-between align-items-center" style={{ backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.65) }}>
                                                                    <div className="d-flex align-items-center gap-3" style={{ paddingLeft: '20px' }}>
                                                                        {group[0].uploaded_by_profile_image ? (
                                                                            <img className="event-img" style={{ borderRadius: '50%' }} src={group[0].uploaded_by_profile_image} alt="Uploader" error="group[0].uploaded_by_profile_image = null" />
                                                                        ) : (
                                                                            <div className="fallback-box d-flex justify-content-center align-items-center" style={{ borderRadius: '50%' }}><i className="fa-regular fa-user-circle" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, fontSize: '44px' }}></i></div>
                                                                        )}

                                                                        <div className="d-flex flex-column">
                                                                            <h4 className="title" style={{ marginTop: '0px', color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>{group[0].title}</h4>
                                                                            <span className="name" style={{ color: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.secondary_color, 0.85) }}>
                                                                                by {group[0].uploaded_by_first_name + " " + group[0].uploaded_by_last_name}
                                                                            </span>
                                                                        </div>
                                                                    </div >
                                                                    <div className="profile-icon d-flex align-items-center gap-4 flex-column" style={{ paddingRight: '20px' }}>
                                                                        <div className="icons d-flex align-items-center gap-2">
                                                                            <span>{group[0].likes_count}</span>
                                                                            <img src={Hea} alt="Likes" className="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                        <div className="icons d-flex align-items-center gap-2">
                                                                            <span>{group[0].comments_count}</span>
                                                                            <img src={Com} alt="Comments" className="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="gallery-column">
                                                            {group.slice(1, 3).map((img) => (
                                                                <div className="gallery-small" key={img.photo_id} >
                                                                    <img src={img.image} alt={img.title} onClick={() => openSlide(img)} />
                                                                    <div className="overlay d-flex justify-content-between align-items-center" style={{ backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.65) }}>
                                                                        <div className="d-flex align-items-center gap-3">
                                                                            {img.uploaded_by_profile_image ? (
                                                                                <img className="event-img" style={{ borderRadius: '50%' }} src={img.uploaded_by_profile_image} alt="Uploader" error="img.uploaded_by_profile_image = null" />
                                                                            ) : (
                                                                                <div className="fallback-box d-flex justify-content-center align-items-center" style={{ borderRadius: '50%' }}><i className="fa-regular fa-user-circle" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, fontSize: '44px' }}></i></div>
                                                                            )}

                                                                            <div className="d-flex flex-column">
                                                                                <h4 className="title" style={{ marginTop: '0px', color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>{img.title}</h4>
                                                                                <span className="name" style={{ color: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.secondary_color, 0.85) }}>
                                                                                    by {img.uploaded_by_first_name + " " + img.uploaded_by_last_name}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="profile-icon d-flex align-items-center gap-4 flex-column">
                                                                            <div className="icons d-flex align-items-center gap-2">
                                                                                <span>{img.likes_count}</span>
                                                                                <img src={Hea} alt="Likes" className="icon" style={{ width: '26px', height: '22px' }} />
                                                                            </div>
                                                                            <div className="icons d-flex align-items-center gap-2">
                                                                                <span>{img.comments_count}</span>
                                                                                <img src={Com} alt="Comments" className="icon" style={{ width: '26px', height: '22px' }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div >
                                                    </div >
                                                    <div className="gallery-row-bottom">
                                                        {group.slice(3, 5).map((img) => (
                                                            <div className="gallery-half" key={img.photo_id} >
                                                                <img src={img.image} alt={img.title} onClick={() => openSlide(img)} />
                                                                <div className="overlay d-flex justify-content-between align-items-center" style={{ backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.65) }}>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        {img.uploaded_by_profile_image ? (
                                                                            <img className="event-img" style={{ borderRadius: '50%' }} src={img.uploaded_by_profile_image} alt="Uploader" error="img.uploaded_by_profile_image = null" />
                                                                        ) : (
                                                                            <div className="fallback-box d-flex justify-content-center align-items-center" style={{ borderRadius: '50%' }}><i className="fa-regular fa-user-circle" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, fontSize: '44px' }}></i></div>
                                                                        )}

                                                                        <div className="d-flex flex-column">
                                                                            <h4 className="title" style={{ marginTop: '0px', color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color }}>{img.title}</h4>
                                                                            <span className="name" style={{ color: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.secondary_color, 0.85) }}>
                                                                                by {img.uploaded_by_first_name + " " + img.uploaded_by_last_name}
                                                                            </span>
                                                                        </div>
                                                                    </div >
                                                                    <div className="profile-icon d-flex align-items-center gap-4 flex-column">
                                                                        <div className="icons d-flex align-items-center gap-2">
                                                                            <span>{img.likes_count}</span>
                                                                            <img src={Hea} alt="Likes" className="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                        <div className="icons d-flex align-items-center gap-2">
                                                                            <span>{img.comments_count}</span>
                                                                            <img src={Com} alt="Comments" className="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                    </div>
                                                                </div >
                                                            </div >
                                                        ))
                                                        }
                                                    </div >
                                                </>
                                            ))}
                                        </div >
                                    </section >
                                </div >
                            </section >

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="suggestions-header d-flex justify-content-between align-items-center mb-4">
                                        <h3>More from Member Galleries</h3>

                                        <button id="view" onClick={() => navigate(`/rytongal/member`)} style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: clubgallerydata?.clubSettings?.original?.data?.settings?.accent_color, border: "none" }}>View All</button>
                                    </div>

                                    <div className="suggestions-gallery" style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
                                        {suggestions.slice(0, 4).map((item, index) => (
                                            <div key={index} className="suggestions-card" style={{ position: "relative", flex: "1" }}>
                                                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                <div className="img-overlay" style={{ backgroundColor: hexToRgba(clubgallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                    {item.profile_image ? (
                                                        <img className="event-img" style={{ borderRadius: "50%", height: "50px", width: "50px" }} src={item.profile_image} alt="Uploader" />
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



                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {clubgallerydata?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: clubgallerydata?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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



export default RytonClubGallerySingle
