import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

function SuperClubsList() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [view, setView] = useState("grid");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = view === "grid" ? 12 : 20;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchClubs(search);
        }, search ? 300 : 0);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    const fetchClubs = async (searchTerm) => {
        try {
            setIsLoading(true);
            const response = await apiClient.get("/super/clubs", { params: searchTerm ? { search: searchTerm } : {} });
            const data = response.data?.data || response.data;
            setClubs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading clubs:", error);
            setClubs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const totalMembers = clubs.reduce((sum, c) => sum + (c.membersCount || 0), 0);

    const filtered = clubs;

    const totalPages = Math.max(Math.ceil(filtered.length / rowsPerPage), 1);
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this club?")) return;
        try {
            await apiClient.delete(`/super/clubs/${id}`);
            setClubs((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Error deleting club:", error);
            alert(error?.response?.data?.message || "Unable to delete club.");
        }
    };

    const toggleStatus = async (id) => {
        try {
            const response = await apiClient.post(`/super/clubs/${id}/toggle-status`);
            const updatedClub = response.data?.data || response.data;
            setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedClub } : c)));
        } catch (error) {
            console.error("Error toggling club status:", error);
            alert(error?.response?.data?.message || "Unable to update club status.");
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Club" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="name">List of clubs</small>
                                                    <h2 className="role">All Clubs</h2>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Total Clubs</small>
                                                <h3 className="number">{clubs.length}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Total Members</small>
                                                <h3 className="number">{totalMembers}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="super-view-toggle">
                                        <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><i className="fa-solid fa-table-cells-large"></i></button>
                                        <button className={view === "compact" ? "active" : ""} onClick={() => setView("compact")}><i className="fa-solid fa-table"></i></button>
                                        <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}><i className="fa-solid fa-list"></i></button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    {filtered.length === 0 ? (
                                        <p className="super-empty-note">No clubs found.</p>
                                    ) : view === "table" || view === "compact" ? (
                                        <div className="super-panel">
                                            <table className="super-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Members</th>
                                                        <th>Established</th>
                                                        <th>Website</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginated.map((c) => (
                                                        <tr key={c.id}>
                                                            <td>
                                                                <div className="row-name">
                                                                    <img className="row-thumb" src={c.cover || "/placeholder.jpg"} alt={c.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    {c.name}
                                                                </div>
                                                            </td>
                                                            <td>{c.membersCount}</td>
                                                            <td>{c.established}</td>
                                                            <td><a href="#" onClick={(e) => e.preventDefault()}>Visit <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '11px' }}></i></a></td>
                                                            <td>
                                                                <button type="button" className={`super-toggle${c.status === "active" ? " on" : ""}`} onClick={() => toggleStatus(c.id)}>
                                                                    <span></span>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button type="button" className="super-action-icon view" onClick={() => navigate(`/super/clubs/${c.id}/members`)}>Open as Admin</button>
                                                                <button type="button" className="super-action-icon edit" onClick={() => navigate(`/super/clubs/${c.id}/edit`)}><i className="fa-solid fa-pen"></i></button>
                                                                <button type="button" className="super-action-icon delete" onClick={() => handleDelete(c.id)}><i className="fa-solid fa-trash"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="super-club-grid">
                                            {paginated.map((c) => (
                                                <div className="super-club-card" key={c.id}>
                                                    <div className="cover">
                                                        <img src={c.cover} alt={c.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                        <span className={`status-badge${c.status === "active" ? "" : " inactive"}`}>{c.status === "active" ? "Active" : "Inactive"}</span>
                                                    </div>
                                                    <div className="body">
                                                        <h4>
                                                            {c.name}
                                                        </h4>
                                                        <p className="tagline">{c.tagline}</p>
                                                        <div className="meta-row">
                                                            <span><i className="fa-regular fa-user"></i> {c.membersCount} members</span>
                                                            <span><i className="fa-regular fa-calendar"></i> Est.{c.established}</span>
                                                        </div>
                                                        <div className="footer-row">
                                                            <span className="view-link" onClick={() => navigate(`/super/clubs/${c.id}/members`)}>View Details</span>
                                                            <div>
                                                                <button type="button" className="super-action-icon edit" onClick={() => navigate(`/super/clubs/${c.id}/edit`)}><i className="fa-solid fa-pen"></i></button>
                                                                <button type="button" className="super-action-icon delete" onClick={() => handleDelete(c.id)}><i className="fa-solid fa-trash"></i></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {totalPages > 1 && (
                                <div className="super-dt-paging">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button key={i + 1} className={currentPage === i + 1 ? "current" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                    ))}
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>›</button>
                                </div>
                            )}
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

export default SuperClubsList;
