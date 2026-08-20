import React, { useState } from 'react';
import NavigationRoute from '../../components/NavigationRoute';
import HeaderRoute from '../../components/HeaderRoute';
import CalendarDashboard from '../../components/club_admin/Calendars/CalendarDashboard';
import RecentSubmissions from '../../partials/club_admin/competitions/RecentSubmissions';
import MoreCompetitions from '../../partials/club_admin/competitions/MoreCompetitions';
import FormAdd from '../../partials/club_admin/competitionsset/FormAdd';

const CompetitionSettings = () => {
    // Mock user state
    const [memberCount, setMemberCount] = useState(50);
    const [eventDay, setEventDay] = useState(12);

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Competitions" />
            <div className="content" style={{ padding: '0 30px' }}>
                <section>
                    <div className="container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                            <div className="profile-card d-flex flex-column justify-content-center bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px', position: 'relative' }}>
                                <small className="greeting text-muted mb-1" style={{ fontSize: '18px' }}>Planned and Regular Club Competition</small>
                                <h2 className="name m-0 text-dark fw-bold mb-1" style={{ fontSize: '30px' }}>Settings / Default Values</h2>
                                <small className="role text-danger" style={{ fontSize: '14px' }}>Any values selected here would become default for new competition entry</small>
                            </div>

                            <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                    <small className="ca-details fs-5">Competitions</small>
                                    <h3 className="number mt-4 fw-medium" style={{ fontSize: '48px' }}>{memberCount}</h3>
                                </div>
                                <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                    <small className="ca-details fs-5">Next Competition</small>
                                    <div className="row mt-4 align-items-center">
                                        <div className="col-md-5">
                                            <h3 className="number m-0 fw-medium" style={{ fontSize: '48px' }}>{eventDay}</h3>
                                        </div>
                                        <div className="days col-md-7 text-start">
                                            <span>days to go</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="row container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                    <div className="col-md-8 px-0">
                        {/* Assuming FormAdd spans 8 cols internally or we wrap it */}
                        <div className="bg-white p-4 rounded shadow-sm">
                            <FormAdd />
                        </div>
                    </div>

                    <div className="col-md-4 px-3">
                        <section className="d-flex flex-column gap-4">
                            <div className="bg-white rounded shadow-sm">
                                <CalendarDashboard />
                            </div>
                            <div className="d-flex flex-column gap-4">
                                <RecentSubmissions />
                                <MoreCompetitions />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitionSettings;
