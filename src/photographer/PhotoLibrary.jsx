import { useEffect, useState } from "react";
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import PhotoSavedLibraryCard from "./PhotoSavedLibrary";
import Calendar from "../Ryton/extra/CalendarRyton";
import apiClient from "../api/axios";
function PhotoLibrary() {
    const [isLoading, setIsLoading] = useState(true);
    const [savedLibrary, setSavedLibrary] = useState([]);
    const [activeFilter, setActiveFilter] = useState("Events");
    const [search, setSearch] = useState("");
    useEffect(() => {
        async function loadSavedLibrary() {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/saved-library-items');
                const data = response.data?.data || response.data;
                const rows = Array.isArray(data) ? data : [];
                setSavedLibrary(rows.map(row => ({
                    ...row,
                    id: row.item_id,
                    savedId: row.id,
                })));
            } catch (error) {
                console.error('Error loading saved library:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadSavedLibrary();
    }, []);
    const filters = ["Events", "Competitions", "Galleries", "Notices", "News"];
    const filteredItems = savedLibrary.filter(item => {
        const categoryMatch = item.category === activeFilter;
        const searchMatch = item.title?.toLowerCase().includes(search.toLowerCase());
        return (
            categoryMatch &&
            searchMatch
        );
    });
    const removeItem = async (item) => {
        try {
            await apiClient.delete(`/saved-library-items/${item.savedId}`);
            setSavedLibrary(prev => prev.filter(saved => saved.savedId !== item.savedId));
        } catch (error) {
            console.error('Error removing saved item:', error);
        }
    };
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
                                    <div className="dashboard-card" id="cl">
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
                                                <small className="ca-details">Saved Items</small>
                                                <h3 className="number">{String(savedLibrary.length).padStart(2, "0")}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">{activeFilter}</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{String(filteredItems.length).padStart(2, '0')}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>saved</span>
                                                    </div>
                                                </div>
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
                                                    <PhotoSavedLibraryCard key={`${item.category}-${item.id}`} item={item} index={index} onRemove={removeItem} />
                                                ))
                                            ) : (
                                                <div className="library-empty">
                                                    <h4>
                                                        No saved{" "} {activeFilter}
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
}
export default PhotoLibrary;
