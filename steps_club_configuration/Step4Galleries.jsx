import React, { useState } from "react";
import "./Step1.css";
function Step4Galleries() {
    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            galleries,
        };
        console.log("General Configuration:", data);
        alert("Configuration saved successfully!");
    };
    return (
        <div className="general-config-container">
            <form onSubmit={handleSave}>
                <h5 className="general-config-title">
                    Gallery Configurations
                </h5>
                <div className="seasons-section">
                    <h6 className="head">
                        Max Images Per Gallery
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value</label>
                                <input type="text" className="form-control custom-input" placeholder="0.0" />
                            </div>
                            <div className="col-md-6">
                                <label>Upload Icon</label>
                                <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setNoticeIcon(e.target.files[0] || null)} />
                            </div>
                        </div>
                    </div>
                    <h6 className="head">
                        Max Image File Size
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value</label>
                                <input type="text" className="form-control custom-input" placeholder="0.0" />
                            </div>
                            <div className="col-md-6">
                                <label>Upload Icon</label>
                                <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setNoticeIcon(e.target.files[0] || null)} />
                            </div>
                        </div>
                    </div>
                    <h6 className="head">
                        Max Image Width
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value</label>
                                <input type="text" className="form-control custom-input" placeholder="0.0" />
                            </div>
                            <div className="col-md-6">
                                <label>Upload Icon</label>
                                <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setNoticeIcon(e.target.files[0] || null)} />
                            </div>
                        </div>
                    </div>
                    <h6 className="head">
                        Max Image Height
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value</label>
                                <input type="text" className="form-control custom-input" placeholder="0.0" />
                            </div>
                            <div className="col-md-6">
                                <label>Upload Icon</label>
                                <input type="file" className="form-control custom-file" accept="image/*" onChange={(e) => setNoticeIcon(e.target.files[0] || null)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-buttons">
                    <button type="button" className="cancel-main-btn" id="e-view">
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
export default Step4Galleries;