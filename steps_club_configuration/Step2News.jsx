import React, { useState } from "react";
import "./Step1.css";
function Step2News() {
    const [newsTypes, setNewsTypes] = useState([]);
    const [newsName, setNewsName] = useState("");
    const [newsIcon, setNewsIcon] = useState(null);
    const [newsOpen, setNewsOpen] = useState(true);
    const handleAddNews = () => {
        if (!newsName.trim()) return;
        const newNews = {
            id: Date.now(),
            name: newsName,
            icon: newsIcon,
        };
        setNewsTypes((prev) => [...prev, newNews]);
        setNewsName("");
        setNewsIcon(null);
    };
    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            newsTypes,
        };
        console.log("General Configuration:", data);
        alert("Configuration saved successfully!");
    };
    return (
        <div className="general-config-container">
            <form onSubmit={handleSave}>
                <h5 className="general-config-title">
                    News Configurations
                </h5>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setNewsOpen(!newsOpen)}>
                        <span>News Types</span>
                        <span className={`arrow ${newsOpen ? "rotate" : ""}`}>
                            <i class="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {newsOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General News" value={newsName} onChange={(e) => setNewsName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setNewsIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddNews}>
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                            {newsTypes.length > 0 && (
                                <div className="added-items">
                                    {newsTypes.map((news) => (
                                        <div className="added-item" key={news.id}>
                                            {news.icon && (
                                                <img src={URL.createObjectURL(news.icon)} alt="" className="added-item-icon" />
                                            )}
                                            <span className="added-item-name">{news.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
export default Step2News;