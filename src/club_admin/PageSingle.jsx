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
function PageSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Single page object
    const [page, setpage] = useState(null);
    const [pageExtra, setpageExtra] = useState(null);
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
        if (!page?.created_at) {
            return '';
        }
        return dayjs(page.created_at).format('MMMM D, dddd');
    }, [page?.created_at]);
    const getpageData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages/${id}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to load page. Status: ${response.status}`
                );
            }
            const data = await response.json();
            console.log("PAGE API RESPONSE:", data);
            setpage(data?.data || null);
        } catch (error) {
            console.error("PAGE API ERROR:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    async function getpageExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setpageExtra(data.data);
    };
    useEffect(() => {
        if (id) {
            getpageData();
        }
    }, [id]);
    useEffect(() => {
        getpageExtra();
    }, []);
    if (!isLoading && error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h5>Unable to load page</h5>
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
    if (!isLoading && !page) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    page not found.
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
                        <HeaderRoute title="Pages" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4" style={{ gap: '15px' }}>
                                        <div class="profile-card">
                                            <div class="profile-left">
                                                <div class="profile-info">
                                                    <small class="greeting">New page</small>
                                                    <h2 class="name">{page?.title}</h2>
                                                    <small class="role">{formatDate(page?.created_at)}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Drafts</small>
                                                <h3 className="number"> {pageExtra?.total_drafted_pages}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Latest change</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{pageExtra?.last_page_days_ago}</h3>
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
                                                                {page.featured_image_url ? (
                                                                    <img src={page.featured_image_url} alt={page.name} style={{ maxWidth: '300px', width: '100%', height: '250px', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100%', height: '250px' }}>
                                                                        No Image
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-8">
                                                                <div className="d-flex justify-content-space-between" style={{ gap: '300px' }}>
                                                                    <h5>
                                                                        {page.title}
                                                                    </h5>
                                                                    <div className="e-icon-container">
                                                                        {page.types?.map((t, i) => (
                                                                            <div key={t.id || i} className="d-flex align-items-center justify-content-center gap-3" style={{ width: '180px' }}>
                                                                                <img className="head" src={t.icon_url} alt={t.name} style={{ width: "20px", height: "20px" }} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="date rounded">
                                                                    {formattedStartDate}
                                                                </p>
                                                                <p className="text-secondary" dangerouslySetInnerHTML={{ __html: page.description || '' }} />
                                                            </div>
                                                        </div>
                                                        <div className="button-group mt-4" style={{ position: 'absolute', bottom: '20px' }}>
                                                            <button className="btn text-white me-3" style={{ backgroundColor: '#99816b', width: '120px' }} onClick={() => navigate(-1)}>
                                                                Back
                                                            </button>
                                                            <Link to={`/pages/${page.id}/edit`}>
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
                                                            <h5 className="head">Recent Comments on page</h5>
                                                            {pageExtra?.recent_comments?.slice(0, 4)?.map((comment) => (
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
                                                            <h5 className="head">More pages</h5>
                                                            {pageExtra?.random_pages?.slice(0, 6)?.map((page) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={page.id}>
                                                                    <div className="event-item">
                                                                        {page.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={page.featured_image_url} onError="this.src='null'" />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{page?.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(page?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(page?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="button-group mt-auto">
                                                                <button className="btn btn-sm" id="e-view" onClick="{() => navigate(/pages)}">
                                                                    View All
                                                                </button>
                                                                <button className="btn btn-sm" id="new" onClick="{() => navigate(/pages/create)}">
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
export default PageSingle;
