import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../../components/NavigationRoute';
import HeaderRoute from '../../components/HeaderRoute';
import ClubProfile from '../../partials/club_admin/club/ClubProfile';
import KamranGalleries from '../../partials/club_admin/kamgallery/KamranGalleries';

import c1 from '../../assets/images/dashboard/c1.jpg';
import c2 from '../../assets/images/dashboard/c2.jpg';

const KamranGallery = () => {
    const navigate = useNavigate();
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

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Member Gallery" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                    <ClubProfile greeting="Galleries uploaded by Club Member" name="Kamran Chohdary" role="20 Images" />

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

                <KamranGalleries onImageClick={handleImageClick} images={galleryImages} />

            </section>
        </div>
    );
};

export default KamranGallery;
