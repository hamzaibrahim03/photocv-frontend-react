import React, { useState, useEffect } from 'react';
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import Loader from "../React/extra/LoaderAll";
function KamranGallerySingle() {
    const [imageList, setImageList] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('imageList')) || [];
        const storedDescriptions = JSON.parse(localStorage.getItem('imageDescriptions')) || [];
        const storedIndex = parseInt(localStorage.getItem('selectedImageIndex')) || 0;
        setImageList(storedImages);
        setDescriptions(storedDescriptions);
        setCurrentIndex(storedIndex);
    }, []);
    const changeImage = (step) => {
        let newIndex = currentIndex + step;
        if (newIndex < 0) newIndex = imageList.length - 1;
        if (newIndex >= imageList.length) newIndex = 0;
        setCurrentIndex(newIndex);
        localStorage.setItem('selectedImageIndex', newIndex);
    };
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    const openLightbox = () => setIsLightboxOpen(true);
    const closeLightbox = () => setIsLightboxOpen(false);
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Kamran Gallery" />
                        <div className="content">
                            <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">Galleries uploaded by Club Member</small>
                                                <h2 className="name">Kamran Chohdary</h2>
                                                <small className="role">Image ${currentIndex + 1} of ${imageList.length}</small>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex justify-content-space-between">
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section d-flex gap-4">
                                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Likes</small>
                                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>46</h3>
                                        </div>
                                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Comments</small>
                                            <div className="row mt-4">
                                                <div className="col-md-5">
                                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>10</h3>
                                                </div>
                                                <div className="days col-md-7 text-start">
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card bg-white rounded p-4 border-0 mb-4" style={{ height: 'auto', minHeight: '600px', position: 'relative' }}>
                                    <h5 className="mt-3 ms-2">Kamran Chohdry's Gallery</h5>
                                    <div className="d-flex align-items-center justify-content-center position-relative mt-3">
                                        <button className="btn btn-dark prev me-4 position-absolute start-0" style={{ zIndex: 10, top: '50%' }} onClick={() => changeImage(-1)}>&#10094;</button>
                                        <img
                                            id="display-img"
                                            className="card-img-top mx-auto mt-2"
                                            src={imageList[currentIndex] || ''}
                                            alt="Selected"
                                            onClick={openLightbox}
                                            style={{ height: '450px', width: '92%', objectFit: 'contain', cursor: 'pointer', borderRadius: '0' }}
                                        />
                                        <button className="btn btn-dark nexts ms-4 position-absolute end-0" style={{ zIndex: 10, top: '50%' }} onClick={() => changeImage(1)}>&#10095;</button>
                                    </div>
                                    <p id="img-description" className="card-text mt-3 ms-5">{descriptions[currentIndex] || ''}</p>
                                </div>
                                {isLightboxOpen && (
                                    <div className="lightbox position-fixed top-0 start-0 w-100 h-100 bg-dark d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.9)' }}>
                                        <span className="close position-absolute top-0 end-0 text-white p-4" style={{ fontSize: '40px', cursor: 'pointer', zIndex: 1060 }} onClick={closeLightbox}>&times;</span>
                                        <div className="d-flex align-items-center justify-content-center w-100 flex-grow-1 position-relative">
                                            <button className="btn btn-light position-absolute start-0 ms-5" onClick={() => changeImage(-1)} style={{ zIndex: 1060, fontSize: '24px' }}>&#10094;</button>
                                            <img id="full-size-img" className="img-fluid shadow-lg" src={imageList[currentIndex]} style={{ maxHeight: '80vh', maxWidth: '80vw', objectFit: 'contain' }} alt="Full Size" />
                                            <button className="btn btn-light position-absolute end-0 me-5" onClick={() => changeImage(1)} style={{ zIndex: 1060, fontSize: '24px' }}>&#10095;</button>
                                        </div>
                                        <div className="lightbox-thumbnails d-flex gap-2 p-3 w-100 overflow-auto justify-content-center" style={{ maxHeight: '15vh' }}>
                                            {imageList.map((imgSrc, index) => (
                                                <img
                                                    key={index}
                                                    src={imgSrc}
                                                    alt={`Thumbnail ${index}`}
                                                    className={`rounded cursor-pointer ${index === currentIndex ? 'border border-3 border-light' : ''}`}
                                                    style={{ width: '80px', height: '60px', objectFit: 'cover', opacity: index === currentIndex ? 1 : 0.6, cursor: 'pointer' }}
                                                    onClick={() => setCurrentIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <div className="comments-card bg-white p-3 rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            <h5>Comments</h5>
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="row mb-3 pb-3 border-bottom">
                                                    <div className="col-md-1">
                                                        <div className="bg-secondary rounded-circle" style={{ width: '40px', height: '40px' }}></div>
                                                    </div>
                                                    <div className="col-md-9 ms-3">
                                                        <p className="m-0">
                                                            <label className="head" style={{ color: '#cc445e' }}>User Name</label> Interesting capture here!
                                                        </p>
                                                        <div className="mt-1 d-flex gap-2 text-muted" style={{ fontSize: '14px' }}>
                                                            <a href="#" className="text-danger text-decoration-none">Remove</a> |
                                                            <a href="#" className="text-muted text-decoration-none">Reply</a> |
                                                            <a href="#" className="text-muted text-decoration-none">Translate</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="comments-cards bg-white p-3 rounded">
                                            <h5>Likes</h5>
                                            <div className="d-flex flex-wrap gap-3 mt-3">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="like-item position-relative text-center">
                                                        <div className="bg-secondary rounded-circle mx-auto" style={{ width: '50px', height: '50px' }}></div>
                                                        <span className="heart-icon position-absolute" style={{ bottom: '-5px', right: '5px', color: 'red', fontSize: '18px' }}>❤</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default KamranGallerySingle;
