import React, { useState } from 'react';
import NavigationRoute from '../../components/NavigationRoute';
import HeaderRoute from '../../components/HeaderRoute';
import ClubProfile from '../../partials/club_admin/club/ClubProfile';
import ProfileMember from '../../partials/club_admin/membersingle/ProfileMember';
import KamranComments from '../../partials/club_admin/membersingle/KamranComments';
import KamranLikes from '../../partials/club_admin/membersingle/KamranLikes';
import KamranEntries from '../../partials/club_admin/membersingle/KamranEntries';
import KamranAwards from '../../partials/club_admin/membersingle/KamranAwards';
import KamranGallery from '../../partials/club_admin/membersingle/KamranGallery';

const MemberSingle = () => {
    const [memberCount] = useState(50);

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Members" />
            <div className="content" style={{ padding: '0 30px' }}>
                <section>
                    <div className="container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                            <ClubProfile greeting="List of members in the Club" name="All Members" role="25 Member Galleries" />

                            <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                    <small className="ca-details fs-5">Members</small>
                                    <h3 className="number mt-4 fw-medium" style={{ fontSize: '48px' }}>{memberCount}</h3>
                                </div>
                                <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                    <small className="ca-details fs-5">Interactions</small>
                                    <div className="row mt-4 align-items-center">
                                        <div className="col-md-5">
                                            <h3 className="number m-0 fw-medium" style={{ fontSize: '48px' }}>4k</h3>
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
                    <div className="container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                        <div className="photographeres">
                            <ProfileMember />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container mx-auto px-0 mt-4" style={{ maxWidth: '1810px' }}>
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <KamranComments />
                            </div>
                            <div className="col-md-6 mb-4">
                                <KamranLikes />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container mx-auto px-0 mt-2" style={{ maxWidth: '1810px' }}>
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <KamranEntries />
                            </div>
                            <div className="col-md-6 mb-4">
                                <KamranAwards />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container mx-auto px-0 pb-5" style={{ maxWidth: '1810px' }}>
                        <KamranGallery />

                        <div className="dt-paging mt-5 d-flex justify-content-center">
                            <nav aria-label="pagination">
                                <ul className="pagination m-0">
                                    <li className="page-item disabled">
                                        <button className="page-link text-dark shadow-none" tabIndex="-1">«</button>
                                    </li>
                                    <li className="page-item disabled">
                                        <button className="page-link text-dark shadow-none" tabIndex="-1">‹</button>
                                    </li>
                                    <li className="page-item active">
                                        <button className="page-link shadow-none" style={{ backgroundColor: '#99816b', borderColor: '#99816b', color: 'white' }}>1</button>
                                    </li>
                                    <li className="page-item disabled">
                                        <button className="page-link text-dark shadow-none">›</button>
                                    </li>
                                    <li className="page-item disabled">
                                        <button className="page-link text-dark shadow-none">»</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MemberSingle;
