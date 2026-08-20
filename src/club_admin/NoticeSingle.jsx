import React, { useState, useEffect } from 'react';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import CalendarDashboard from './Calendars/CalendarDashboard';
import RecentComments from '../notices/RecentComments'; // Assuming these will be React components too
import MoreNotices from '../notices/MoreNotices';
import ProfileWithoutSearch from '../competitionsadd/ProfileWithoutSearch';
import NoticeForm from '../noticesingle/NoticeForm';

const NoticeSingle = () => {
    // Mock Store state
    const [memberCount, setMemberCount] = useState(0);
    const [eventDay, setEventDay] = useState(0);

    useEffect(() => {
        // fetchNotices mock
        const fetchNotices = async () => {
            try {
                // mock api logic
                setMemberCount(10);
                setEventDay(5);
            } catch (e) {
                console.error(e);
            }
        };
        fetchNotices();
    }, []);

    return (
        <div className="content" style={{ padding: '0 30px', backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Notices" />

            <section>
                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4" style={{ gap: '15px' }}>
                        <ProfileWithoutSearch greeting="New Notice" name="Title here" role="Dec 20, 2024" />

                        <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                            <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                <small className="ca-details" style={{ fontSize: '20px' }}>Notices</small>
                                <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                            </div>
                            <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                <small className="ca-details" style={{ fontSize: '20px' }}>Last Notice</small>
                                <div className="row mt-4 align-items-center">
                                    <div className="col-md-5">
                                        <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{eventDay}</h3>
                                    </div>
                                    <div className="days col-md-7 text-start">
                                        <span style={{ fontSize: '16px' }}>days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                <div className="row mt-4">
                    <NoticeForm />
                    <div className="col-md-4">
                        <section>
                            <div id="right" className="d-flex flex-column gap-4">
                                <div className="cardddd bg-white rounded shadow-sm" style={{ padding: '0' }}>
                                    <CalendarDashboard />
                                </div>
                                <div id="news" className="d-flex flex-column gap-4">
                                    <RecentComments />
                                    <MoreNotices />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeSingle;
