import Navbar from "./extra/Navbar";
import "./assets/css/singlemember.css"
import { useEffect, useMemo, useState } from "react";
import Loader from './extra/LoaderAll';
import { NavLink, useNavigate, useParams } from "react-router";
import Hea from "./assets/icons/gallery/heart.svg"
import Com from "./assets/icons/gallery/comment.svg"

function RytonMemberGallerySingle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [membergallerydata, setmembergalleryData] = useState([]);
    const [randomMemberGallery, setrandomMemberGallery] = useState([]);
    const [randomClubGallery, setrandomClubGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getmembergalleryData();
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

    async function getmembergalleryData() {
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/member/${id}/galleries`
        let response = await fetch(url)
        response = await response.json()
        setmembergalleryData(response.data)
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
    console.log(membergallerydata?.memberGalleries?.original?.data)

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
            membergallerydata?.memberGalleries?.original?.data?.galleries[0]?.photos || [];

        const startIndex = photos.findIndex(
            photo => photo.photo_id === clickedImage.photo_id
        );

        localStorage.setItem(
            "selectedImages",
            JSON.stringify(photos)
        );

        localStorage.setItem(
            "startIndex",
            startIndex
        );

        navigate(`/rytonmemberslide?gallery=${id}`);
    };

    const groupedImages = useMemo(() => {
        const photos =
            membergallerydata?.memberGalleries?.original?.data?.galleries[0]?.photos || [];

        const groups = [];

        for (let i = 0; i < photos.length; i += 5) {
            groups.push(photos.slice(i, i + 5));
        }

        return groups;
    }, [membergallerydata]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        if (isNaN(date)) return "";

        const day = date.getDate();
        const month = date.toLocaleString("en-GB", {
            month: "long",
        });

        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };
    return (
        <>
            <div style={{ backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, fontFamily: membergallerydata?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, height: '108px' }}>
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
                                            <div className="sm-hero-section" style={{ backgroundImage: `url(${membergallerydata?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="sm-hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {membergallerydata?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="sm-cabout" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {membergallerydata?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="sm-overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="sm-prehead" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sm-icon-circles" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sm-icon-circles" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sm-icon-circles" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <span className="sm-flickr-dots">
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


                        <div className="sm-contents">
                            <section>
                                <div className="sm-container" style={{ maxWidth: '1820px' }} id="sm-heads">
                                    <div className="sm-events-header">
                                        <nav className="sm-breadcrumb">
                                            <NavLink to="/rytongal" className="sm-events-title sm-breadcrumb-item" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Galleries
                                            </NavLink>

                                            <span className="sm-events-title sm-breadcrumb-separator" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <NavLink to="/rytongal/member" className="sm-events-title sm-breadcrumb-item" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Members
                                            </NavLink>

                                            <span className="sm-events-title sm-breadcrumb-separator" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="sm-events-title sm-breadcrumb-item sm-active">
                                                {membergallerydata?.memberGalleries?.original?.data?.galleries[0]?.gallery_name}
                                            </span>
                                        </nav>
                                        <div className="sm-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="sm-search-input" id="sm-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sm-container" style={{ maxWidth: '1820px' }} id="sm-overall">
                                    <section className="sm-gallery-wrapper">

                                        <div className="sm-gallery-grid">
                                            {groupedImages.map((group, gIndex) => (
                                                <>
                                                    {gIndex === 1 && (
                                                        <div className="sm-suggestion-section" style={{ maxWidth: '1820px', backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                                            <div className="sm-suggestions-header d-flex justify-content-between align-items-center" style={{ padding: '0px' }}>
                                                                <h3 className="sm-heading" style={{ fontWeight: '500' }}>You may also like</h3>
                                                                <button id="sm-view" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, border: 'none' }}>View All</button>
                                                            </div>

                                                            <div className="sm-suggestions-gallery" style={{ padding: '0px' }}>
                                                                {suggestions.slice(0, 4).map((item) => (
                                                                    <>
                                                                        <div className="sm-suggestions-card">
                                                                            <img src={item.image} alt={item.title} />
                                                                            <div className="sm-img-overlay" style={{ backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                                {item.profile_image ? (
                                                                                    <img className="sm-event-img" style={{ borderRadius: '50%', height: '50px', width: '50px' }} src={item.profile_image} alt="Uploader" />
                                                                                ) : (
                                                                                    <div className="sm-fallback-box d-flex justify-content-center align-items-center" style={{ borderRadius: '50%' }}><i className="fa-regular fa-user-circle" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, fontSize: '44px' }}></i></div>
                                                                                )}

                                                                                <div className="d-flex flex-column">
                                                                                    <span className="sm-names" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                                        {item.member_name}
                                                                                    </span>
                                                                                    <span className="sm-role" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                                        {item.role}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="sm-gallery-row">
                                                        {group[0] && (
                                                            <div className="sm-gallery-big">
                                                                <img src={group[0].image} alt={group[0].title} onClick={() => openSlide(group[0])} />
                                                                <div className="sm-overlay justify-content-between" style={{ flexDirection: 'row', display: 'flex', backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                    <div style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, flexDirection: 'column', display: 'flex' }}>
                                                                        <h4 className="sm-title" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }} >{group[0].title}</h4>
                                                                        <span className="sm-name" style={{ color: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.secondary_color, 0.5) }}>{formatDate(group[0].created_at)}</span>
                                                                    </div >
                                                                    <div className="sm-profile-icon d-flex justify-content-between flex-column gap-4">
                                                                        <div className="sm-icons">
                                                                            <span>{group[0].likes_count}</span>
                                                                            <img src={Hea} alt="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                        <div className="sm-icons">
                                                                            <span>{group[0].comments_count}</span>
                                                                            <img src={Com} alt="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="sm-gallery-column">
                                                            {group.slice(1, 3).map((img) => (
                                                                <div className="sm-gallery-small" key={img.photo_id} >
                                                                    <img src={img.image} alt={img.title} onClick={() => openSlide(img)} />
                                                                    <div className="sm-overlay justify-content-between" style={{ flexDirection: 'row', display: 'flex', backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                        <div style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, flexDirection: 'column', display: 'flex' }}>
                                                                            <h4 className="sm-title" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }} >{img.title}</h4>
                                                                            <span className="sm-name" style={{ color: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.secondary_color, 0.5) }}>{formatDate(img.created_at)}</span>
                                                                        </div >
                                                                        <div className="sm-profile-icon d-flex justify-content-between flex-column gap-4">
                                                                            <div className="sm-icons">
                                                                                <span>{img.likes_count}</span>
                                                                                <img src={Hea} alt="icon" style={{ width: '26px', height: '22px' }} />
                                                                            </div>
                                                                            <div className="sm-icons">
                                                                                <span>{img.comments_count}</span>
                                                                                <img src={Com} alt="icon" style={{ width: '26px', height: '22px' }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="sm-gallery-row-bottom">
                                                        {group.slice(3, 5).map((img) => (
                                                            <div className="sm-gallery-half" key={img.photo_id} >
                                                                <img src={img.image} alt={img.title} onClick={() => openSlide(img)} />
                                                                <div className="sm-overlay justify-content-between" style={{ flexDirection: 'row', display: 'flex', backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}>
                                                                    <div style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, flexDirection: 'column', display: 'flex' }}>
                                                                        <h4 className="sm-title" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color }} >{img.title}</h4>
                                                                        <span className="sm-name" style={{ color: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.secondary_color, 0.5) }}>{formatDate(img.created_at)}</span>
                                                                    </div >
                                                                    <div className="sm-profile-icon d-flex justify-content-between flex-column gap-4">
                                                                        <div className="sm-icons">
                                                                            <span>{img.likes_count}</span>
                                                                            <img src={Hea} alt="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                        <div className="sm-icons">
                                                                            <span>{img.comments_count}</span>
                                                                            <img src={Com} alt="icon" style={{ width: '26px', height: '22px' }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                        }
                                                    </div >
                                                </>
                                            ))}
                                        </div >
                                    </section >
                                </div >
                            </section >
                            <section className="w-full bg-white py-14">
                                <div className="sm-container mx-auto max-w-[600px] text-center">
                                    <div className="flex justify-center mb-4">
                                        <img src={membergallerydata?.memberGalleries?.original?.data?.member?.profile_image} style={{ borderRadius: '50%', width: '120px', height: '120px' }} />
                                    </div>

                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {membergallerydata?.memberGalleries?.original?.data?.member?.first_name} {membergallerydata?.memberGalleries?.original?.data?.member?.last_name}
                                    </h2>

                                    <p className="text-gray-500 text-sm mb-4">
                                        {membergallerydata?.memberGalleries?.original?.data?.member?.role}
                                    </p>

                                    {membergallerydata?.memberGalleries?.original?.data?.member?.social_links?.map(link => (
                                        <div className="flex justify-center space-x-3" style={{ gap: '10px', display: 'flex', justifyContent: 'center' }}>
                                            <button style={{ width: '34px', height: '34px', color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, border: 'none', borderRadius: '50%', gap: '20px' }} key={link.platform} onClick={() => window.open(link.url, "_blank")}>
                                                {link.platform === 'facebook' ? (
                                                    <i className="fab fa-facebook-f"></i>
                                                ) : link.platform === 'instagram' ? (
                                                    <i className="fab fa-instagram"></i>
                                                ) : link.platform === 'flickr' ? (
                                                    <span className="sm-flickr-dots">
                                                        <i className="fa fa-circle"></i><i className="fa fa-circle"></i>
                                                    </span>
                                                ) : null}
                                            </button>
                                        </div>
                                    ))}

                                </div>
                            </section >


                            <section>
                                <div className="sm-container" style={{ maxWidth: '1650px', width: '1650px' }}>
                                    <div className="sm-suggestion-header d-flex justify-content-between align-items-center">
                                        <h3 className="sm-heading" style={{ fontWeight: '500' }}>More from Club Galleries</h3>

                                        <button id="sm-view" onClick={() => navigate(`/rytongal/club`)} style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: membergallerydata?.clubSettings?.original?.data?.settings?.accent_color, border: 'none' }}>View All</button>
                                    </div>

                                    <div className="sm-suggestion-gallery" style={{ padding: 0 }}>
                                        {suggestion.slice(0, 4).map((item, index) => (
                                            <div key={index} className="sm-suggestion-card">
                                                <img src={item.image} alt={item.title} />
                                                <div className="sm-img-overlay" style={{ backgroundColor: hexToRgba(membergallerydata?.clubSettings?.original?.data?.settings?.primary_color, 0.7), textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                                    <p className="sm-photo-title">{item.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <footer className="sm-site-footer">
                                <div className="sm-footer-content">
                                    <p className="sm-memtext" id="sm-fcopy">Copyright &copy; 2025 – {membergallerydata?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="sm-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: membergallerydata?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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


export default RytonMemberGallerySingle