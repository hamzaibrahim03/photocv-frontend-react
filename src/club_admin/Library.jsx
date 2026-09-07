import { useEffect, useState } from "react";
import Loader from "../React/extra/LoaderAll";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import SavedLibraryCard from "./SavedLibrary";
import Calendar from "../React/extra/CalendarRyton";
function Library() {
    const [isLoading, setIsLoading] = useState(true);
    const [savedLibrary, setSavedLibrary] = useState(() => JSON.parse(localStorage.getItem("savedLibrary") || "[]"));
    const [dashboardData, setDashboardData] = useState([]);
    const [activeFilter, setActiveFilter] = useState("Events");
    const [search, setSearch] = useState("");
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    const filters = [
        "Events",
        "Competitions",
        "Galleries",
        "Notices",
        "News"
    ];
    const filteredItems = savedLibrary.filter(item => {
        const categoryMatch = item.category === activeFilter;
        const searchMatch = item.title
            ?.toLowerCase()
            .includes(
                search.toLowerCase()
            );
        return (
            categoryMatch &&
            searchMatch
        );
    });
    const removeItem = (item) => {
        const updated = savedLibrary.filter(
            saved =>
                !(
                    saved.id === item.id &&
                    saved.category === item.category
                )
        );
        localStorage.setItem(
            "savedLibrary",
            JSON.stringify(updated)
        );
        setSavedLibrary(updated);
    };
    useEffect(() => {
        async function loadDashboardData() {
            const response = await fetch('http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/dashboard', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setDashboardData(data.data);
        }
        loadDashboardData();
    }, []);
    console.log(dashboardData)
    return (
        <>
            <div style={{ backgroundColor: "#eee8e3" }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Library" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: "1820px" }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <h2 className="name">
                                                        Saved Library
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
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
                                <div className="container" style={{ maxWidth: "1820px" }}>
                                    <div className="filter-buttons">
                                        {filters.map((filter) => (
                                            <button key={filter} className={`filter-btn ${activeFilter === filter ? "active" : ""}`} onClick={() => setActiveFilter(filter)}>
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px" }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            {filteredItems.length > 0 ? (
                                                filteredItems.map((item, index) => (
                                                    <SavedLibraryCard key={`${item.category}-${item.id}`} item={item} index={index} onRemove={removeItem} />
                                                ))
                                            ) : (
                                                <div className="library-empty">
                                                    <h4>
                                                        No saved{" "}
                                                        {
                                                            activeFilter
                                                        }
                                                    </h4>
                                                    <p>
                                                        Your bookmarked{" "}
                                                        {
                                                            activeFilter.toLowerCase()
                                                        }{" "} will appear here.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
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
}
export default Library;
