import React, { useState } from "react";
import "./Step1.css";
function Step3Events() {
    const [eventTypes, setEventTypes] = useState([]);
    const [eventTags, setEventTags] = useState([]);
    const [eventName, setEventName] = useState("");
    const [eventIcon, setEventIcon] = useState(null);
    const [eventOpen, setEventOpen] = useState(true);
    const handleAddEvent = () => {
        if (!eventName.trim()) return;
        const newEvent = {
            id: Date.now(),
            name: eventName,
            icon: eventIcon,
        };
        setEventTypes((prev) => [...prev, newEvent]);
        setEventTags((prev) => [...prev, newEvent]);
        setEventName("");
        setEventIcon(null);
    };
    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            eventTypes,
        };
        console.log("General Configuration:", data);
        alert("Configuration saved successfully!");
    };
    return (
        <div className="general-config-container">
            <form onSubmit={handleSave}>
                <h5 className="general-config-title">
                    Event Configurations
                </h5>
                <div className="config-section">
                    <div className="config-section-header" onClick={() => setEventOpen(!eventOpen)}>
                        <span>Event Tags</span>
                        <span className={`arrow ${eventOpen ? "rotate" : ""}`}>
                            <i class="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {eventOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General Event" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setEventIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddEvent}>
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                            {eventTags.length > 0 && (
                                <div className="added-items">
                                    {eventTags.map((event) => (
                                        <div className="added-item" key={event.id}>
                                            {event.icon && (
                                                <img src={URL.createObjectURL(event.icon)} alt="" className="added-item-icon" />
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
                    <div className="config-section-header" onClick={() => setEventOpen(!eventOpen)}>
                        <span>Event Types</span>
                        <span className={`arrow ${eventOpen ? "rotate" : ""}`}>
                            <i class="fa-solid fa-chevron-down"></i>
                        </span>
                    </div>
                    {eventOpen && (
                        <div className="config-section-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control custom-input" placeholder="General Event" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label>Upload Icon</label>
                                    <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setEventIcon(e.target.files[0] || null)} />
                                </div>
                            </div>
                            <button type="button" className="add-btn" id="e-view" onClick={handleAddEvent}>
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                            {eventTypes.length > 0 && (
                                <div className="added-items">
                                    {eventTypes.map((event) => (
                                        <div className="added-item" key={event.id}>
                                            {event.icon && (
                                                <img src={URL.createObjectURL(event.icon)} alt="" className="added-item-icon" />
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
export default Step3Events;