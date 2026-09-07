import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "./NavigationRoute.jsx";
import Image from "./assets/icons/dashboard/profile_image.svg";
import Comment from "./assets/icons/dashboard/comment.svg";
import Point from "./assets/icons/dashboard/point.svg";
import HeaderRoute from "./HeaderRoute.jsx";
import Calendar from "../React/extra/CalendarRyton.jsx"
import Loader from "../React/extra/LoaderAll.jsx";
function DashboardRoute() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({})
    const columns = 5;
    const [isLoading, setIsLoading] = useState(true);
    const columnss = 3;
    useEffect(() => {
        getDashboardData();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    async function getDashboardData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/dashboard'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setDashboardData(data.data);
    };
    console.log(dashboardData)
    const hour = new Date().getHours();
    const greetingMessage = () => {
        if (hour >= 5 && hour < 12) return "Good morning!";
        if (hour === 12) return "Good noon!";
        if (hour > 12 && hour < 17) return "Good afternoon!";
        if (hour >= 17 && hour < 21) return "Good evening!";
        return "Good night!";
    };
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const upcomingEvents = useMemo(() => {
        const allEvents = dashboardData?.events || [];
        console.log(Array.isArray(allEvents));
        console.log(allEvents);
        const now = new Date();
        return allEvents
            .filter((event) => {
                const eventDate = new Date(event.event_date);
                return eventDate >= now;
            })
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    });
    const upcomingCompetitions = useMemo(() => {
        const allCompetitions = dashboardData?.competitions || [];
        const now = new Date();
        return allCompetitions
            .filter((competition) => {
                const competitionDate = new Date(competition.start_date);
                return competitionDate >= now;
            })
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    });
    const latestNews = useMemo(() => {
        const allNews = dashboardData?.club_news || [];
        const now = new Date();
        return allNews
            .filter(news => new Date(news.publish_date) <= now)
            .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))
            .slice(0, 6);
    });
    const recentNotices = useMemo(() => {
        const notices = dashboardData?.member_notices || [];
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 360);
        return notices
            .filter((notice) => {
                const createdDate = new Date(notice.created_at);
                return createdDate >= oneWeekAgo && createdDate <= now;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 6);
    });
    const hexToRgba = (hex, alpha) => {
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    }
    const getPositionClass = (index, total) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const lastIndex = total - 1;
        if (index === 0) return "top-left";
        if (row === 0 && col === columns - 1) return "top-right";
        if (row === Math.floor(lastIndex / columns) && col === 0) return "bottom-left";
        if (index === lastIndex) return "bottom-right";
        return "";
    }
    const getPositionedClass = (index, total) => {
        const row = Math.floor(index / columnss);
        const col = index % columnss;
        const lastIndex = total - 1;
        if (index === 0) return "top-left";
        if (row === 0 && col === columnss - 1) return "top-right";
        if (row === Math.floor(lastIndex / columnss) && col === 0) return "bottom-left";
        if (index === lastIndex) return "bottom-right";
        return "";
    }
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid" src={dashboardData?.user_details?.profile_image} alt="Profile Picture" />
                                                <div className="profile-info">
                                                    <span className="greeting">
                                                        {greetingMessage()}
                                                    </span>
                                                    <h2 className="name">
                                                        {dashboardData?.user_details?.first_name + " " + dashboardData?.user_details?.last_name}
                                                    </h2>
                                                    <p className="role">
                                                        {dashboardData?.user_details?.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="profile-icons">
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardData?.clubGalleries?.original?.data?.total_photos}</span>
                                                    <img src={Image} alt="image-icon" />
                                                </div>
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardData?.clubGalleries?.original?.data?.total_comments}</span>
                                                    <img src={Comment} alt="comment-icon" />
                                                </div>
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardData?.clubGalleries?.original?.data?.total_likes}</span>
                                                    <img src={Point} alt="point-icon" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Members</small>
                                                <h3 className="number">{String(dashboardData?.total_members_count).padStart(2, "0")}</h3>
                                            </div>
                                            <div className="event-cards">
                                                {dashboardData?.upcoming_event?.remaining_days !== undefined &&
                                                    dashboardData?.upcoming_event?.remaining_days !== null ? (
                                                    <>
                                                        <small className="ca-details">Next Event</small>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <h3 className="number">{String(dashboardData?.upcoming_event?.remaining_days).padStart(2, '0')}</h3>
                                                            </div>
                                                            <div className="days col-md-7">
                                                                <span>days to go</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h3 className="days">
                                                            No upcoming events
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dash-upcoming-sections">
                                        <div className="event-card d-flex flex-column">
                                            <h5 className="head">Upcoming Events</h5>
                                            {upcomingEvents.length > 0 ? (
                                                <>
                                                    <div className="event-list">
                                                        {upcomingEvents.map((event, index) => (
                                                            <div className="event-item" key={index} style={{ marginBottom: "10px" }}>
                                                                {event.featured_image_url ? (
                                                                    <img className="img-fluid event-img" src={event.featured_image_url} alt="Event" error="event.featured_image_url=null" />
                                                                ) : (
                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                    </div>
                                                                )}
                                                                <div className="event-details">
                                                                    <div className="event-info">
                                                                        <span id="ename">{event.name}</span>
                                                                    </div>
                                                                    <div className="event-time" id="edate">
                                                                        <small className="event-date galtext">{formatDate(event.event_date)}</small><br />
                                                                        <small className="event-time-details galtext">{formatTime(event.event_date)}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '250px', color: '#7FA483' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>No events found</span>
                                                    <span style={{ textAlign: 'center', width: '420px' }}>There are currently no events scheduled. Check back soon for updates!</span>
                                                </div>
                                            )}
                                            <div className="button-group mt-auto">
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/event')}>
                                                    View All
                                                </button>
                                                <button className="btn btn-sm" id="new" onClick={() => navigate('/event/create')}>
                                                    Add New
                                                </button>
                                            </div>
                                        </div>
                                        <div className="comp-card d-flex flex-column">
                                            <h5 className="head">Upcoming Competitions</h5>
                                            {upcomingCompetitions.length > 0 ? (
                                                <>
                                                    <div className="event-list">
                                                        {upcomingCompetitions.map((comp, index) => (
                                                            <div className="event-item" key={index}>
                                                                {comp.featured_image_url ? (
                                                                    <img className="img-fluid event-img" src={comp.featured_image_url} alt="Event" />
                                                                ) : (
                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                    </div>
                                                                )}
                                                                <div className="event-details">
                                                                    <div className="event-info">
                                                                        <span id="ename">{comp.name}</span>
                                                                    </div>
                                                                    <div className="event-time" id="edate">
                                                                        <small className="event-date galtext">{formatDate(comp.start_date)}</small><br />
                                                                        <small className="event-time-details galtext">{formatTime(comp.start_date)}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "250px", color: '#7FA483' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>No competitions found</span>
                                                    <span style={{ textAlign: "center", width: "400px", }}>
                                                        There are currently no competitions scheduled. Check back soon for updates!
                                                    </span>
                                                </div>
                                            )}
                                            <div className="button-group mt-auto">
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/competitions')}>
                                                    View All
                                                </button>
                                                <button className="btn btn-sm" id="new" onClick={() => navigate('/competitions/create')}>
                                                    Add New
                                                </button>
                                            </div>
                                        </div>
                                        <div className="calendar-card d-flex flex-column">
                                            <Calendar />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="upcoming-section">
                                        <div className="latest-card d-flex flex-column">
                                            <h5 className="head">Latest Members</h5>
                                            <div className="row">
                                                {dashboardData?.latest_members?.slice(0, 6).map((latestMember) => (
                                                    <div className="col-6" key={latestMember.id}>
                                                        <div className="event-items text-center">
                                                            {latestMember.profile_image_url ? (
                                                                <img className="img-fluid event-img" src={latestMember.profile_image_url} alt="Profile" />
                                                            ) : (
                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                </div>
                                                            )}
                                                            <div className="memtext" id="memname">
                                                                <span>{latestMember.first_name + ' ' + latestMember.last_name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="button-group mt-auto">
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/members')}>
                                                    View All
                                                </button>
                                                <button className="btn btn-sm" id="new" onClick={() => navigate('/members/create')}>
                                                    Add New
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px' }}>
                                                <h5 className="head">Member Galleries</h5>
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/member-gallery')}>
                                                    View All
                                                </button>
                                            </div>
                                            <div className="pics">
                                                {dashboardData?.member_galleries?.map((item, index) => (
                                                    <div key={item.id} className={`pics-items ${getPositionClass(index, dashboardData?.member_galleries.length)}`}>
                                                        {item?.galleries?.[0]?.photos?.[0]?.image_url && (
                                                            <img src={item?.galleries?.[0]?.photos?.[0]?.image_url} alt={item?.galleries?.[0]?.gallery_name} />
                                                        )}
                                                        <div className={`pics-infos ${getPositionClass(index, dashboardData?.member_galleries.length)}`} style={{ backgroundColor: hexToRgba('#7FA483', 0.7) }}>
                                                            <div>
                                                                {item?.galleries?.[0]?.gallery_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dash-upcoming-sections">
                                        <div className="result-card d-flex flex-column">
                                            <div className="d-flex justify-content-between mb-2">
                                                <h5 className="head">Recent Results</h5>
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/results')}>View All</button>
                                            </div>
                                            <div className="pic">
                                                {dashboardData?.recent_results?.original?.data.slice(0, 6).map((item, index) => (
                                                    <div key={item.id} className={`pic-item ${getPositionedClass(index, dashboardData?.recent_results?.original?.data.slice(0, 6).length)}`}>
                                                        {item?.competition_members?.[0]?.entries?.[0]?.entry_image_thumb && (
                                                            <img className="img-fluid" src={item?.competition_members?.[0]?.entries?.[0]?.entry_image_thumb} alt={item.gallery_name} />
                                                        )}
                                                        <div className={`pic-info ${getPositionedClass(index, dashboardData?.recent_results?.original?.data.slice(0, 6).length)}`} style={{ backgroundColor: hexToRgba('#7FA483', 0.7) }}>
                                                            <div>
                                                                {item?.competition_members?.[0]?.entries?.[0]?.entry_image_title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="notice-card d-flex flex-column">
                                            <h5 className="head">Recent Notices</h5>
                                            {recentNotices.length > 0 ? (
                                                <div className="event-list">
                                                    {recentNotices.map((notice, index) => (
                                                        <div className="event-item" key={notice.id}>
                                                            {notice.featured_image_url && (
                                                                <img className="img-fluid event-img" src={notice.featured_image_url} alt="News" />
                                                            )}
                                                            {!notice.featured_image_url && (
                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                </div>
                                                            )}
                                                            <div className="event-details">
                                                                <span id="pname">{notice.title}</span>
                                                                <div className="event-time" id="edate">
                                                                    <small className="event-date galtext">{formatDate(notice.created_at)}</small><br />
                                                                    <small className="event-time-details galtext">{formatTime(notice.created_at)}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "250px", color: '#7FA483' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>No notices found</span>
                                                    <span style={{ textAlign: "center", width: "420px" }}>
                                                        There are currently no notices scheduled. Check back soon for updates!
                                                    </span>
                                                </div>
                                            )}
                                            <div className="button-group mt-auto">
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/notices')}>
                                                    View All
                                                </button>
                                                <button className="btn btn-sm" id="new" onClick={() => navigate('/notices/create')}>
                                                    Add New
                                                </button>
                                            </div>
                                        </div>
                                        <div className="news-card d-flex flex-column">
                                            <h5 className="head">Latest News</h5>
                                            {latestNews.length > 0 ? (
                                                <div className="event-list" style={{ paddingTop: "20px" }}>
                                                    {dashboardData?.club_news.map((news, index) => (
                                                        <div className="event-item" key={index} style={{ marginBottom: "10px" }}>
                                                            {news.featured_image_url ? (
                                                                <img className="img-fluid event-img" src={news.featured_image_url} alt="News" />
                                                            ) : (
                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                </div>
                                                            )}
                                                            <div className="event-details">
                                                                <span id="pname">{news.title}</span>
                                                                <div className="event-time" id="edate">
                                                                    <small className="event-date galtext">{formatDate(news.publish_date)}</small><br />
                                                                    <small className="event-time-details galtext">{formatTime(news.publish_date)}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "250px", color: '#7FA483', }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>No news found</span>
                                                    <span style={{ textAlign: "center", width: "420px" }}>
                                                        There are currently no news scheduled. Check back soon for updates!
                                                    </span>
                                                </div>
                                            )}
                                            <div className="button-group mt-auto">
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/news')}>
                                                    View All
                                                </button>
                                                <button className="btn btn-sm" id="new" onClick={() => navigate('/news/create')}>
                                                    Add New
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="upcoming-section" style={{ display: "flex" }}>
                                        <div className="latest-card d-flex flex-column">
                                            <h5 className="head">Recent Pages</h5>
                                            <div className="row">
                                                {dashboardData?.pages?.map((page, index) => (
                                                    <div className="col-6" key={index}>
                                                        <div className="event-items text-center">
                                                            {page.featured_image_url ? (
                                                                <img className="img-fluid event-img" src={page.featured_image_url} alt="Profile" />
                                                            ) : (
                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                </div>
                                                            )}
                                                            <div className="memtext" id="memname">
                                                                <span>{page.title}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="button-group mt-auto">
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/pages')}>
                                                    View All
                                                </button>
                                                <button className="btn btn-sm" id="edit" onClick={() => navigate('/pages/create')}>
                                                    Add New
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px' }}>
                                                <h5 className="head">Club Galleries</h5>
                                                <button className="btn btn-sm" id="aview" onClick={() => navigate('/club-galleries')}>
                                                    View All
                                                </button>
                                            </div>
                                            <div className="pics">
                                                {dashboardData?.clubGalleries?.original?.data.map((item, index) => (
                                                    <div key={item.id || index} className={`pics-items ${getPositionClass(index, dashboardData?.clubGalleries?.original?.data.length)}`}>
                                                        {
                                                            item.photos && item.photos.length && (
                                                                <>
                                                                    <img src={item.photos[0].image} alt={item.photos[0].title} />
                                                                    <div className={`pics-infos ${getPositionClass(index, dashboardData?.clubGalleries?.original?.data.length)}`} style={{ backgroundColor: hexToRgba('#7FA483', 0.7) }}>
                                                                        {item.gallery_name}
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {dashboardData?.user_details?.username}</p>
                                </div>
                            </footer>
                        </div>
                    </>
                )
                }
            </div>
        </>
    );
}
export default DashboardRoute;
