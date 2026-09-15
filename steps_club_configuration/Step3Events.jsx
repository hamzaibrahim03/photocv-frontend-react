import React, { useState, useEffect } from "react";
import "./Step1.css";
import apiClient from "../src/api/axios";
function Step3Events() {
    const [eventTypes, setEventTypes] = useState([]);
    const [eventTypeName, setEventTypeName] = useState("");
    const [eventTypeIcon, setEventTypeIcon] = useState(null);
    const [eventTypesOpen, setEventTypesOpen] = useState(true);
    const [eventTags, setEventTags] = useState([]);
    const [eventTagName, setEventTagName] = useState("");
    const [eventTagIcon, setEventTagIcon] = useState(null);
    const [eventTagsOpen, setEventTagsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        loadConfiguration();
    }, []);
    const loadConfiguration = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/club-configuration-events');
            const data = response.data?.data || response.data;
            if (data) {
                setEventTypes(Array.isArray(data.eventTypes) ? data.eventTypes : []);
                setEventTags(Array.isArray(data.eventTags) ? data.eventTags : []);
            }
        } catch (error) {
            console.error('Error loading event configuration:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddEventTag = () => {
        if (!eventTagName.trim()) return;
        setEventTags((prev) => [...prev, { id: Date.now(), name: eventTagName, icon: eventTagIcon }]);
        setEventTagName("");
        setEventTagIcon(null);
    };
    const handleAddEventType = () => {
        if (!eventTypeName.trim()) return;
        setEventTypes((prev) => [...prev, { id: Date.now(), name: eventTypeName, icon: eventTypeIcon }]);
        setEventTypeName("");
        setEventTypeIcon(null);
    };
    const resetForm = () => {
        setEventTagName("");
        setEventTagIcon(null);
        setEventTypeName("");
        setEventTypeIcon(null);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            const data = { eventTypes, eventTags };
            await apiClient.post('/club-configuration-events', data);
            alert("Configuration saved successfully!");
        } catch (error) {
            console.error('Error saving event configuration:', error);
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
                    Event Configurations
                </h5>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setEventTagsOpen(!eventTagsOpen)}>
                        <span>Event Tags</span>
                        <span className={`arrow ${eventTagsOpen ? "rotate" : ""}`}>
                            <i className="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {eventTagsOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General Event" value={eventTagName} onChange={(e) => setEventTagName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setEventTagIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddEventTag}>
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                            {eventTags.length > 0 && (
                                <div className="added-items">
                                    {eventTags.map((event) => (
                                        <div className="added-item" key={event.id}>
                                            {event.icon && (
                                                <img src={event.icon instanceof File ? URL.createObjectURL(event.icon) : event.icon} alt="" className="added-item-icon" />
                                            )}
                                            <span className="added-item-name">{event.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setEventTypesOpen(!eventTypesOpen)}>
                        <span>Event Types</span>
                        <span className={`arrow ${eventTypesOpen ? "rotate" : ""}`}>
                            <i className="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {eventTypesOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General Event" value={eventTypeName} onChange={(e) => setEventTypeName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setEventTypeIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddEventType}>
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                            {eventTypes.length > 0 && (
                                <div className="added-items">
                                    {eventTypes.map((event) => (
                                        <div className="added-item" key={event.id}>
                                            {event.icon && (
                                                <img src={event.icon instanceof File ? URL.createObjectURL(event.icon) : event.icon} alt="" className="added-item-icon" />
                                            )}
                                            <span className="added-item-name">{event.name}</span>
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
export default Step3Events;
