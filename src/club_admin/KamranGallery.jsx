import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import Loader from "../React/extra/LoaderAll";
import c1 from './assets/images/dashboard/c1.jpg';
import c2 from './assets/images/dashboard/c2.jpg';
function KamranGallery() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [galleryImages] = useState([
        { src: c1, description: "Beautiful landscape" },
        { src: c2, description: "Urban night scene" },
    ]);
    const handleImageClick = (index) => {
        const imgArray = galleryImages.map(img => img.src);
        const descArray = galleryImages.map(img => img.description || "");
        localStorage.setItem("selectedImageIndex", index);
        localStorage.setItem("imageList", JSON.stringify(imgArray));
        localStorage.setItem("imageDescriptions", JSON.stringify(descArray));
        setTimeout(() => {
            navigate("/kamran_gallery_single");
        }, 100);
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Kamran Gallery" />
                        <div className="content">
                            <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                                <div className="profile-card">
                                    <div className="profile-left">
                                        <div className="profile-info">
                                            <small className="greeting">Galleries uploaded by Club Member</small>
                                            <h2 className="name">Kamran Chohdary</h2>
                                            <small className="role">20 Images</small>
                                        </div>
                                    </div>
                                    <div className="search-bar d-flex justify-content-space-between">
                                        <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        <i className="fas fa-search"></i>
                                    </div>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small className="ca-details fs-5">Images</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>64</h3>
                                    </div>
                                    <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small className="ca-details fs-5">Interactions</small>
                                        <div className="row mt-4 align-items-center">
                                            <div className="col-md-5">
                                                <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>1k</h3>
                                            </div>
                                            <div className="days col-md-7 text-start">
                                                <span>Likes & Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="d-flex justify-content-between align-items-center mb-3" style={{ padding: '15px' }}>
                                    <h4>Kamran Chohdary's Gallery</h4>
                                </div>
                                <div className="row-wrapper">
                                    <div className="galleriy">
                                        <div className="galleriy-item">
                                            <img src={image} alt="Gallery Image" className="gallery-img" />
                                            <div className="galleriy-infos">
                                                <div className="gal-item">
                                                    <div className="gal-details">
                                                        <span>{create}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-icon">
                                                    <div className="icons">
                                                        <span>20</span>
                                                        <i className="fas fa-image"></i>
                                                    </div>
                                                    <div className="icons">
                                                        <span>53</span>
                                                        <i className="fas fa-heart"></i>
                                                    </div>
                                                    <div className="icons">
                                                        <span>39</span>
                                                        <i className="fas fa-comment"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dt-paging">
                                <nav aria-label="pagination">
                                    <button className={`dt-paging-button first ${currentPage === 1 ? 'disabled' : ''}`} disabled={currentPage === 1} onClick={() => goToPage(1)} aria-label="First">
                                        «
                                    </button>
                                    <button className={`dt-paging-button previous ${currentPage === 1 ? 'disabled' : ''}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous">
                                        ‹
                                    </button>
                                    <button className={`dt-paging-button ${page === currentPage ? 'current' : ''}`} onClick={() => goToPage(page)}>
                                        {page}
                                    </button>
                                    <button className={`dt-paging-button next ${currentPage === totalPages ? 'disabled' : ''}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next">
                                        ›
                                    </button>
                                    <button className={`dt-paging-button last ${currentPage === totalPages ? 'disabled' : ''}`} disabled={currentPage === totalPages} onClick={() => goToPage(totalPages)} aria-label="Last">
                                        »
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default KamranGallery;
