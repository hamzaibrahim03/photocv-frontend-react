import React, { useState, useEffect } from 'react';

function ProfileDashboard() {
  return (
    <>
    <NavigationRoute />
    <HeaderRoute title="Profile" />
    <section className="content">
        <div className="dashboard-card">
            <div className="profile-card">
                <div className="profile-left">
                    <div className="profile-info">
                        <small className="greeting">This page all about you</small>
                        <h2 className="name">My Profile</h2>
                        <small className="role">View your profile here</small>
                    </div>
                </div>
            </div>
            <div className="card-section">
                <div className="stat-card">
                    <small className="ca-details">My Photos</small>
                    <h3 className="number">21</h3>
                </div>
                <div className="event-card">
                    <small className="ca-details">Interactions</small>
                    <div className="row">
                        <div className="col-md-5">
                            <h3 className="number">99</h3>
                        </div>
                        <div className="days col-md-7">
                            <span>Likes & Coments</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="photographeres">
            <ProfileMember />
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6">
                <KamranComments title="My Recent Comments" />
            </div>
            <div className="col-md-6">
                <KamranLikes title="My Recent Likes" />
            </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-6">
                <KamranEntries title="My Competition Entries" />
            </div>
            <div className="col-md-6">
                <KamranAwards title="My Awards" />
            </div>
        </div>
        <KamranGallery title="Recent Photos" />
    
        <div className="row" style={{ marginTop: '10px' }}>
            <div className="col-md-6">
                <div className="comments-cards">
                    <h5>My Interests</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <img src="@/assets/images/dashboard/c1.jpg" />
                        </div>
                        <div className="col-md-6">
                            <p><label className="role">Colour Competition</label></p>
                            <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                        </div>
                    </div>
                    <div className="divider2"></div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src="@/assets/images/dashboard/c2.jpg" />
                        </div>
                        <div className="col-md-6">
                            <p><label className="role">Print Competition</label></p>
                            <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                        </div>
                    </div>
                    <div className="divider2"></div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src="@/assets/images/dashboard/c1.jpg" />
                        </div>
                        <div className="col-md-6">
                            <p><label className="role">Potrait Competition</label></p>
                            <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                        </div>
                    </div>
                    <div className="divider2"></div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src="@/assets/images/dashboard/c1.jpg" />
                        </div>
                        <div className="col-md-6">
                            <p><label className="role">Colour Competition</label></p>
                            <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                        </div>
                    </div>
                    <div className="divider2"></div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src="@/assets/images/dashboard/c1.jpg" />
                        </div>
                        <div className="col-md-6">
                            <p><label className="role">Print Competition</label></p>
                            <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                        </div>
                    </div>
                    <div className="divider2"></div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src="@/assets/images/dashboard/c1.jpg" />
                        </div>
                        <div className="col-md-6">
                            <p><label className="role">Potrait Competition</label></p>
                            <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="comments-cards">
                    <h5>My Brands</h5>
                    <div className="row">
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b1.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b2.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b3.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b4.png" alt="br" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b5.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b6.png" alt="br" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b1.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b2.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b3.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b4.png" alt="br" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b5.png" alt="br" />
                        </div>
                        <div className="col-md-3">
                            <img src="@/assets/images/profile/b6.png" alt="br" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <h5>My Social Links</h5>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-2 text-center">
                            <div className="social-media-icones">
                                <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <p className="mb-0 fw-bold">Facebook</p>
                            <p className="mb-0 text-muted">www.facebook.com/username</p>
                        </div>
                        <div className="col-md-3 text-end">
                            <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-2 text-center">
                            <div className="social-media-icones">
                                <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <p className="mb-0 fw-bold">Instagram</p>
                            <p className="mb-0 text-muted">www.instagram.com/username</p>
                        </div>
                        <div className="col-md-3 text-end">
                            <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-2 text-center">
                            <div className="social-media-icones">
                                <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-twitter"></i></a>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <p className="mb-0 fw-bold">Twitter</p>
                            <p className="mb-0 text-muted">www.twitter.com/username</p>
                        </div>
                        <div className="col-md-3 text-end">
                            <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="btn me-2" id="view">Add</button>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <h5>My Contact</h5>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-2 text-center">
                            <div className="social-media-icones">
                                <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <p className="mb-0 text-muted">123, Street, Town, City, Country</p>
                        </div>
                        <div className="col-md-3 text-end">
                            <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-2 text-center">
                            <div className="social-media-icones">
                                <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <p className="mb-0 text-muted">123 - 456 - 789</p>
                        </div>
                        <div className="col-md-3 text-end">
                            <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-2 text-center">
                            <div className="social-media-icones">
                                <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-twitter"></i></a>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <p className="mb-0 text-muted">username@example.com</p>
                        </div>
                        <div className="col-md-3 text-end">
                            <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="btn me-2" id="view">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}

export default ProfileDashboard;
