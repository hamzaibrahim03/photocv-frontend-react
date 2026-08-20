import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from "../React/extra/LoaderAll";
// import Ima from '../assets/icons/member/image.svg';
// import Com from '../assets/icons/member/comment.svg';
// import Lik from '../assets/icons/member/like.svg';

const MembersRoute = () => {
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const itemsPerPage = 24;

    // Mock stats
    const [memberCount, setMemberCount] = useState(150);
    const [eventCount, setEventCount] = useState(32);

    useEffect(() => {
        // Fetch members logic mock
        const fetchMembers = async () => {
            try {
                // Example mock data
                setMemberData([]);
            } catch (error) {
                console.error("Failed to load members", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();

        const handleClickOutside = () => setOpenMenuIndex(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (index) => {
        setOpenMenuIndex(prev => prev === index ? null : index);
    };

    const editItem = (member) => {
        alert("Edit " + (member.username || ''));
        setOpenMenuIndex(null);
    };

    const shareItem = (member) => {
        alert("Share " + (member.username || ''));
        setOpenMenuIndex(null);
    };

    const deleteItem = (member) => {
        alert("Delete " + (member.username || ''));
        setOpenMenuIndex(null);
    };

    const totalPages = useMemo(() => Math.ceil(memberData.length / itemsPerPage), [memberData.length, itemsPerPage]);

    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return memberData.slice(start, start + itemsPerPage);
    }, [currentPage, memberData, itemsPerPage]);

    const chunkedCards = useMemo(() => {
        const chunkSize = 4;
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
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Members" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card d-flex align-items-center justify-content-between py-4" style={{ gap: '15px' }}>
                                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                        <div className="profile-left d-flex flex-column justify-content-center">
                                            <small className="greeting text-muted" style={{ fontSize: '18px' }}>List of members in the club</small>
                                            <h2 className="name m-0 text-dark" style={{ fontSize: '30px', fontWeight: '500' }}>All Members</h2>
                                            <small className="role text-danger" style={{ fontSize: '18px' }}>25 Member Galleries</small>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <div className="dt-search">
                                                <input type="search" style={{ width: '250px' }} className="form-control" placeholder="Search" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Members</small>
                                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                                        </div>
                                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                            <div className="row mt-4 align-items-center">
                                                <div className="col-md-5">
                                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{eventCount}</h3>
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
                                {chunkedCards.length > 0 ? (
                                    chunkedCards.map((row, rowIndex) => (
                                        <div key={rowIndex} className="row-wrapper d-flex mb-4">
                                            <div className="photographers d-flex w-100 gap-4 flex-wrap mt-2">
                                                {row.map((member, index) => (
                                                    <div key={index} className="photographer-card bg-white text-center rounded shadow-sm border p-3 position-relative" style={{ width: '23.6%', borderColor: '#99816b' }}>
                                                        <div
                                                            className="three-dots-wrapper position-absolute cursor-pointer"
                                                            style={{ top: '10px', right: '10px', width: '24px', height: '24px', zIndex: 100 }}
                                                            onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}
                                                        >
                                                            <div className="three-dots bg-secondary rounded-circle mx-auto" style={{ width: '4px', height: '4px', boxShadow: '0 6px 0 #555, 0 -6px 0 #555' }}></div>
                                                            {openMenuIndex === index && (
                                                                <div className="dropdown-menu-custom position-absolute bg-white border rounded shadow-sm py-2" style={{ top: '25px', right: '0', minWidth: '130px', zIndex: 1000 }}>
                                                                    <button className="btn btn-sm w-100 text-start border-0 bg-transparent rounded-0" onClick={() => editItem(member)}>Edit</button>
                                                                    <button className="btn btn-sm w-100 text-start border-0 bg-transparent rounded-0" onClick={() => shareItem(member)}>Share</button>
                                                                    <button className="btn btn-sm w-100 text-start border-0 bg-transparent rounded-0 text-danger" onClick={() => deleteItem(member)}>Delete</button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {member.profile_image_url ? (
                                                            <img
                                                                src={member.profile_image_url}
                                                                className="profile-pic rounded-circle mx-auto d-block my-3 object-fit-cover"
                                                                style={{ width: '192px', height: '192px' }}
                                                                alt="Profile"
                                                                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                                            />
                                                        ) : (
                                                            <div className="fallback-box rounded-circle mx-auto d-flex justify-content-center align-items-center bg-light my-3" style={{ width: '192px', height: '192px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                                                                <i className="fa-regular fa-user text-secondary" style={{ fontSize: '48px' }}></i>
                                                            </div>
                                                        )}

                                                        <div className="social-media-icons d-flex justify-content-center gap-2 mt-n4 mb-3 position-relative" style={{ top: '-25px' }}>
                                                            <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '40px', height: '40px' }}><i className="fab fa-facebook-f"></i></a>
                                                            <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#cc445e', color: 'white', width: '40px', height: '40px' }}><i className="fab fa-instagram"></i></a>
                                                            <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '40px', height: '40px' }}><i className="fab fa-twitter"></i></a>
                                                        </div>

                                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{member.username || 'Username'}</h3>
                                                        <small className="role text-muted d-block mb-3">{member.tag_line || 'No tagline'}</small>

                                                        <div className="social-icons d-flex justify-content-center py-2 px-4 gap-3 text-white rounded mb-3" style={{ backgroundColor: '#d64561' }}>
                                                            <div className="icon d-flex align-items-center gap-1"><span>{member.gallery_total_photos || 0}</span><img src={Ima} alt="icon" style={{ width: '20px', height: '20px' }} /></div>
                                                            <div className="icon d-flex align-items-center gap-1"><span>{member.gallery_total_comments || 0}</span><img src={Com} alt="icon" style={{ width: '20px', height: '20px' }} /></div>
                                                            <div className="icon d-flex align-items-center gap-1"><span>{member.gallery_total_likes || 0}</span><img src={Lik} alt="icon" style={{ width: '20px', height: '20px' }} /></div>
                                                        </div>

                                                        <div className="gallery-preview d-flex gap-2">
                                                            {member.galleries && member.galleries.slice(0, 2).map((gallery, gIdx) => (
                                                                <div key={gIdx} className="pic-item position-relative">
                                                                    <img src={gallery.photos?.length ? gallery.photos[0].image_url : '/placeholder.jpg'} alt="Gallery" className="rounded" style={{ width: '170px', height: '100px', objectFit: 'cover' }} />
                                                                    <div className="pic-info position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white text-center py-1 rounded-bottom" style={{ fontSize: '12px' }}>
                                                                        <span>{gallery.gallery_name?.length > 10 ? gallery.gallery_name.slice(0, 10) + '...' : (gallery.gallery_name || 'Gallery')}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {(!member.galleries || member.galleries.length === 0) && (
                                                                <div className="w-100 text-center text-muted small py-4 bg-light rounded">No galleries</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5 text-muted">No members available.</div>
                                )}
                            </div>
                        </section>

                        <section className="pb-5 mt-4">
                            <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="button-group ms-3">
                                        <button className="btn text-white" style={{ backgroundColor: '#4c4036', width: '120px' }} onClick={() => navigate('/add-member')}>Add New</button>
                                    </div>
                                    <div className="dt-paging">
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
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
};

export default MembersRoute;
