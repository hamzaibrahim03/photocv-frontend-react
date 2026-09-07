import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import dayjs from 'dayjs';
import Calendar from "../React/extra/CalendarRyton";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Loader from "../React/extra/LoaderAll";
import Pro from './assets/icons/event_list/pro.svg';
import Cal from './assets/icons/event_list/cal.svg';
import Cam from './assets/icons/event_list/cam.svg';
import Mess from './assets/icons/event_list/mess.svg';
function NoticeSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Single notice object
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
            setIsLoading(true);
            setError(null);
            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/notices/${id}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to load notice. Status: ${response.status}`
                );
            }
            const data = await response.json();
            console.log("NOTICE API RESPONSE:", data);
            setNotice(data?.data || null);
        } catch (error) {
            console.error("NOTICE API ERROR:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    async function getNoticeExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/notices-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setNoticeExtra(data.data);
    };
    useEffect(() => {
        if (id) {
            getNoticeData();
        }
    }, [id]);
    useEffect(() => {
        getNoticeExtra();
    }, []);
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
                                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4" style={{ gap: '15px' }}>
                                        <div class="profile-card">
                                            <div class="profile-left">
                                                <div class="profile-info">
                                                    <small class="greeting">New Notice</small>
                                                    <h2 class="name">{notice?.title}</h2>
                                                    <small class="role">{formatDate(notice?.created_at)}</small>
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
                                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div id="news">
                                                <div className="news-list">
                                                    <div className="custom-cards" style={{ display: 'flex', borderRadius: '10px', width: '100%', height: '310px', margin: 'auto', flexDirection: 'column' }}>
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
                                                            </div>
                                                        </div>
                                                        <div className="button-group mt-4" style={{ position: 'absolute', bottom: '20px' }}>
                                                            <button className="btn text-white me-3" style={{ backgroundColor: '#99816b', width: '120px' }} onClick={() => navigate(-1)}>
                                                                Back
                                                            </button>
                                                            <Link to={`/notice/${notice.id}/edit`}>
                                                                <button className="btn text-white" style={{ backgroundColor: '#4c4036', width: '120px' }}>
                                                                    Edit
                                                                </button>
                                                            </Link>
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
                                                                            <img className="img-fluid event-img" src={comment?.comments?.[0]?.user?.profile_image_url} onError="this.src='null'" />
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
                                                                            <img className="img-fluid event-img" src={notice.featured_image_url} onError="this.src='null'" />
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
                                                                <button className="btn btn-sm" id="e-view" onClick="{() => navigate(/notices)}">
                                                                    View All
                                                                </button>
                                                                <button className="btn btn-sm" id="new" onClick="{() => navigate(/notices/create)}">
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
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default NoticeSingle;
