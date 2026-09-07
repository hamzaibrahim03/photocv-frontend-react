import React, { useState } from "react";
import "./Step1.css";
function Step1GeneralConfiguration() {
    const [noticeTypes, setNoticeTypes] = useState([]);
    const [noticeName, setNoticeName] = useState("");
    const [noticeIcon, setNoticeIcon] = useState(null);
    const [noticeOpen, setNoticeOpen] = useState(true);
    const [pageTypes, setPageTypes] = useState([]);
    const [pageName, setPageName] = useState("");
    const [pageIcon, setPageIcon] = useState(null);
    const [pageOpen, setPageOpen] = useState(true);
    const [seasons, setSeasons] = useState([
        {
            id: 1,
            name: "2025-2026 Season",
            status: true,
            startDate: "2023-06-01",
            endDate: "2024-06-01",
        },
        {
            id: 2,
            name: "2024-2025 Season",
            status: false,
            startDate: "2023-06-01",
            endDate: "2024-06-01",
        },
        {
            id: 3,
            name: "2024-2025 Season",
            status: false,
            startDate: "2023-06-01",
            endDate: "2024-06-01",
        },
    ]);
    const [seasonName, setSeasonName] = useState("");
    const [seasonStatus, setSeasonStatus] = useState("enable");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editingSeasonId, setEditingSeasonId] = useState(null);
    const handleAddNotice = () => {
        if (!noticeName.trim()) return;
        const newNotice = {
            id: Date.now(),
            name: noticeName,
            icon: noticeIcon,
        };
        setNoticeTypes((prev) => [...prev, newNotice]);
        setNoticeName("");
        setNoticeIcon(null);
    };
    const handleAddPage = () => {
        if (!pageName.trim()) return;
        const newPage = {
            id: Date.now(),
            name: pageName,
            icon: pageIcon,
        };
        setPageTypes((prev) => [...prev, newPage]);
        setPageName("");
        setPageIcon(null);
    };
    const handleAddSeason = () => {
        if (!seasonName.trim() || !startDate || !endDate) {
            alert("Please fill all season fields.");
            return;
        }
        if (editingSeasonId) {
            setSeasons((prev) =>
                prev.map((season) =>
                    season.id === editingSeasonId
                        ? {
                            ...season,
                            name: seasonName,
                            status: seasonStatus === "enable",
                            startDate,
                            endDate,
                        }
                        : season
                )
            );
            setEditingSeasonId(null);
        } else {
            const newSeason = {
                id: Date.now(),
                name: seasonName,
                status: seasonStatus === "enable",
                startDate,
                endDate,
            };
            setSeasons((prev) => [...prev, newSeason]);
        }
        resetSeasonForm();
    };
    const handleEditSeason = (season) => {
        setEditingSeasonId(season.id);
        setSeasonName(season.name);
        setSeasonStatus(season.status ? "enable" : "disable");
        setStartDate(season.startDate);
        setEndDate(season.endDate);
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };
    const handleDeleteSeason = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this season?"
        );
        if (!confirmDelete) return;
        setSeasons((prev) => prev.filter((season) => season.id !== id));
        if (editingSeasonId === id) {
            resetSeasonForm();
        }
    };
    const resetSeasonForm = () => {
        setSeasonName("");
        setSeasonStatus("enable");
        setStartDate("");
        setEndDate("");
        setEditingSeasonId(null);
    };
    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            noticeTypes,
            pageTypes,
            seasons,
        };
        console.log("General Configuration:", data);
        alert("Configuration saved successfully!");
    };
    return (
        <div className="general-config-container">
            <form onSubmit={handleSave}>
                <h5 className="general-config-title">
                    General Configurations
                </h5>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setNoticeOpen(!noticeOpen)}>
                        <span>Notice Types</span>
                        <span className={`arrow ${noticeOpen ? "rotate" : ""}`}>
                            <i class="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {noticeOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General Notice" value={noticeName} onChange={(e) => setNoticeName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setNoticeIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddNotice}>
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                            {noticeTypes.length > 0 && (
                                <div className="added-items">
                                    {noticeTypes.map((notice) => (
                                        <div className="added-item" key={notice.id}>
                                            {notice.icon && (
                                                <img src={URL.createObjectURL(notice.icon)} alt="" />
                                            )}
                                            <span>{notice.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setPageOpen(!pageOpen)}>
                        <span>Page Types</span>
                        <span className={`arrow ${pageOpen ? "rotate" : ""}`}>
                            <i class="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {pageOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General Pages" value={pageName} onChange={(e) => setPageName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setPageIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddPage}>
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                            {pageTypes.length > 0 && (
                                <div className="added-items">
                                    {pageTypes.map((page) => (
                                        <div className="added-item" key={page.id}>
                                            {page.icon && (
                                                <img src={URL.createObjectURL(page.icon)} alt="" />
                                            )}
                                            <span>{page.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="seasons-section">
                    <h6 className="section-title">
                        Seasons
                    </h6>
                    <div className="seasons-list">
                        {seasons.map((season) => (
                            <div className="season-card" key={season.id}>
                                <div className="season-column">
                                    <span className="column-label">
                                        Season Name
                                    </span>
                                    <span className="column-value">
                                        {season.name}
                                    </span>
                                </div>
                                <div className="season-column">
                                    <span className="column-label">
                                        Status
                                    </span>
                                    <span className={`status-badge ${season.status ? "enabled" : "disabled"}`}>
                                        {season.status ? "Enable" : "Disable"}
                                    </span>
                                </div>
                                <div className="season-column">
                                    <span className="column-label">
                                        Start Date
                                    </span>
                                    <span className="column-value">
                                        {formatDate(season.startDate)}
                                    </span>
                                </div>
                                <div className="season-column">
                                    <span className="column-label">
                                        End Date
                                    </span>
                                    <span className="column-value">
                                        {formatDate(season.endDate)}
                                    </span>
                                </div>
                                <div className="season-actions">
                                    <button type="button" className="icon-btn" onClick={() => handleEditSeason(season)} title="Edit">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button type="button" className="icon-btn" onClick={() => handleDeleteSeason(season.id)} title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-md-6">
                                <label>Season Name</label>
                                <input type="text" className="form-control custom-input" placeholder="2024-2025 Season" value={seasonName} onChange={(e) => setSeasonName(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label>Status</label>
                                <div className="row mb-3">
                                    {[
                                        'Enable',
                                        'Disable'
                                    ].map(status => (
                                        <div className="col-md-6 mb-2" key={status}>
                                            <div className="premium-radio">
                                                <input type="radio" id={`status-${status}`} name="seasonStatus" value={status} />
                                                <label htmlFor={`status-${status}`}>
                                                    <div className="premium-radio-circle"></div>
                                                    <div className="premium-radio-content">
                                                        <div className="premium-radio-title">
                                                            {status}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label>Start Date</label>
                                <div className="date-wrapper">
                                    <input type="date" className="form-control custom-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label>End Date</label>
                                <div className="date-wrapper">
                                    <input type="date" className="form-control custom-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <button type="button" className="add-btn" id="e-edit" onClick={handleAddSeason}>
                            <i class="fa-solid fa-plus"></i>
                            {editingSeasonId ? " Update" : " Add"}
                        </button>
                        {editingSeasonId && (
                            <button type="button" className="cancel-edit-btn" id="e-view" onClick={resetSeasonForm}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>
                <div className="bottom-buttons">
                    <button type="button" className="cancel-main-btn" id="e-view" onClick={() => { resetSeasonForm(); }}>
                        Cancel
                    </button>
                    <button type="submit" className="save-main-btn" id="e-edit">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
function formatDate(date) {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}
export default Step1GeneralConfiguration;