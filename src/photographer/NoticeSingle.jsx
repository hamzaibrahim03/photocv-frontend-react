import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import dayjs from 'dayjs';
import Calendar from "../Ryton/extra/CalendarRyton";
import HeaderRoute from "../club_admin/HeaderRoute";
import NavigationRoute from "../club_admin/NavigationRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";
function NoticeSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [noticeExtra, setNoticeExtra] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const formatDate = (date) => {
        if (!date) {
            return '';
        }
        return new Date(date).toLocaleDateString('en-GB', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const formatTime = (datetimeStr) => {
        if (!datetimeStr) {
            return '';
        }
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formattedStartDate = useMemo(() => {
        if (!notice?.created_at) {
            return '';
        }
        return dayjs(notice.created_at).format('MMMM D, dddd');
    }, [notice?.created_at]);
    const getNoticeData = async () => {
        try {
            setError(null);
            const response = await apiClient.get(`/photographer/notices/${id}`);
            setNotice(response.data?.data || null);
        } catch (error) {
            console.error("NOTICE API ERROR:", error);
            setError(error.response?.data?.message || error.message);
        }
    };
    async function getNoticeExtra() {
        try {
            const response = await apiClient.get('/photographer/notice-extras');
            setNoticeExtra(response.data?.data || {});
        } catch (error) {
            console.error("NOTICE EXTRAS API ERROR:", error);
            setNoticeExtra({});
        }
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    id ? getNoticeData() : Promise.resolve(),
                    getNoticeExtra(),
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);
    if (!isLoading && error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h5>Unable to load notice</h5>
                    <p className="mb-0">
                        {error}
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }
    if (!isLoading && !notice) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    Notice not found.
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Notices" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">New Notice</small>
                                                    <h2 className="name">{notice?.title}</h2>
                                                    <small className="role">{formatDate(notice?.created_at)}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Notices</small>
                                                <h3 className="number"> {noticeExtra?.total_notices}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Last Notice</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{noticeExtra?.last_notice_days_ago}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>days ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div id="news">
                                                <div className="news-list">
                                                    <div className="custom-cards" style={{ display: 'flex', borderRadius: '10px', width: '100%', height: '350px', margin: 'auto', flexDirection: 'column', backgroundColor: 'white', padding: '40px 80px' }}>
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                {notice.featured_image_url ? (
                                                                    <img src={notice.featured_image_url} alt={notice.name} style={{ maxWidth: '300px', width: '100%', height: '250px', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100%', height: '250px' }}>
                                                                        No Image
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-8">
                                                                <div className="d-flex justify-content-space-between" style={{ gap: '300px' }}>
                                                                    <h5>
                                                                        {notice.title}
                                                                    </h5>
                                                                    <div className="e-icon-container">
                                                                        {notice.types?.map((t, i) => (
                                                                            <div key={t.id || i} className="d-flex align-items-center justify-content-center gap-3" style={{ width: '180px' }}>
                                                                                <img className="head" src={t.icon_url} alt={t.name} style={{ width: "20px", height: "20px" }} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="date rounded">
                                                                    {formattedStartDate}
                                                                </p>
                                                                <p className="text-secondary" dangerouslySetInnerHTML={{ __html: notice.description || '' }} />
                                                                <div className="button-group">
                                                                    <button className="btn" id="e-view" onClick={() => navigate(-1)}>
                                                                        Back
                                                                    </button>
                                                                    <button className="btn" id="edit" onClick={() => navigate(`/notice/${notice.id}/edit`)} style={{ backgroundColor: '#4c4036', width: '120px' }}>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments on Notice</h5>
                                                            {noticeExtra?.recent_comments?.slice(0, 4)?.map((comment) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                    <div className="event-item">
                                                                        {comment?.comments?.[0]?.user?.profile_image_url ? (
                                                                            <img className="img-fluid event-img" src={comment?.comments?.[0]?.user?.profile_image_url} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{comment?.comments?.[0]?.comment}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(comment?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(comment?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">More Notices</h5>
                                                            {noticeExtra?.random_notices?.slice(0, 6)?.map((notice) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={notice.id}>
                                                                    <div className="event-item">
                                                                        {notice.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={notice.featured_image_url} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{notice?.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(notice?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(notice?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="button-group mt-auto">
                                                                <button className="btn" id="e-view" onClick={() => navigate('/post')}>
                                                                    View All
                                                                </button>
                                                                <button className="btn" id="new" onClick={() => navigate('/notice')}>
                                                                    Add New
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default NoticeSingle;
