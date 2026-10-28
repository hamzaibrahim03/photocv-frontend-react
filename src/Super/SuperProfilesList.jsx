import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";
import Ima from '../club_admin/assets/icons/member/image.svg';
import Com from '../club_admin/assets/icons/member/comment.svg';
import Lik from '../club_admin/assets/icons/member/like.svg';

function SuperProfilesList() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("Club Members");
    const [clubFilter, setClubFilter] = useState("All Clubs");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [view, setView] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;
    const menuRef = useRef(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadProfiles();
    }, []);

    async function loadProfiles() {
        setIsLoading(true);
        try {
            const response = await apiClient.get("/super/profiles");
            const data = response.data?.data || response.data;
            setProfiles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading profiles:", error);
            setProfiles([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setCategoryOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const clubs = useMemo(() => {
        const seen = new Map();
        profiles.forEach((p) => {
            if (p.clubName && !seen.has(p.clubName)) seen.set(p.clubName, { id: p.clubId, name: p.clubName });
        });
        return Array.from(seen.values());
    }, [profiles]);

    const filtered = useMemo(() => {
        let list = profiles;
        if (categoryFilter !== "All") list = list.filter((p) => p.category === categoryFilter);
        if (clubFilter !== "All Clubs") list = list.filter((p) => p.clubName === clubFilter);
        return list;
    }, [profiles, categoryFilter, clubFilter]);

    const totalPages = Math.max(Math.ceil(filtered.length / rowsPerPage), 1);
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const toggleStatus = async (id) => {
        const current = profiles.find((p) => p.id === id);
        if (!current) return;
        const nextStatus = !current.status;
        setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
        try {
            await apiClient.put(`/super/profiles/${id}`, { status: nextStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: current.status } : p)));
            alert(error?.response?.data?.message || "Unable to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this profile?")) return;
        try {
            await apiClient.delete(`/super/profiles/${id}`);
            setProfiles((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert(error?.response?.data?.message || "Unable to delete profile.");
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profiles" />
                        <div className="content">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <h2 className="name">All Users</h2>
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
                                                <h3 className="number">{profiles.length}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Images</small>
                                                <h3 className="number">{profiles.reduce((sum, p) => sum + (p.photoCount || 0), 0)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div style={{ display: "flex", gap: '10px' }} ref={menuRef}>
                                        <div style={{ position: "relative" }}>
                                            <button type="button" className="super-btn dark" onClick={() => setCategoryOpen((v) => !v)}>
                                                {categoryFilter} <i className="fa-solid fa-chevron-down" style={{ marginLeft: '8px', fontSize: '11px' }}></i>
                                            </button>
                                            {categoryOpen && (
                                                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: '0', background: "#fff", border: "1px solid #eee", borderRadius: '8px', boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: '30', minWidth: '160px' }}>
                                                    {["All", "Club Members", "Photographer"].map((opt) => (
                                                        <button key={opt} type="button" style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", color: "#4c4036" }} onClick={() => { setCategoryFilter(opt); setCategoryOpen(false); setCurrentPage(1); }}>
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <select className="super-btn outline" style={{ appearance: "auto" }} value={clubFilter} onChange={(e) => { setClubFilter(e.target.value); setCurrentPage(1); }}>
                                            <option>All Clubs</option>
                                            {clubs.map((c) => <option key={c.id ?? c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="super-view-toggle">
                                        <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><i className="fa-solid fa-table-cells-large"></i></button>
                                        <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}><i className="fa-solid fa-table"></i></button>
                                        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><i className="fa-solid fa-list"></i></button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    {filtered.length === 0 ? (
                                        <p className="super-empty-note">No profiles match these filters.</p>
                                    ) : view === "grid" ? (
                                        <div className="super-profile-grid">
                                            {paginated.map((p) => (
                                                <div className="super-profile-card" key={p.id} style={{ width: '340px', height: '500px', borderRadius: '10px', border: '1px solid #99816B', padding: '0' }} onClick={() => navigate(`/super/profiles/${p.id}`)}>
                                                    <div className="avatar-wrap">
                                                        <img src={p.avatar} alt={p.name} onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} style={{ width: '192px', height: '192px', borderRadius: '50%' }} />
                                                        <div className="social-media-icons d-flex justify-content-center gap-2 mt-n4 position-relative" style={{ top: '-5px' }}>
                                                            <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '34px', height: '34px' }}><i className="fab fa-facebook-f"></i></a>
                                                            <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#cc445e', color: 'white', width: '34px', height: '34px' }}><i className="fab fa-instagram"></i></a>
                                                            <a href="#" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '34px', height: '34px' }}><i className="fab fa-twitter"></i></a>
                                                        </div>
                                                        <h3 style={{ fontFamily: 'Inter', fontStyle: 'Medium', fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '10px', marginTop: '10px' }}>{p.name}</h3>
                                                        <small className="role" style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '18px' }}>{p.role}</small>
                                                        <div className="social-icons d-flex justify-content-center gap-3 text-white" style={{ backgroundColor: '#d64561' }}>
                                                            <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{p.photoCount || 0}</span><img src={Ima} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                            <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{p.commentsCount || 0}</span><img src={Com} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                            <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{p.likesCount || 0}</span><img src={Lik} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="gallery-preview d-flex">
                                                        <div style={{ cursor: "pointer" }} className="pic-item position-relative">
                                                            <img src={p.galleryThumb || "/placeholder.jpg"} alt="Gallery" onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '170px', height: '123px' }} />
                                                            <div className="pic-info" style={{ fontSize: "12px" }}>
                                                                <span>Gallery</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ cursor: "pointer" }} className="pic-item position-relative">
                                                            <img src={p.portfolioThumb || "/placeholder.jpg"} alt="Portfolio" onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '170px', height: '123px' }} />
                                                            <div className="pic-info" style={{ fontSize: "12px" }}>
                                                                <span>Portfolio</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : view === "table" ? (
                                        <div className="super-panel">
                                            <table className="super-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Name</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Role</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Images</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Website</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Status</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginated.map((p) => (
                                                        <tr key={p.id}>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                {p.name}
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>{p.role}</td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>{p.photoCount || "---"}</td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                {p.website ? (
                                                                    <a href={p.website} target="_blank" rel="noreferrer">Visit <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '11px' }}></i></a>
                                                                ) : "---"}
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                <button type="button" className={`super-toggle${p.status ? " on" : ""}`} onClick={() => toggleStatus(p.id)}>
                                                                    <span></span>
                                                                </button>
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                <button type="button" className="super-action-icon view" onClick={() => navigate(`/super/profiles/${p.id}`)}>View Details</button>
                                                                <button type="button" className="super-action-icon edit" onClick={() => navigate(`/super/profiles/${p.id}/edit`)}><i className="fa-solid fa-pen"></i></button>
                                                                <button type="button" className="super-action-icon delete" onClick={() => handleDelete(p.id)}><i className="fa-solid fa-trash"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="super-panel">
                                            <table className="super-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Name</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Template</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Role</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Established</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Website</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Status</th>
                                                        <th style={{ fontWeight: '600', fontStyle: 'Semi Bold', fontSize: '23.55px', lineHeight: '23.55px', color: '#4C4036' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginated.map((p) => (
                                                        <tr key={p.id}>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                <div className="row-name" style={{ alignItems: "center" }}>
                                                                    <img className="row-avatar" src={p.avatar || "/placeholder.jpg"} alt={p.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '119px', height: '120px', borderRadius: "4px" }} />
                                                                    <div>
                                                                        <div style={{ fontWeight: '600' }}>{p.name}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                {p.templatePreview ? (
                                                                    <img src={p.templatePreview} alt="Template preview" style={{ width: '90px', height: '56px', objectFit: "cover", borderRadius: '4px', border: "1px solid #eee" }} />
                                                                ) : "---"}
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                {p.role}
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>{p.establishedYear || "---"}</td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                {p.website ? (
                                                                    <a href={p.website} target="_blank" rel="noreferrer">Visit <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '11px' }}></i></a>
                                                                ) : "---"}
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                <button type="button" className={`super-toggle${p.status ? " on" : ""}`} onClick={() => toggleStatus(p.id)}>
                                                                    <span></span>
                                                                </button>
                                                            </td>
                                                            <td style={{ fontWeight: '400', fontStyle: 'Regular', fontSize: '20px', lineHeight: '23.55px', color: '#4C4036' }}>
                                                                <button type="button" className="super-action-icon view" onClick={() => navigate(`/super/profiles/${p.id}`)}>View Details</button>
                                                                <button type="button" className="super-action-icon edit" onClick={() => navigate(`/super/profiles/${p.id}/edit`)}><i className="fa-solid fa-pen"></i></button>
                                                                <button type="button" className="super-action-icon delete" onClick={() => handleDelete(p.id)}><i className="fa-solid fa-trash"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {totalPages > 1 && (
                                        <div className="super-dt-paging">
                                            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <button key={i + 1} className={currentPage === i + 1 ? "current" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                            ))}
                                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>›</button>
                                        </div>
                                    )}
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
                )
                }
            </div>
        </>
    );
}

export default SuperProfilesList;
