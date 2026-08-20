import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from '../React/extra/LoaderAll';
import Ima from './assets/icons/gallery/image.svg';
import Hea from './assets/icons/gallery/heart.svg';
import Com from './assets/icons/gallery/comment.svg';

const GalleryRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [memberGallery, setMemberGallery] = useState([]);
    const [clubGallery, setClubGallery] = useState([]);
    const [memberCount, setMemberCount] = useState(0);
    const [eventDay, setEventDay] = useState(0);

    useEffect(() => {
        const loadGalleries = async () => {
            setIsLoading(true);
            try {
                // MOCK: Replace with actual fetched data from the API
                setMemberGallery([]);
                setClubGallery([]);
            } catch (error) {
                console.error("Error fetching galleries:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadGalleries();
    }, []);

    if (isLoading) return <Loader show={isLoading} />;

    return (
        <div style={{ backgroundColor: 'white' }}>
            <NavigationRoute />
            <HeaderRoute title="Galleries" />
            <div className="content">
                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                            <div className="profile-card bg-white shadow-sm rounded p-4 d-flex align-items-center justify-content-between" style={{ height: '148px', width: '65.8%' }}>
                                <div className="profile-left">
                                    <div className="profile-info">
                                        <small className="greeting text-muted" style={{ fontSize: '18px' }}>Features Members & Club Galleries</small>
                                        <h2 className="name m-0" style={{ fontSize: '30px', fontWeight: '500', color: '#4c4036' }}>24 Club Galleries</h2>
                                        <small className="role mt-2 d-block" style={{ fontSize: '18px', color: '#cc445e' }}>15 Member Galleries</small>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <div className="dt-search">
                                        <input type="search" style={{ width: '250px' }} className="form-control" placeholder="Search" />
                                    </div>
                                </div>
                            </div>

                            <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                    <small className="ca-details" style={{ fontSize: '20px' }}>Images</small>
                                    <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                                </div>
                                <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                    <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                    <div className="row mt-4">
                                        <div className="col-md-5">
                                            <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{eventDay}</h3>
                                        </div>
                                        <div className="days col-md-7 text-start">
                                            <span style={{ fontSize: '16px' }}>Likes & Comments</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                        <div className="card bg-white rounded p-4 mb-4 border-0">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Member Galleries</h4>
                                <button className="btn me-2" id="e-view" onClick={() => navigate('/mem_gallery')} >View All</button>
                            </div>

                            <div className="row g-0 m-0">
                                {memberGallery.map((gallery, index) => (
                                    gallery.galleries?.length > 0 && gallery.galleries[0]?.photos?.length > 0 && (
                                        <div key={gallery.id} className="col-3 p-0">
                                            <div className="galleriy">
                                                <div className="galleriy-item position-relative p-2">
                                                    <img src={gallery.galleries[0].photos[0].image_url} alt="Gallery" className="img-fluid w-100" style={{ maxHeight: '370px', objectFit: 'cover' }} />
                                                    <div className={`p-3 text-white ${index % 2 === 0 ? 'bg-secondary' : 'bg-dark'}`} style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                        <div className="gal-item d-flex align-items-center gap-2">
                                                            {gallery.profile_image_url ? (
                                                                <img className="img-fluid rounded-circle" style={{ width: '40px', height: '40px' }} src={gallery.profile_image_url} alt="Profile" />
                                                            ) : (
                                                                <div className="fallback-box bg-light rounded-circle" style={{ width: '40px', height: '40px' }}></div>
                                                            )}
                                                            <span>{gallery.galleries[0].gallery_name}</span>
                                                        </div>
                                                        <div className="profile-icon d-flex justify-content-between mt-3">
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.gallery_total_photos}</span>
                                                                <img src={Ima} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.gallery_total_likes}</span>
                                                                <img src={Hea} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.gallery_total_comments}</span>
                                                                <img src={Com} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                        <div className="card bg-white rounded p-4 mb-4 border-0">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Club Galleries</h4>
                                <button className="btn me-2" id="e-view" onClick={() => navigate('/club_gallery')} >View All</button>
                            </div>

                            <div className="row g-0 m-0">
                                {clubGallery.map((gallery, index) => (
                                    gallery.photos?.length > 0 && (
                                        <div key={gallery.gallery_id} className="col-3 p-0">
                                            <div className="galleriy">
                                                <div className="galleriy-item position-relative p-2">
                                                    <img src={gallery.photos[0].image} alt="Gallery" className="img-fluid w-100" style={{ maxHeight: '370px', objectFit: 'cover' }} />
                                                    <div className={`p-3 text-white ${index % 2 === 0 ? 'bg-secondary' : 'bg-dark'}`} style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                        <div className="gal-item d-flex align-items-center gap-2">
                                                            <span>{gallery.photos[0].title}</span>
                                                        </div>
                                                        <div className="profile-icon d-flex justify-content-between mt-3">
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.total_photos}</span>
                                                                <img src={Ima} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.photos[0].likes_count}</span>
                                                                <img src={Hea} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.photos[0].comments_count}</span>
                                                                <img src={Com} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GalleryRoute;
