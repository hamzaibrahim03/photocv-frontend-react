import React, { useState, useEffect } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from "../Ryton/extra/LoaderAll.jsx";
import apiClient from '../api/axios';

function greetingMessage() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning!";
    if (hour === 12) return "Good noon!";
    if (hour > 12 && hour < 17) return "Good afternoon!";
    if (hour >= 17 && hour < 21) return "Good evening!";
    return "Good night!";
}

function ProfileDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({ first_name: '', last_name: '', role: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/member-admin/profile/portfolio');
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                if (memberInfo) {
                    setUser({
                        first_name: memberInfo.first_name || memberInfo.username || 'Photographer',
                        last_name: memberInfo.last_name || '',
                        role: memberInfo.roles?.[0]?.name || 'Member',
                    });
                }
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            } catch (error) {
                console.error('Error loading profile dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profile" />
                        <div className="content">
                            <div className="dashboard-card" id="cl">
                                <div className="profile-card">
                                    <div className="profile-left">
                                        <div className="profile-info">
                                            <small className="greeting">{greetingMessage()}</small>
                                            <h2 className="name">{user.first_name} {user.last_name}</h2>
                                            <small className="role">{user.role}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-section">
                                    <div className="stat-card">
                                        <small className="ca-details">My Photos</small>
                                        <h3 className="number">{totals.totalPhotos}</h3>
                                    </div>
                                    <div className="event-cards">
                                        <small className="ca-details">Interactions</small>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                            </div>
                                            <div className="days col-md-7">
                                                <span>Likes & Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ marginTop: '10px' }}>
                                <div className="col-md-6">
                                    <div className="comments-cards" style={{ height: '400px', overflowY: 'auto', width: '750px', backgroundColor: 'white' }}>
                                        <h5>My Interests</h5>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                            </div>
                                            <div className="col-md-6">
                                                <p><label className="role">Colour Competition</label></p>
                                                <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                                            </div>
                                        </div>
                                        <div className="divider2"></div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                            </div>
                                            <div className="col-md-6">
                                                <p><label className="role">Print Competition</label></p>
                                                <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                                            </div>
                                        </div>
                                        <div className="divider2"></div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                            </div>
                                            <div className="col-md-6">
                                                <p><label className="role">Potrait Competition</label></p>
                                                <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                                            </div>
                                        </div>
                                        <div className="divider2"></div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                            </div>
                                            <div className="col-md-6">
                                                <p><label className="role">Colour Competition</label></p>
                                                <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                                            </div>
                                        </div>
                                        <div className="divider2"></div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                            </div>
                                            <div className="col-md-6">
                                                <p><label className="role">Print Competition</label></p>
                                                <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                                            </div>
                                        </div>
                                        <div className="divider2"></div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                            </div>
                                            <div className="col-md-6">
                                                <p><label className="role">Potrait Competition</label></p>
                                                <a href="#" className="text-secondary">Remove</a> | <a href="#" className="text-secondary">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="comments-cards" style={{ height: '400px', overflowY: 'auto', width: '710px', backgroundColor: 'white' }}>
                                        <h5>My Brands</h5>
                                        <div className="row" style={{ marginBottom: '20px' }}>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginBottom: '20px' }}>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginBottom: '20px' }}>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                            <div className="col-md-2">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} alt="br" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card" style={{ padding: '20px' }}>
                                        <h5>My Social Links</h5>
                                        <div className="row align-items-center mb-3">
                                            <div className="col-md-2 text-center">
                                                <div className="social-media-icones">
                                                    <a href="#" style={{ backgroundColor: '#99816b', color: 'white' }}><i className="fab fa-facebook-f"></i></a>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <p className="mb-0 head">Facebook</p>
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
                                                <p className="mb-0 head">Instagram</p>
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
                                                <p className="mb-0 head">Twitter</p>
                                                <p className="mb-0 text-muted">www.twitter.com/username</p>
                                            </div>
                                            <div className="col-md-3 text-end">
                                                <a href="#" className="btn btn-outline-dark px-4" style={{ width: '100px', fontSize: '16px' }}>Edit</a>
                                            </div>
                                        </div>
                                        <div className="button-group">
                                            <button className="btn me-2" id="e-view">Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card" style={{ padding: '20px' }}>
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
                                            <button className="btn me-2" id="e-view">Add</button>
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
}
export default ProfileDashboard;
