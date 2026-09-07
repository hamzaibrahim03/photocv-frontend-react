import React, { useState, useEffect, useMemo } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
// import c1 from "../assets/images/dashboard/c1.jpg";
// import m1 from "../assets/images/dashboard/m1.png";
// import m2 from "../assets/images/dashboard/m2.jpg";
// import m3 from "../assets/images/dashboard/m3.jpg";
// import pro from "../assets/images/dashboard/pro.png";
// import qrCode from "../assets/images/profile/qr_code.png";
function PhotographerPortfolio() {
    const [user] = useState({
        first_name: 'Photographer',
        profile_image: c1
    });
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const chunkedCards = useMemo(() => {
        const chunkSize = 3;
        const chunks = [];
        for (let i = 0; i < cards.length; i += chunkSize) {
            chunks.push(cards.slice(i, i + chunkSize));
        }
        return chunks;
    }, [cards]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCards([
                { id: 1, image: m1, img: pro },
                { id: 2, image: m2, img: pro },
                { id: 3, image: m3, img: pro }
            ]);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Profile" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                        <div className="profile-left d-flex align-items-center gap-3">
                            <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                            <div className="profile-info">
                                <h2 className="name m-0 text-dark head">{user.first_name}</h2>
                            </div>
                        </div>
                        <div className="profile-icons d-flex flex-column gap-2 text-danger">
                            <div className="icon d-flex align-items-center gap-2"><span>20</span><i className="fas fa-comments"></i></div>
                            <div className="icon d-flex align-items-center gap-2"><span>53</span><i className="fas fa-desktop"></i></div>
                            <div className="icon d-flex align-items-center gap-2"><span>39</span><i className="fas fa-users"></i></div>
                        </div>
                    </div>
                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>My Photos</small>
                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>21</h3>
                        </div>
                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                            <div className="row mt-4 align-items-center">
                                <div className="col-md-5">
                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>99</h3>
                                </div>
                                <div className="days col-md-7 text-start">
                                    <span>Likes & Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card bg-white mt-4 border-0 rounded shadow-sm overflow-hidden p-4">
                    <h4 className="head mb-4">My Portfolio</h4>
                    {loading ? (
                        <div className="text-center py-5 text-muted">Loading portfolio...</div>
                    ) : (
                        <div className="d-flex flex-column gap-4">
                            {chunkedCards.map((row, rowIndex) => (
                                <div key={rowIndex} className="row g-4">
                                    {row.map((item, index) => (
                                        <div key={item.id} className="col-md-4">
                                            <div className="position-relative overflow-hidden rounded group" style={{ height: '250px' }}>
                                                <img src={item.image} alt="Gallery" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img src={item.img} alt="Profile" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                                                        <span className="fw-medium">Kamran Chohdry</span>
                                                    </div>
                                                    <div className="d-flex gap-3">
                                                        <div className="d-flex align-items-center gap-1"><span>20</span><i className="fas fa-image"></i></div>
                                                        <div className="d-flex align-items-center gap-1"><span>53</span><i className="fas fa-heart"></i></div>
                                                        <div className="d-flex align-items-center gap-1"><span>39</span><i className="fas fa-comment"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <PhotographerGalleries />
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="bg-white rounded shadow-sm border border-light p-4 h-100">
                            <SalesCards />
                        </div>
                    </div>
                    <div className="col-md-6 d-flex flex-column gap-4">
                        <div className="bg-white rounded shadow-sm border border-light p-4" style={{ height: '600px', overflow: 'hidden' }}>
                            <PhotoRequests />
                        </div>
                        <div className="bg-white rounded shadow-sm border border-light p-4 text-center">
                            <h4 className="head text-start mb-4">My QR Code</h4>
                            <img src={qrCode} alt="QR CODE" style={{ width: '200px' }} className="mb-4" />
                            <hr className="text-muted w-75 mx-auto" />
                            <p className="text-secondary mb-0 mt-3">username.photo.cv</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default PhotographerPortfolio;
