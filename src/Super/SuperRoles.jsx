import { useEffect, useState } from "react";
import NavigationRoute from "../club_admin/NavigationRoute";
import "./assets/css/superstyle.css";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

const PERMISSION_OPTIONS = ["All", "Events", "Competitions", "Members", "Settings", "Send Notifications", "Subscriptions"];

function SuperRoles() {
    const [roles, setRoles] = useState([]);
    const [clubCount, setClubCount] = useState(0);
    const [totalMembers, setTotalMembers] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", permissions: "" });
    const [editingRole, setEditingRole] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", permissions: "" });

    useEffect(() => {
        setIsLoading(true);
        Promise.all([loadRoles(), loadClubStats()]).finally(() => setIsLoading(false));
    }, []);

    async function loadRoles() {
        try {
            const response = await apiClient.get("/super/roles");
            const data = response.data?.data || response.data;
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading roles:", error);
            setRoles([]);
        }
    }

    async function loadClubStats() {
        try {
            const response = await apiClient.get("/super/clubs");
            const data = response.data?.data || response.data;
            const clubs = Array.isArray(data) ? data : [];
            setClubCount(clubs.length);
            setTotalMembers(clubs.reduce((sum, c) => sum + (c.membersCount || 0), 0));
        } catch (error) {
            console.error("Error loading clubs:", error);
            setClubCount(0);
            setTotalMembers(0);
        }
    }

    const toggleStatus = async (id) => {
        try {
            const response = await apiClient.post(`/super/roles/${id}/toggle-status`);
            const updatedRole = response.data?.data || response.data;
            setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedRole } : r)));
        } catch (error) {
            if (error.response?.status === 422) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong while updating the role status.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this role?")) return;
        try {
            await apiClient.delete(`/super/roles/${id}`);
            setRoles((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            if (error.response?.status === 422) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong while deleting the role.");
            }
        }
    };

    const handleEditOpen = (role) => {
        setEditingRole(role);
        setEditForm({
            name: role.name || "",
            description: role.description || "",
            permissions: role.permissions === "None" ? "" : (role.permissions || ""),
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editForm.name.trim()) {
            alert("Role name is required.");
            return;
        }
        try {
            const response = await apiClient.put(`/super/roles/${editingRole.id}`, {
                name: editForm.name,
                description: editForm.description,
                permission_label: editForm.permissions,
            });
            const updatedRole = response.data?.data || response.data;
            setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, ...updatedRole } : r)));
            setEditingRole(null);
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong while updating the role.");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Role name is required.");
            return;
        }
        try {
            const response = await apiClient.post("/super/roles", {
                name: form.name,
                description: form.description,
                permission_label: form.permissions,
            });
            const newRole = response.data?.data || response.data;
            setRoles((prev) => [...prev, newRole]);
            setForm({ name: "", description: "", permissions: "" });
            setModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong while creating the role.");
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Role" />
                        <div className="content">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    {(() => {
                                                        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                                                        return (
                                                            <div className="d-flex gap-4">
                                                                <i className="fa-regular fa-circle-user" style={{ fontSize: '54px', color: "#e5ded7" }}></i>
                                                                <h2>{storedUser.first_name || "Admin"} {storedUser.last_name || ""}</h2>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Total Clubs</small>
                                                <h3 className="number">{clubCount}</h3>
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
                                    <div style={{
                                        display: "flex", justifyContent: "flex-end", marginBottom: '16px' }}>
                                            <button type = "button" className = "super-btn dark" onClick = { () => setModalOpen(true) }>Add New Role</button>
                        </div>
                    </div>
            </section>

            <section>
                <div className="container" style={{ maxWidth: '1820px' }}>
                    <div className="super-panel">
                        <table className="super-table">
                            <thead>
                                <tr>
                                    <th>Role Name</th>
                                    <th>Description</th>
                                    <th>Assigned In (Clubs)</th>
                                    <th>Permissions</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.length === 0 ? (
                                    <tr><td colSpan={6}>No roles found.</td></tr>
                                ) : roles.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.name}</td>
                                        <td>{r.description}</td>
                                        <td>{r.assignedClubs}</td>
                                        <td>{r.permissions}</td>
                                        <td>
                                            <button type="button" className={`super-toggle${r.status ? " on" : ""}`} onClick={() => toggleStatus(r.id)}>
                                                <span></span>
                                            </button>
                                        </td>
                                        <td>
                                            <button type="button" className="super-action-icon edit" onClick={() => handleEditOpen(r)}><i className="fa-solid fa-pen"></i></button>
                                            <button type="button" className="super-action-icon delete" onClick={() => handleDelete(r.id)}><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section>
                <div className="container" style={{ maxWidth: '1820px' }}>
                    {modalOpen && (
                        <div className="super-modal-overlay" onClick={() => setModalOpen(false)}>
                            <div className="super-modal" onClick={(e) => e.stopPropagation()}>
                                <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>×</button>
                                <h2>Create New Role</h2>
                                <form onSubmit={handleCreate}>
                                    <div className="super-form-group" style={{ marginBottom: '20px' }}>
                                        <label>Role Name</label>
                                        <input type="text" placeholder="Text here..." value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div className="super-form-group" style={{ marginBottom: '20px' }}>
                                        <label>Description</label>
                                        <textarea rows={4} placeholder="Text here..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}></textarea>
                                    </div>
                                    <div className="super-form-group" style={{ marginBottom: '26px' }}>
                                        <label>Permissions</label>
                                        <select value={form.permissions} onChange={(e) => setForm((p) => ({ ...p, permissions: e.target.value }))}>
                                            <option value="">- Select -</option>
                                            {PERMISSION_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <button type="submit" className="btn" id="edit">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {editingRole && (
                        <div className="super-modal-overlay" onClick={() => setEditingRole(null)}>
                            <div className="super-modal" onClick={(e) => e.stopPropagation()}>
                                <button type="button" className="close-btn" onClick={() => setEditingRole(null)}>×</button>
                                <h2>Edit Role</h2>
                                <form onSubmit={handleUpdate}>
                                    <div className="super-form-group" style={{ marginBottom: '20px' }}>
                                        <label>Role Name</label>
                                        <input type="text" placeholder="Text here..." value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div className="super-form-group" style={{ marginBottom: '20px' }}>
                                        <label>Description</label>
                                        <textarea rows={4} placeholder="Text here..." value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}></textarea>
                                    </div>
                                    <div className="super-form-group" style={{ marginBottom: '26px' }}>
                                        <label>Permissions</label>
                                        <select value={editForm.permissions} onChange={(e) => setEditForm((p) => ({ ...p, permissions: e.target.value }))}>
                                            <option value="">- Select -</option>
                                            {PERMISSION_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <button type="submit" className="btn" id="edit">Save</button>
                                    </div>
                                </form>
                            </div>
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
        </div >
                    </>
                )
}
            </div >
        </>
    );
}

export default SuperRoles;
