import React, { useState, useEffect } from "react";
import "./Step1.css";
import apiClient from "../src/api/axios";
function Step2News() {
    const [newsTypes, setNewsTypes] = useState([]);
    const [newsName, setNewsName] = useState("");
    const [newsIcon, setNewsIcon] = useState(null);
    const [newsOpen, setNewsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        loadConfiguration();
    }, []);
    const loadConfiguration = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/club-configuration-news');
            const data = response.data?.data || response.data;
            if (data) {
                setNewsTypes(Array.isArray(data.newsTypes) ? data.newsTypes : []);
            }
        } catch (error) {
            console.error('Error loading news configuration:', error);
        } finally {
            setIsLoading(false);
        }
    };
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
    const resetForm = () => {
        setNewsName("");
        setNewsIcon(null);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            const data = { newsTypes };
            await apiClient.post('/club-configuration-news', data);
            alert("Configuration saved successfully!");
        } catch (error) {
            console.error('Error saving news configuration:', error);
            alert(error.response?.data?.message || 'Unable to save configuration.');
        } finally {
            setIsSaving(false);
        }
    };
    if (isLoading) {
        return <div className="general-config-container">Loading...</div>;
    }
    return (
        <div className="general-config-container">
            <form onSubmit={handleSave}>
                <h5 className="head role">
                    News Configurations
                </h5>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setNewsOpen(!newsOpen)}>
                        <span>News Types</span>
                        <span className={`arrow ${newsOpen ? "rotate" : ""}`}>
                            <i className="fa-solid fa-chevron-down"></i>
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
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                            {newsTypes.length > 0 && (
                                <div className="added-items">
                                    {newsTypes.map((news) => (
                                        <div className="added-item" key={news.id}>
                                            {news.icon && (
                                                <img src={news.icon instanceof File ? URL.createObjectURL(news.icon) : news.icon} alt="" className="added-item-icon" />
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
                    <button type="button" className="cancel-main-btn" id="e-view" onClick={resetForm}>
                        Cancel
                    </button>
                    <button type="submit" className="save-main-btn" id="e-edit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Step2News;
