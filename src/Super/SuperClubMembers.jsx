import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import "./assets/css/superstyle.css";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

function SuperClubMembers() {
    const navigate = useNavigate();
    const { clubId } = useParams();
    const [clubs, setClubs] = useState([]);
    const [club, setClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState("table");
    const menuRef = useRef(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchClubsSummary();
        fetchClubAndMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clubId]);

    const fetchClubsSummary = async () => {
        try {
            const response = await apiClient.get("/super/clubs");
            const data = response.data?.data || response.data;
            setClubs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading clubs summary:", error);
        }
    };

    const fetchClubAndMembers = async () => {
        try {
            setIsLoading(true);
            const [clubResponse, membersResponse] = await Promise.all([
                apiClient.get(`/super/clubs/${clubId}`),
                apiClient.get(`/super/clubs/${clubId}/members`),
            ]);
            const clubData = clubResponse.data?.data || clubResponse.data;
            const membersData = membersResponse.data?.data || membersResponse.data;
            setClub(clubData || null);
            setMembers(Array.isArray(membersData) ? membersData : []);
        } catch (error) {
            console.error("Error loading club members:", error);
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleStatus = async (id) => {
        const current = members.find((m) => m.id === id);
        if (!current) return;
        const nextStatus = !current.status;
        setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)));
        try {
            await apiClient.put(`/super/profiles/${id}`, { status: nextStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: current.status } : m)));
            alert(error?.response?.data?.message || "Unable to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this member?")) return;
        try {
            await apiClient.delete(`/super/profiles/${id}`);
            setMembers((prev) => prev.filter((m) => m.id !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
            alert(error?.response?.data?.message || "Unable to delete member.");
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Clubs" />
                        <div className="content">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card" style={{ width: "152%" }}>
                                            <div className="profile-left">
                                                <div className="profile-info" ref={menuRef} style={{position: 'relative'}}>
                                                    <h2 className="name" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setDropdownOpen((v) => !v)}>
                                                        {club?.name} <i className="fa-solid fa-chevron-down" style={{ fontSize: 13 }}></i>
                                                    </h2>
                                                    {dropdownOpen && (
                                                        <div style={{ position: "absolute", top: "100%", left: 0, background: "#fff", border: "1px solid #eee", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 30, minWidth: 220 }}>
                                                            {clubs.map((c) => (
                                                                <button
                                                                    key={c.id}
                                                                    type="button"
                                                                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", color: "#4c4036" }}
                                                                    onClick={() => { navigate(`/super/clubs/${c.id}/members`); setDropdownOpen(false); }}
                                                                >
                                                                    {c.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="stat-card">Total Clubs</small>
                                                <h3 className="number">{clubs.length}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Total Members</small>
                                                <h3 className="number">{clubs.reduce((s, c) => s + (c.membersCount || 0), 0)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="super-view-toggle" style={{ marginBottom: 14 }}>
                                        <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><i className="fa-solid fa-table-cells-large"></i></button>
                                        <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}><i className="fa-solid fa-table"></i></button>
                                        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><i className="fa-solid fa-list"></i></button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    {view === "list" ? (
                                        <div className="super-panel">
                                            <table className="super-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Template</th>
                                                        <th>Role</th>
                                                        <th>Established</th>
                                                        <th>Website</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {members.map((m) => (
                                                        <tr key={m.id}>
                                                            <td>
                                                                <div className="row-name">
                                                                    <img className="row-avatar" src={m.avatar || "/placeholder.jpg"} alt={m.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    {m.name}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {m.templatePreview ? (
                                                                    <img src={m.templatePreview} alt="Template preview" style={{ width: 90, height: 56, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }} />
                                                                ) : (
                                                                    <span>---</span>
                                                                )}
                                                            </td>
                                                            <td>{m.role}</td>
                                                            <td>{m.establishedYear || "---"}</td>
                                                            <td>{m.website ? <a href={m.website} target="_blank" rel="noreferrer">Visit <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 11 }}></i></a> : "---"}</td>
                                                            <td>
                                                                <button type="button" className={`super-toggle${m.status ? " on" : ""}`} onClick={() => toggleStatus(m.id)}>
                                                                    <span></span>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button type="button" className="super-action-icon view" onClick={() => navigate(`/super/profiles/${m.id}`)}>View Details</button>
                                                                <button type="button" className="super-action-icon edit" onClick={() => navigate(`/super/profiles/${m.id}/edit`)}><i className="fa-solid fa-pen"></i></button>
                                                                <button type="button" className="super-action-icon delete" onClick={() => handleDelete(m.id)}><i className="fa-solid fa-trash"></i></button>
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
                                                        <th>Name</th>
                                                        <th>Role</th>
                                                        <th>Images</th>
                                                        <th>Website</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {members.map((m) => (
                                                        <tr key={m.id}>
                                                            <td>
                                                                <div className="row-name">
                                                                    <img className="row-avatar" src={m.avatar || "/placeholder.jpg"} alt={m.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    {m.name}
                                                                </div>
                                                            </td>
                                                            <td>{m.role}</td>
                                                            <td>{m.images}</td>
                                                            <td>{m.website ? <a href={m.website} target="_blank" rel="noreferrer">Visit <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 11 }}></i></a> : "---"}</td>
                                                            <td>
                                                                <button type="button" className={`super-toggle${m.status ? " on" : ""}`} onClick={() => toggleStatus(m.id)}>
                                                                    <span></span>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button type="button" className="super-action-icon view" onClick={() => navigate(`/super/profiles/${m.id}`)}>View Details</button>
                                                                <button type="button" className="super-action-icon edit" onClick={() => navigate(`/super/profiles/${m.id}/edit`)}><i className="fa-solid fa-pen"></i></button>
                                                                <button type="button" className="super-action-icon delete" onClick={() => handleDelete(m.id)}><i className="fa-solid fa-trash"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default SuperClubMembers;
