import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from '../api/axios';
import Ima from './assets/icons/member/image.svg';
import Com from './assets/icons/member/comment.svg';
import Lik from './assets/icons/member/like.svg';
const MembersRoute = () => {
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [search, setSearch] = useState("");
    const [itemsPerPage] = useState(24);
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await getMembersData();
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
        const handleClickOutside = () => setOpenMenuIndex(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    async function getMembersData() {
        try {
            const response = await apiClient.get('/members');
            setMemberData(response.data?.data || {});
        } catch (error) {
            console.error('Error loading members:', error);
            setMemberData({});
        }
    };
    const toggleMenu = (index) => {
        setOpenMenuIndex(prev => prev === index ? null : index);
    };
    const shareItem = async (member) => {
        setOpenMenuIndex(null);
        const url = `${window.location.origin}/members/${member.id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert('Profile link copied to clipboard.');
        } catch (error) {
            console.error('Error copying link:', error);
            alert(url);
        }
    };
    const deleteItem = async (member) => {
        setOpenMenuIndex(null);
        if (!window.confirm(`Remove ${member.username || 'this member'}?`)) return;
        try {
            await apiClient.delete(`/members/${member.id}`);
            await getMembersData();
        } catch (error) {
            console.error('Error deleting member:', error);
            alert(error.response?.data?.message || 'Unable to remove this member.');
        }
    };
    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(memberData?.original?.data?.length / itemsPerPage),
            1
        );
    }, [memberData?.original?.data?.length, itemsPerPage]);
    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return memberData?.original?.data?.slice(start, start + itemsPerPage);
    }, [memberData?.original?.data, currentPage, itemsPerPage]);
    const chunkedCards = useMemo(() => {
        const chunkSize = 4;
        const chunks = [];
        for (let i = 0; i < paginatedCards?.length; i += chunkSize) {
            chunks.push(paginatedCards.slice(i, i + chunkSize));
        }
        return chunks;
    }, [paginatedCards]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const decodeHtml = (text) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };
    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Members" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className='profle-info'>
                                                <small className="greeting">List of members in the club</small>
                                                <h2 className="name" style={{ fontSize: '30px', fontWeight: '500' }}>All Members</h2>
                                                <small className="role">{memberData?.original?.data?.length} Member Galleries</small>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">Members</small>
                                            <h3 className="number">{memberData?.original?.data?.length}</h3>
                                        </div>
                                        <div className="event-cards">
                                            <small className="ca-details">Interactions</small>
                                            <div className="row align-items-center">
                                                <div className="col-md-5">
                                                    <h3 className="number">{memberData.original?.data?.reduce(
                                                        (total, item) =>
                                                            total +
                                                            (Number(item.gallery_total_comments) || 0) +
                                                            (Number(item.gallery_total_likes) || 0),
                                                        0
                                                    )}</h3>
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
                            <div className="container" style={{ maxWidth: '1820px', margin: '0 auto', padding: '0 15px' }}>
                                {chunkedCards.length > 0 ? (
                                    chunkedCards.map((row, rowIndex) => (
                                        <div key={rowIndex} className="row-wrapper d-flex mb-4">
                                            <div className="photographers d-flex flex-wrap mt-2">
                                                {row.map((member, index) => {
                                                    const menuKey = member.id ?? `${currentPage}-${rowIndex}-${index}`;
                                                    return (
                                                        <div key={menuKey} className="photographer-card bg-white text-center shadow-sm position-relative" onClick={() => navigate(`/members/${member.id}`)}>
                                                            <div className="three-dots-wrapper position-absolute cursor-pointer" style={{ top: '10px', right: '10px', width: '6px', height: '30px', zIndex: '100' }} onClick={(e) => { e.stopPropagation(); toggleMenu(menuKey); }}>
                                                                <div className="three-dots bg-secondary" style={{ width: '6px', height: '6px', boxShadow: '0 6px 0 #555, 0 -6px 0 #555', marginTop: '12px' }}></div>
                                                                {openMenuIndex === menuKey && (
                                                                    <div className="dropdown-menu-custom position-absolute bg-white shadow-sm" style={{ top: '25px', right: '0', zIndex: '1000' }}>
                                                                        <button className="btn w-100 text-start border-0 bg-transparent rounded-0" onClick={() => navigate(`/members/${member.id}/edit`)}>Edit</button>
                                                                        <button className="btn w-100 text-start border-0 bg-transparent rounded-0" onClick={() => shareItem(member)}>Share</button>
                                                                        <button className="btn w-100 text-start border-0 bg-transparent rounded-0" onClick={() => deleteItem(member)}>Delete</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {member.profile_image_url ? (
                                                                <img src={member.profile_image_url} className="profile-pic rounded-circle d-block object-fit-cover" style={{ marginTop: '30px', width: '192px', height: '192px' }} alt="Profile" onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                            ) : (
                                                                <div className="fallback-box rounded-circle d-flex justify-content-center align-items-center bg-light" style={{ width: '192px', height: '192px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                                                                    <i className="fa-regular fa-user text-secondary" style={{ fontSize: '48px' }}></i>
                                                                </div>
                                                            )}
                                                            <div className="social-media-icons d-flex justify-content-center gap-2 mt-n4 position-relative" style={{ top: '-5px' }}>
                                                                <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '34px', height: '34px' }}><i className="fab fa-facebook-f"></i></a>
                                                                <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#cc445e', color: 'white', width: '34px', height: '34px' }}><i className="fab fa-instagram"></i></a>
                                                                <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '34px', height: '34px' }}><i className="fab fa-twitter"></i></a>
                                                            </div>
                                                            <h3 style={{ fontFamily: 'Inter', fontStyle: 'Medium', fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '10px', marginTop: '10px' }}>{member.first_name + ' ' + member.last_name || 'Username'}</h3>
                                                            <small className="role" style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '18px' }}>{member?.roles?.[0]?.name}</small>
                                                            <div className="social-icons d-flex justify-content-center gap-3 text-white" style={{ backgroundColor: '#d64561' }}>
                                                                <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{member.gallery_total_photos || 0}</span><img src={Ima} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                                <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{member.gallery_total_comments || 0}</span><img src={Com} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                                <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{member.gallery_total_likes || 0}</span><img src={Lik} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                            </div>
                                                            <div className="gallery-preview d-flex">
                                                                {member?.galleries?.[0]?.photos?.length > 0 ? (
                                                                    member.galleries[0].photos.slice(0, 2).map((photo) => (
                                                                        <div key={photo.id} className="pic-item position-relative">
                                                                            <img src={photo?.thumb_url || photo?.image_url || "/placeholder.jpg"} alt={photo?.title || "Gallery"} className="rounded" style={{ width: "170px", height: "123px", objectFit: "cover", margin: "0px" }} />
                                                                            <div className="pic-info" style={{ fontSize: "12px" }}>
                                                                                <span>
                                                                                    {photo?.title
                                                                                        ? decodeHtml(photo.title).length > 10
                                                                                            ? decodeHtml(photo.title).slice(0, 10) + "..."
                                                                                            : decodeHtml(photo.title)
                                                                                        : "Gallery"
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="w-100 text-center text-muted small bg-light rounded">
                                                                        No galleries
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted">No members available.</div>
                                )}
                            </div>
                        </section>
                        <section className="pb-5 mt-4">
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="button-group ms-3">
                                        <button className="btn" id="edit" onClick={() => navigate('/members/create')}>Add New</button>
                                    </div>
                                    <div className="dt-paging">
                                        <nav aria-label="pagination">
                                            <button className={`dt-paging-button previous ${currentPage === 1 ? "disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous">
                                                ‹
                                            </button>
                                            {Array.from({ length: totalPages }, (_, index) => {
                                                const page = index + 1;
                                                return (
                                                    <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)}>
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            <button className={`dt-paging-button next ${currentPage === totalPages ? "disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next">
                                                ›
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
        </>
    );
};
export default MembersRoute;
