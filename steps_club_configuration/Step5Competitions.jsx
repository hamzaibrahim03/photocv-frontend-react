import React, { useState } from "react";
import "./Step1.css";
function Step5Competitions() {
    const [sections, setSections] = useState({
        types: {
            title: "Competition Types",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
        themes: {
            title: "Competition Themes",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
        categories: {
            title: "Competition Categories",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
        votingMethods: {
            title: "Competition Voting Methods",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
        deliveryMethods: {
            title: "Competition Entries Delivery Methods",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
        resultMethods: {
            title: "Competition Result Methods",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
        judgingTypes: {
            title: "Judging Types",
            items: [],
            name: "",
            icon: null,
            open: true,
        },
    });
    // Change input value for one section only
    const handleNameChange = (sectionKey, value) => {
        setSections((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                name: value,
            },
        }));
    };
    // Change icon for one section only
    const handleIconChange = (sectionKey, file) => {
        setSections((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                icon: file,
            },
        }));
    };
    // Open/close only clicked accordion
    const toggleSection = (sectionKey) => {
        setSections((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                open: !prev[sectionKey].open,
            },
        }));
    };
    // Add item only to selected section
    const handleAdd = (sectionKey) => {
        const section = sections[sectionKey];
        if (!section.name.trim()) {
            alert("Please enter a name.");
            return;
        }
        const newItem = {
            id: `${sectionKey}-${Date.now()}`,
            name: section.name.trim(),
            icon: section.icon,
        };
        setSections((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: [...prev[sectionKey].items, newItem],
                name: "",
                icon: null,
            },
        }));
    };
    // Delete added item
    const handleDelete = (sectionKey, itemId) => {
        setSections((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: prev[sectionKey].items.filter(
                    (item) => item.id !== itemId
                ),
            },
        }));
    };
    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            competition_types: sections.types.items,
            competition_themes: sections.themes.items,
            competition_categories: sections.categories.items,
            competition_voting_methods: sections.votingMethods.items,
            competition_entry_delivery_methods:
                sections.deliveryMethods.items,
            competition_result_methods: sections.resultMethods.items,
            judging_types: sections.judgingTypes.items,
        };
        console.log("Competition Configuration:", data);
        alert("Competition configuration saved successfully!");
    };
    const handleCancel = () => {
        setSections((prev) => {
            const resetSections = {};
            Object.keys(prev).forEach((key) => {
                resetSections[key] = {
                    ...prev[key],
                    name: "",
                    icon: null,
                };
            });
            return resetSections;
        });
    };
    return (
        <div className="general-config-container">
            <form onSubmit={handleSave}>
                <h5 className="general-config-title">
                    Competitions Configurations
                </h5>
                {Object.entries(sections).map(([sectionKey, section]) => (
                    <div className="config-section" key={sectionKey}>
                        {/* Header */}
                        <div
                            className="config-section-header"
                            onClick={() => toggleSection(sectionKey)}
                        >
                            <span>{section.title}</span>
                            <span
                                className={`arrow ${section.open ? "rotate" : ""
                                    }`}
                            >
                                <i className="fa-solid fa-chevron-down"></i>
                            </span>
                        </div>
                        {/* Body */}
                        {section.open && (
                            <div className="config-section-body">
                                <div className="row">
                                    {/* Name */}
                                    <div className="col-md-6">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control custom-input"
                                            placeholder={`Enter ${section.title}`}
                                            value={section.name}
                                            onChange={(e) =>
                                                handleNameChange(
                                                    sectionKey,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {/* Icon */}
                                    <div className="col-md-6">
                                        <label>Upload Icon</label>
                                        <input
                                            type="file"
                                            className="form-control custom-file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleIconChange(
                                                    sectionKey,
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {/* Add */}
                                <button
                                    type="button"
                                    className="add-btn"
                                    id="e-view"
                                    onClick={() => handleAdd(sectionKey)}
                                >
                                    <i className="fa-solid fa-plus"></i>{" "}
                                    Add
                                </button>
                                {/* Added Items */}
                                {section.items.length > 0 && (
                                    <div className="added-items">
                                        {section.items.map((item) => (
                                            <div
                                                className="added-item"
                                                key={item.id}
                                            >
                                                <div className="added-item-info">
                                                    {item.icon && (
                                                        <img
                                                            src={URL.createObjectURL(
                                                                item.icon
                                                            )}
                                                            alt={item.name}
                                                            className="added-item-icon"
                                                        />
                                                    )}
                                                    <span>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="delete-item-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            sectionKey,
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <div className="bottom-buttons">
                    <button
                        type="button"
                        className="cancel-main-btn"
                        id="e-view"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="save-main-btn"
                        id="e-edit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Step5Competitions;