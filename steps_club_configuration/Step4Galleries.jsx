import React, { useState, useEffect } from "react";
import "./Step1.css";
import apiClient from "../src/api/axios";
const initialFormData = {
    max_images_per_gallery: '',
    max_image_file_size: '',
    max_image_width: '',
    max_image_height: '',
};
function Step4Galleries() {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        loadConfiguration();
    }, []);
    const loadConfiguration = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/club-configuration-galleries');
            const data = response.data?.data || response.data;
            if (data) {
                setFormData((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error loading gallery configuration:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            await apiClient.post('/club-configuration-galleries', formData);
            alert("Configuration saved successfully!");
        } catch (error) {
            console.error('Error saving gallery configuration:', error);
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
                                <input type="number" name="max_images_per_gallery" className="form-control custom-input" placeholder="0" value={formData.max_images_per_gallery} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <h6 className="head">
                        Max Image File Size
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value (MB)</label>
                                <input type="number" name="max_image_file_size" className="form-control custom-input" placeholder="0.0" value={formData.max_image_file_size} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <h6 className="head">
                        Max Image Width
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value (px)</label>
                                <input type="number" name="max_image_width" className="form-control custom-input" placeholder="0" value={formData.max_image_width} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <h6 className="head">
                        Max Image Height
                    </h6>
                    <div className="season-form">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter Value (px)</label>
                                <input type="number" name="max_image_height" className="form-control custom-input" placeholder="0" value={formData.max_image_height} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-buttons">
                    <button type="button" className="cancel-main-btn" id="e-view" onClick={loadConfiguration}>
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
export default Step4Galleries;
