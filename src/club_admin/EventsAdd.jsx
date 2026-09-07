import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Calendar from "../React/extra/CalendarRyton.jsx"
import Loader from "../React/extra/LoaderAll";
import apiClient from '../api/axios';
function EventsAdd() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [description, setDescription] = useState('');
    const [eventTypes, setEventTypes] = useState([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [eventTags, setEventTags] = useState([]);
    const [selectedEventTags, setSelectedEventTags] = useState([]);
    const [duration, setDuration] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [speakerClub, setSpeakerClub] = useState('');
    const [speakerQualification, setSpeakerQualification] = useState('');
    const [status, setStatus] = useState('scheduled');
    const [requiredGear, setRequiredGear] = useState('');
    const [url, setUrl] = useState('');
    const [rsvpDetail, setRsvpDetail] = useState('');
    const [featuredThumbUrl, setFeaturedThumbUrl] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [availableKeywords, setAvailableKeywords] = useState([]);
    const [images, setImages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const keywordOptions = useMemo(() => {
        const query = searchInput.toLowerCase().trim();
        return [...new Set(availableKeywords)].filter(
            tag => tag.toLowerCase().includes(query) && !selectedTags.includes(tag)
        );
    }, [availableKeywords, searchInput, selectedTags]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventData, setEventData] = useState({})
    const [dashboardData, setDashboardData] = useState({})
    const [eventExtra, setEventExtra] = useState({})
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    getEventData(),
                    getEventExtra(),
                    getDashboardData(),
                    getEventTypes(),
                    getEventTags()
                ]);
            } catch (error) {
                console.error("Failed to load page data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    async function getDashboardData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/dashboard'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setDashboardData(data.data);
    };
    async function getEventTypes() {
        try {
            const response = await apiClient.get('/catalogs');
            const data = response.data?.data || response.data || [];
            const types = data.filter(
                item => item.catalog_type === 'event_type'
            );
            setEventTypes(types);
            console.log("EVENT TYPES:", types);
        } catch (error) {
            console.error(
                "Failed to fetch event types:",
                error.response?.data || error.message
            );
        }
    }
    async function getEventTags() {
        try {
            const response = await apiClient.get('/events');
            const result = response.data?.data?.original?.data;
            const events = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : [];
            console.log(result)
            console.log(events)
            const tagMap = new Map();
            const keywordSet = new Set();
            const parseKeywords = value => {
                if (Array.isArray(value)) {
                    return value.map(String).map(v => v.trim()).filter(Boolean);
                }
                if (typeof value !== 'string' || !value.trim()) {
                    return [];
                }
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        return parsed.map(String).map(v => v.trim()).filter(Boolean);
                    }
                } catch {
                    // API normally returns comma-separated text.
                }
                return value.split(',').map(v => v.trim()).filter(Boolean);
            };
            events.forEach(event => {
                (Array.isArray(event?.tags_keywords) ? event.tags_keywords : []).forEach(tag => {
                    if (tag?.id != null) {
                        tagMap.set(Number(tag.id), tag);
                    }
                });
                parseKeywords(event?.tags_keywords).forEach(keyword => {
                    keywordSet.add(keyword);
                });
            });
            const tags = Array.from(tagMap.values());
            const keywords = Array.from(keywordSet);
            setEventTags(tags);
            setAvailableKeywords(keywords);
            console.log('EVENT TAGS:', tags);
            console.log('EVENT KEYWORDS:', keywords);
        } catch (error) {
            console.error(
                'Failed to fetch event tags:',
                error.response?.data || error.message
            );
            setEventTags([]);
        }
    }
    async function getEventData() {
        try {
            let response;
            if (id) {
                response = await apiClient.get(`/events/${id}`);
            } else {
                response = await apiClient.get('/events');
            }
            console.log("Event API:", response.data);
            const result = response.data?.data;
            let event;
            if (id) {
                event = result?.data || result || {};
            } else {
                event = Array.isArray(result)
                    ? result[0] || {}
                    : result || {};
            }
            setEventData(event);
            // Populate form when editing
            if (id && event) {
                setName(event.name || '');
                setEventDate(
                    event.event_date
                        ? event.event_date.substring(0, 10)
                        : ''
                );
                setDescription(event.description || '');
                const typeIds = Array.isArray(event.types)
                    ? event.types.map(type => Number(type.id)).filter(Number.isFinite)
                    : event.event_type_id != null
                        ? [Number(event.event_type_id)]
                        : [];
                setSelectedEventTypes(typeIds);
                const tagIds = Array.isArray(event.tags)
                    ? event.tags.map(tag => Number(tag.id)).filter(Number.isFinite)
                    : event.event_tag_id != null
                        ? [Number(event.event_tag_id)]
                        : [];
                setSelectedEventTags(tagIds);
                setDuration(event.duration || '');
                setSpeaker(event.speaker || '');
                setSpeakerClub(event.speaker_club || '');
                setSpeakerQualification(event.speaker_qualification || '');
                setStatus(event.status || 'scheduled');
                setRequiredGear(event.required_gear || '');
                setUrl(event.url || '');
                setRsvpDetail(event.rsvp_detail || '');
                setFeaturedThumbUrl(
                    event.featured_thumb_url ||
                    event.featured_thumb_url ||
                    ''
                );
                // Handle tags whether API returns array or JSON string
                let tags = [];
                if (Array.isArray(event.tags_keywords)) {
                    tags = event.tags_keywords;
                } else if (typeof event.tags_keywords === 'string') {
                    try {
                        const parsed = JSON.parse(event.tags_keywords);
                        tags = Array.isArray(parsed)
                            ? parsed
                            : event.tags_keywords
                                .split(',')
                                .map(tag => tag.trim())
                                .filter(Boolean);
                    } catch {
                        tags = event.tags_keywords
                            .split(',')
                            .map(tag => tag.trim())
                            .filter(Boolean);
                    }
                }
                setSelectedTags(tags);
                // Also include keywords from the event currently being edited.
                if (typeof event.tags_keywords === 'string') {
                    const currentKeywords = event.tags_keywords
                        .split(',')
                        .map(value => value.trim())
                        .filter(Boolean);
                    setAvailableKeywords(prev => [...new Set([...prev, ...currentKeywords])]);
                }
                // The event response is also the source for event-tag options.
                if (Array.isArray(event.tags) && event.tags.length) {
                    setEventTags(prev => {
                        const map = new Map(prev.map(tag => [Number(tag.id), tag]));
                        event.tags.forEach(tag => {
                            if (tag?.id != null) map.set(Number(tag.id), tag);
                        });
                        return Array.from(map.values());
                    });
                }
            }
        } catch (error) {
            console.error(
                "Failed to fetch event:",
                error.response?.data || error.message
            );
        }
    }
    console.log(eventData.original?.data)
    async function getEventExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/event-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setEventExtra(data.data);
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.tag-dropdown')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener(
                'click',
                handleClickOutside
            );
        };
    }, []);
    const formatsDate = (date) => {
        if (!date) return "-";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }
        return parsedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            weekday: "long",
        });
    };
    const formatDate = (date) => {
        if (!date) return "-";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }
        return parsedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };
    const formatTime = (datetimeStr) => {
        if (!datetimeStr) return "-";
        const date = new Date(datetimeStr);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    const normalizeDateForApi = (value) => {
        if (!value) return '';
        // <input type="date"> should always be YYYY-MM-DD.
        // Never send an ISO datetime or a locale-formatted date to the API.
        const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
        if (!match) return '';
        const date = new Date(`${match[1]}T00:00:00`);
        if (Number.isNaN(date.getTime())) return '';
        return match[1];
    };
    const submitForm = async (e) => {
        e.preventDefault();
        const apiDate = normalizeDateForApi(eventDate);
        if (!name.trim()) {
            alert('Event name is required.');
            return;
        }
        if (!apiDate) {
            alert('Please select a valid event date.');
            return;
        }
        if (selectedEventTypes.length === 0) {
            alert('Please select at least one Event Type.');
            return;
        }
        if (selectedEventTags.length === 0) {
            alert('Please select at least one Event Tag.');
            return;
        }
        // Backend requires at least one image only when creating a new event.
        if (!id && images.length === 0) {
            alert('Please upload at least one image.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('event_date', apiDate);
            formData.append('description', description);
            formData.append('duration', duration);
            formData.append('status', status);
            formData.append('speaker', speaker);
            formData.append('speaker_club', speakerClub);
            formData.append('speaker_qualification', speakerQualification);
            formData.append('required_gear', requiredGear);
            formData.append('url', url);
            formData.append('rsvp_detail', rsvpDetail);
            // Backend expects arrays.
            selectedEventTypes.forEach(typeId => {
                formData.append('event_types[]', String(typeId));
            });
            selectedEventTags.forEach(tagId => {
                formData.append('event_tags[]', String(tagId));
            });
            // tags_keywords is a comma-separated string in the API response.
            formData.append('tags_keywords', selectedTags.join(', '));
            if (featuredThumbUrl) {
                formData.append('featured_thumb_url', featuredThumbUrl);
            }
            images.forEach((image, index) => {
                if (image?.file instanceof File) {
                    formData.append(`images[${index}]`, image.file);
                    formData.append(`captions[${index}]`, image.caption || '');
                }
            });
            attachments.forEach((file, index) => {
                if (file instanceof File) {
                    formData.append(`attachments[${index}]`, file);
                }
            });
            if (id) {
                // Laravel method spoofing is used because multipart PUT can be problematic.
                formData.append('_method', 'PUT');
                await apiClient.post(`/events/${id}`, formData);
            } else {
                await apiClient.post('/events', formData);
            }
            alert('Event saved successfully!');
            navigate('/event');
        } catch (error) {
            console.error('FULL API ERROR:', error);
            console.error('API STATUS:', error.response?.status);
            console.error('API RESPONSE:', error.response?.data);
            const errors = error.response?.data?.errors;
            if (errors) {
                const messages = Object.entries(errors)
                    .flatMap(([field, messages]) =>
                        Array.isArray(messages)
                            ? messages.map(message => `${field}: ${message}`)
                            : [`${field}: ${messages}`]
                    )
                    .join('\n');
                alert(messages);
            } else {
                alert(
                    error.response?.data?.message ||
                    'Failed to save event.'
                );
            }
        }
    };
    const addTag = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
            setSearchInput("");
            setShowDropdown(false);
        }
    };
    const removeTag = (index) => {
        const newTags = [...selectedTags];
        newTags.splice(index, 1);
        setSelectedTags(newTags);
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file =>
            [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif"
            ].includes(file.type)
        );
        if (validFiles.length !== files.length) {
            alert("Only JPG, JPEG, PNG and GIF images are allowed.");
        }
        if (images.length + validFiles.length > 4) {
            alert("You can upload a maximum of 4 images.");
            e.target.value = "";
            return;
        }
        const newImages = validFiles.map(file => ({
            file: file,
            caption: "",
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
        e.target.value = "";
    };
    const removeImage = (index) => {
        setImages(prev => {
            const imageToRemove = prev[index];
            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter((_, i) => i !== index);
        });
    };
    const handleAttachmentUpload = (e) => {
        const files = Array.from(e.target.files);
        if (attachments.length + files.length > 4) {
            alert("You can upload a maximum of 4 attachments.");
            e.target.value = "";
            return;
        }
        setAttachments(prev => [...prev, ...files]);
        e.target.value = "";
    };
    const removeAttachment = (index) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Events" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Viewing event</small>
                                                    <h2 className="name">{eventData.name}</h2>
                                                    <p className="role">{formatsDate(eventData.event_date)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Members</small>
                                                <h3 className="number">{String(dashboardData?.total_members_count).padStart(2, "0")}</h3>
                                            </div>
                                            <div className="event-cards">
                                                {eventExtra?.upcoming_event?.remaining_days !== undefined &&
                                                    eventExtra?.upcoming_event?.remaining_days !== null ? (
                                                    <>
                                                        <small className="ca-details">Next Event</small>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <h3 className="number">{String(eventExtra?.upcoming_event?.remaining_days).padStart(2, '0')}</h3>
                                                            </div>
                                                            <div className="days col-md-7">
                                                                <span>days to go</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h3 className="days">
                                                            No upcoming events
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row mt-4">
                                        <div className="col-md-8">
                                            <section>
                                                <div id="news" className="bg-white p-4 rounded shadow-sm">
                                                    <form onSubmit={submitForm}>
                                                        <div className="row mb-3">
                                                            <div className="col-md-4">
                                                                <img src={featuredThumbUrl || '/placeholder.jpg'} alt="Meeting" className="img-fluid rounded" />
                                                            </div>
                                                            <div className="col-md-8">
                                                                <label htmlFor="names" className="form-label">Event Name</label>
                                                                <input type="text" className="form-control mb-3" value={name} onChange={e => setName(e.target.value)} />
                                                                <label htmlFor="date" className="form-label">Event Date</label>
                                                                <input type="date" className="form-control" value={eventDate} onChange={e => setEventDate(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row p-3 rounded mb-3" style={{ backgroundColor: '#99816b33' }}>
                                                            <h5>Event Description</h5>
                                                            <textarea className="form-control bg-transparent border-0" rows="3" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label">Event Type</label>
                                                            <div className="row g-2">
                                                                {eventTypes.map(type => {
                                                                    const typeId = Number(type.id);
                                                                    return (
                                                                        <div className="col-md-3" key={type.id}>
                                                                            <label className="w-100 border rounded p-2 d-flex align-items-center" style={{ cursor: "pointer", minHeight: "42px" }}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-check-input me-2"
                                                                                    checked={selectedEventTypes.includes(typeId)}
                                                                                    onChange={() => {
                                                                                        setSelectedEventTypes(prev => {
                                                                                            if (prev.includes(typeId)) {
                                                                                                return prev.filter(
                                                                                                    id => id !== typeId
                                                                                                );
                                                                                            }
                                                                                            return [...prev, typeId];
                                                                                        });
                                                                                    }}
                                                                                />
                                                                                {type.icon_url && (
                                                                                    <img
                                                                                        src={type.icon_url}
                                                                                        alt=""
                                                                                        style={{
                                                                                            width: "18px",
                                                                                            height: "18px",
                                                                                            objectFit: "contain",
                                                                                            marginRight: "6px"
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                {type.name}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label">Event Tags</label>
                                                            <div className="row g-2">
                                                                {availableKeywords.map((keyword, index) => (
                                                                    <div className="col-md-3" key={`${keyword}-${index}`}>
                                                                        <label
                                                                            className="w-100 border rounded p-2 d-flex align-items-center"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                minHeight: "42px"
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input me-2"
                                                                                checked={selectedTags.includes(keyword)}
                                                                                onChange={() => {
                                                                                    setSelectedTags(prev => {
                                                                                        if (prev.includes(keyword)) {
                                                                                            return prev.filter(tag => tag !== keyword);
                                                                                        }
                                                                                        return [...prev, keyword];
                                                                                    });
                                                                                }}
                                                                            />
                                                                            {keyword}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                <label className="form-label">Event Duration</label>
                                                                <input type="text" className="form-control" value={duration} onChange={e => setDuration(e.target.value)} />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label">Event Speaker</label>
                                                                <input type="text" className="form-control" value={speaker} onChange={e => setSpeaker(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                <label className="form-label">Speaker Club</label>
                                                                <input type="text" className="form-control" value={speakerClub} onChange={e => setSpeakerClub(e.target.value)} />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label">Speaker Qualifications</label>
                                                                <input type="text" className="form-control" value={speakerQualification} onChange={e => setSpeakerQualification(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Event Status</label>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="row">
                                                                        {['scheduled', 'draft', 'tbc'].map((st) => (
                                                                            <div key={st} className="col-md-6 col-lg-4 mb-2">
                                                                                <div className="premium-radio">
                                                                                    <input type="radio" name="status" value={st} checked={status === st} onChange={e => setStatus(e.target.value)} />
                                                                                    <label htmlFor="disable">
                                                                                        <div className="premium-radio-circle"></div>
                                                                                        <div className="premium-radio-content">
                                                                                            <div className="premium-radio-title">
                                                                                                {st}
                                                                                            </div>
                                                                                        </div>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="row">
                                                                        {['cancelled', 'completed'].map((st) => (
                                                                            <div key={st} className="col-md-6 col-lg-6 mb-2">
                                                                                <div className="premium-radio">
                                                                                    <input type="radio" name="status" value={st} checked={status === st} onChange={e => setStatus(e.target.value)} />
                                                                                    <label htmlFor="disable">
                                                                                        <div className="premium-radio-circle"></div>
                                                                                        <div className="premium-radio-content">
                                                                                            <div className="premium-radio-title">
                                                                                                {st}
                                                                                            </div>
                                                                                        </div>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Gear Required</label>
                                                            <input type="text" className="form-control" value={requiredGear} onChange={e => setRequiredGear(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3 position-relative tag-dropdown">
                                                            <label className="form-label">Tags/Keywords</label>
                                                            <div className="d-flex flex-wrap border rounded p-2 form-control min-h-px-50 align-items-center gap-2" onClick={() => setShowDropdown(true)}>
                                                                {selectedTags.map((tag, index) => (
                                                                    <div key={index} className="badge bg-secondary d-flex align-items-center" style={{ width: '180px', gap: '5px' }}>
                                                                        {tag}
                                                                        <button type="button" className="btn-close btn-close-white ms-2 mb-1" style={{ fontSize: '0.4rem' }} onClick={(e) => { e.stopPropagation(); removeTag(index); }}></button>
                                                                    </div>
                                                                ))}
                                                                <input
                                                                    type="text"
                                                                    className="border-0 shadow-none flex-grow-1 outline-none"
                                                                    style={{ minWidth: '100px', outline: 'none' }}
                                                                    placeholder="Add keyword..."
                                                                    value={searchInput}
                                                                    onChange={e => setSearchInput(e.target.value)}
                                                                    onFocus={() => setShowDropdown(true)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            const value = searchInput.trim();
                                                                            if (value && !selectedTags.includes(value)) {
                                                                                setSelectedTags(prev => [...prev, value]);
                                                                                setSearchInput('');
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            {showDropdown && (
                                                                <ul className="dropdown-menu show w-100 position-absolute" style={{ top: '100%', zIndex: 1000 }}>
                                                                    {keywordOptions.length === 0 ? (
                                                                        <li className="dropdown-item text-muted">No results found</li>
                                                                    ) : (
                                                                        keywordOptions.map((tag, index) => (
                                                                            <li key={index} className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => addTag(tag)}>{tag}</li>
                                                                        ))
                                                                    )}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Link to related Page</label>
                                                            <input type="url" className="form-control" value={url} onChange={e => setUrl(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">RSVP Details</label>
                                                            <textarea className="form-control" rows="3" value={rsvpDetail} onChange={e => setRsvpDetail(e.target.value)}></textarea>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Image to be chosen (max 4)</label>
                                                            <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.gif" multiple onChange={handleImageChange} />
                                                        </div>
                                                        {images.length > 0 && (
                                                            <div className="d-flex flex-wrap gap-3 mb-4">
                                                                {images.map((img, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="position-relative border p-1 rounded"
                                                                        style={{ width: "150px" }}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="btn-close position-absolute top-0 end-0 m-1 bg-white"
                                                                            onClick={() => removeImage(index)}
                                                                        />
                                                                        <img
                                                                            src={img.preview}
                                                                            className="img-fluid w-100 object-fit-cover"
                                                                            style={{ height: "100px" }}
                                                                            alt="upload"
                                                                        />
                                                                        <textarea
                                                                            className="form-control form-control-sm mt-1"
                                                                            rows="2"
                                                                            placeholder="Caption..."
                                                                            value={img.caption}
                                                                            onChange={(e) => {
                                                                                setImages(prev =>
                                                                                    prev.map((item, i) =>
                                                                                        i === index
                                                                                            ? {
                                                                                                ...item,
                                                                                                caption: e.target.value
                                                                                            }
                                                                                            : item
                                                                                    )
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="mb-3">
                                                            <label className="form-label">Attachments (docs only)</label>
                                                            <input type="file" className="form-control" accept=".pdf,.doc,.docx,.txt,.zip,.ppt,.pptx" onChange={handleAttachmentUpload} disabled={attachments.length >= 4} multiple />
                                                        </div>
                                                        {attachments.length > 0 && (
                                                            <div className="d-flex flex-wrap gap-3 mb-4">
                                                                {attachments.map((file, index) => (
                                                                    <div key={index} className="d-flex align-items-center border rounded p-2 bg-light">
                                                                        <span className="me-2 fs-4">📄</span>
                                                                        <span className="text-truncate" style={{ maxWidth: '100px', fontSize: '12px' }}>{file.name}</span>
                                                                        <button type="button" className="btn-close ms-2" style={{ fontSize: '0.5rem' }} onClick={() => removeAttachment(index)}></button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="mb-4 form-check">
                                                            <input type="checkbox" className="form-check-input" id="dropbox" />
                                                            <label className="form-check-label" htmlFor="dropbox">Enable Dropbox uploads</label>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button type="button" id="e-view" onClick={() => navigate(-1)}>Back</button>
                                                            <button type="submit" id="e-edit">Save</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments</h5>
                                                            {eventExtra.recent_comments?.slice(0, 5)?.map((event) =>
                                                                event.comments?.map((comment) => (
                                                                    <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                        <div className="event-item">
                                                                            <div className="col-md-2">
                                                                                {comment.user?.profile_image_url ? (
                                                                                    <img src={comment.user.profile_image_url} alt="Commenter" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                                                ) : (
                                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                        <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <p className="text-secondary">{comment.comment}</p>
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <div className="event-time" style={{ textAlign: 'right', width: '90%' }}>
                                                                                    <small className="event-date">{formatDate(comment.created_at)}</small>
                                                                                    <br />
                                                                                    <small className="event-time-details">{formatTime(comment.created_at)}</small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">More Events</h5>
                                                            {eventExtra.random_events?.map((event) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }}>
                                                                    <div key={event.id} className="event-item">
                                                                        <div className="col-md-2">
                                                                            {event.featured_image_url ? (
                                                                                <img src={event.featured_image_url} alt="Com" style={{ width: '50px', height: '50px' }} />
                                                                            ) : (
                                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                    <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="text-secondary">{event.name}</p>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <div className="event-time" style={{ textAlign: 'right', width: '90%' }}>
                                                                                <small className="event-date">{formatDate(event.event_date)}</small><br />
                                                                                <small className="event-time-details">{formatTime(event.event_date)}</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default EventsAdd;