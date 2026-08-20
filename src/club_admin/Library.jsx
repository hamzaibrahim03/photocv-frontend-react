import { useEffect, useState } from "react";
import Loader from "../React/extra/LoaderAll";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import SavedLibraryCard from "./SavedLibrary";
import Calendar from "../React/extra/CalendarRyton";

function Library() {
    const [isLoading, setIsLoading] = useState(true);
    const [savedLibrary, setSavedLibrary] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [activeFilter, setActiveFilter] = useState("Events");
    const [search, setSearch] = useState("");
    useEffect(() => {
        getDashboardData();
    }, []);

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

    useEffect(() => {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "savedLibrary"
                ) || "[]"
            );

        setSavedLibrary(saved);

        setIsLoading(false);

    }, []);


    const filteredItems =
        savedLibrary.filter(item => {

            const categoryMatch =
                item.category === activeFilter;

            const searchMatch =
                item.title
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

        const updated =
            savedLibrary.filter(
                saved =>
                    !(
                        saved.id === item.id &&
                        saved.category ===
                        item.category
                    )
            );

        localStorage.setItem(
            "savedLibrary",
            JSON.stringify(updated)
        );

        setSavedLibrary(updated);
    };

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
    return (
        <>
            <div style={{ backgroundColor: "#eee8e3" }}>
                <Loader show={isLoading} />

                {!isLoading && (
                    <>
                        <NavigationRoute />

                        <HeaderRoute title="Library" />

                        <div className="content">

                            {/* SEARCH */}
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
                                                <small className="ca-details">Next Event</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{String(dashboardData?.upcoming_event?.remaining_days).padStart(2, "0")}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>days to go</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* CATEGORIES */}
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

                            {/* SAVED ITEMS */}
                            <section>
                                <div className="container" style={{ maxWidth: "1820px" }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            {filteredItems.length > 0 ? (
                                                filteredItems.map(item => (
                                                    <SavedLibraryCard key={`${item.category}-${item.id}`} item={item} onRemove={removeItem} />
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
