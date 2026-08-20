import React, { useState, useEffect, useMemo } from 'react';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Ima from '../assets/icons/gallery/image.svg';
import Hea from '../assets/icons/gallery/heart.svg';
import Com from '../assets/icons/gallery/comment.svg';

const MemberGallery = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    // Mock stats
    const [memberCount, setMemberCount] = useState(15);
    const [eventDay, setEventDay] = useState(24);

    useEffect(() => {
        // Mock fetch member gallery
        const fetchGallery = async () => {
            setLoading(true);
            try {
                // In reality, this would fetch from an API
                const dummyData = []; // Populate if needed
                setCards(dummyData);
            } catch (error) {
                console.error("Failed to load galleries", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const totalPages = useMemo(() => Math.ceil(cards.length / pageSize), [cards.length, pageSize]);

    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return cards.slice(start, start + pageSize);
    }, [currentPage, cards, pageSize]);

    const chunkedCards = useMemo(() => {
        const chunkSize = 3;
        const chunks = [];
        for (let i = 0; i < paginatedCards.length; i += chunkSize) {
            chunks.push(paginatedCards.slice(i, i + chunkSize));
        }
        return chunks;
    }, [paginatedCards]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="content" style={{ padding: '0 30px', backgroundColor: 'white' }}>
            <NavigationRoute />
            <HeaderRoute title="Member Galleries" />

            <section>
                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4" style={{ gap: '15px' }}>
                        <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                            <div className="profile-left d-flex flex-column justify-content-center">
                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>Galleries uploaded by Club Members</small>
                                <h2 className="name m-0 text-dark" style={{ fontSize: '30px', fontWeight: '500' }}>15 Member Galleries</h2>
                                <small className="role text-danger" style={{ fontSize: '18px' }}>Average 20 Images</small>
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
                                <div className="row mt-4 align-items-center">
                                    <div className="col-md-5">
                                        <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{eventDay}</h3>
                                    </div>
                                    <div className="days col-md-7 text-start">
                                        <span>Likes & Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                    <div className="card bg-white rounded p-4 mb-4 border-0 h-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Member Galleries</h4>
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="row m-0">
                                {chunkedCards.length > 0 ? chunkedCards.map((row, rowIndex) => (
                                    <div key={`row-${rowIndex}`} className="row g-0 m-0">
                                        {row.map((gallery, index) => (
                                            <div key={gallery.id || index} className="galleriy col-4 p-0">
                                                <div className="galleriy-item position-relative p-2">
                                                    <img src={gallery.galleries?.[0]?.photos?.[0]?.image_url || 'placeholder.jpg'} alt="Gallery" className="img-fluid w-100" style={{ maxHeight: '370px', objectFit: 'cover' }} />
                                                    <div className={`p-3 text-white ${index % 2 === 0 ? 'bg-secondary' : 'bg-dark'}`} style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                        <div className="gal-item d-flex align-items-center gap-2 mb-2">
                                                            <img src={gallery.profile_image_url || 'profile.jpg'} alt="Profile" className="rounded-circle" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
                                                            <div className="gal-details fw-bold">
                                                                <span>{gallery.galleries?.[0]?.gallery_name || 'Gallery Name'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="profile-icon d-flex justify-content-between mt-2">
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.gallery_total_photos || 0}</span>
                                                                <img src={Ima} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.gallery_total_likes || 0}</span>
                                                                <img src={Hea} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                            <div className="icons d-flex align-items-center gap-1">
                                                                <span>{gallery.gallery_total_comments || 0}</span>
                                                                <img src={Com} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )) : (
                                    <p className="text-muted">No member galleries available.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="dt-paging d-flex justify-content-center py-4">
                        <nav aria-label="pagination">
                            <button className={`btn btn-light mx-1 ${currentPage === 1 ? 'disabled' : ''}`} disabled={currentPage === 1} onClick={() => goToPage(1)}>«</button>
                            <button className={`btn btn-light mx-1 ${currentPage === 1 ? 'disabled' : ''}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>‹</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} className={`btn mx-1 ${i + 1 === currentPage ? 'btn-primary' : 'btn-light'}`} onClick={() => goToPage(i + 1)}>
                                    {i + 1}
                                </button>
                            ))}
                            <button className={`btn btn-light mx-1 ${currentPage === totalPages ? 'disabled' : ''}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>›</button>
                            <button className={`btn btn-light mx-1 ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`} disabled={currentPage === totalPages || totalPages === 0} onClick={() => goToPage(totalPages)}>»</button>
                        </nav>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemberGallery;
