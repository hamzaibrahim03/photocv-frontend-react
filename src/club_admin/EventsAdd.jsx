import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import CalendarDashboard from './Calendars/CalendarDashboard';
import MoreEvents from './events/MoreEvents';

// Mock dependencies
import apiClient from '../api/axios'; // assuming this exists
// In a real app we'd convert these stores to Context or standard custom hooks
// We will mock the state locally for this component conversion

const EventsAdd = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock store state
    const [memberCount, setMemberCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [eventDay, setEventDay] = useState(0);
    const [eventComments, setEventComments] = useState([]);

    // Form state
    const [name, setName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [description, setDescription] = useState('');
    const [eventKindId, setEventKindId] = useState('');
    const [eventTypeId, setEventTypeId] = useState('');
    const [duration, setDuration] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [speakerClub, setSpeakerClub] = useState('');
    const [speakerQualification, setSpeakerQualification] = useState('');
    const [status, setStatus] = useState('scheduled');
    const [requiredGear, setRequiredGear] = useState('');
    const [url, setUrl] = useState('');
    const [rsvpDetail, setRsvpDetail] = useState('');
    const [featuredThumbUrl, setFeaturedThumbUrl] = useState('');

    // Tags
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const allTags = ["Urgent", "Meeting", "Reminder", "Policy Update", "Holiday Notice", "Exam Schedule"];

    // Files
    const [images, setImages] = useState([]);
    const [captions, setCaptions] = useState([]);
    const [attachments, setAttachments] = useState([]);

    const filteredTags = useMemo(() => {
        const query = searchInput.toLowerCase();
        return allTags.filter((tag) => tag.toLowerCase().includes(query) && !selectedTags.includes(tag));
    }, [searchInput, selectedTags, allTags]);

    useEffect(() => {
        const fetchEvent = async (eventId) => {
            try {
                // Mock fetch
                const dummyData = {
                    name: 'Sample Event',
                    event_date: '2026-10-10',
                    description: 'A mock event description'
                };
                setName(dummyData.name || '');
                setEventDate(dummyData.event_date ? dummyData.event_date.substring(0, 10) : '');
                setDescription(dummyData.description || '');
            } catch (error) {
                console.error("Error fetching event by ID:", error);
            }
        };

        if (id) {
            fetchEvent(id);
        }

        // Simulating click outside to close dropdown
        const handleClickOutside = (e) => {
            if (!e.target.closest('.tag-dropdown')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [id]);

    const submitForm = async (e) => {
        e.preventDefault();

        const payload = {
            featured_thumb_url: featuredThumbUrl,
            name,
            event_date: eventDate,
            event_type_id: eventTypeId,
            event_kind_id: eventKindId,
            description,
            duration,
            status,
            speaker,
            speaker_club: speakerClub,
            speaker_qualification: speakerQualification,
            required_gear: requiredGear,
            url,
            rsvp_detail: rsvpDetail,
            tags_keywords: JSON.stringify(selectedTags)
        };

        try {
            if (id) {
                await apiClient.put(`/events/${id}`, payload);
            } else {
                await apiClient.post(`/events`, payload);
            }
            alert("Event saved successfully!");
            navigate("/event");
        } catch (error) {
            console.error("Error submitting event:", error);
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 4) {
            alert("You can upload a maximum of 4 images.");
            e.target.value = "";
            return;
        }

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => [...prev, e.target.result]);
                setCaptions(prev => [...prev, ""]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newCaptions = [...captions];
        newImages.splice(index, 1);
        newCaptions.splice(index, 1);
        setImages(newImages);
        setCaptions(newCaptions);
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
        <div className="content" style={{ padding: '0 30px' }}>
            <NavigationRoute />
            <HeaderRoute title="Events" />

            <section>
                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4">
                        <div className="profile-card d-flex bg-white rounded p-4 shadow-sm" style={{ width: '65.8%', height: '148px' }}>
                            <div className="profile-left d-flex flex-column justify-content-center">
                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>Viewing Event</small>
                                <h2 className="name m-0 text-dark" style={{ fontSize: '30px', fontWeight: '500' }}>{name || "New Event"}</h2>
                                <p className="role m-0 text-danger" style={{ fontSize: '18px' }}>{eventCount} Events to go</p>
                            </div>
                        </div>
                        <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                            <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                <small className="ca-details" style={{ fontSize: '20px' }}>Events</small>
                                <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                            </div>
                            <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                <small className="ca-details" style={{ fontSize: '20px' }}>Next Event</small>
                                <div className="row mt-4 align-items-center">
                                    <div className="col-md-5">
                                        <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>
                                            {String(eventDay).padStart(2, '0')}
                                        </h3>
                                    </div>
                                    <div className="days col-md-7 text-start">
                                        <span>days to go</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="row mt-4">
                <div className="col-md-8">
                    <div id="news" className="bg-white p-4 rounded shadow-sm">
                        <form onSubmit={submitForm}>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <img src={featuredThumbUrl || 'placeholder.jpg'} alt="Meeting" className="img-fluid rounded" />
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

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Event Kind</label>
                                    <input type="number" className="form-control" value={eventKindId} onChange={e => setEventKindId(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Event Type</label>
                                    <input type="number" className="form-control" value={eventTypeId} onChange={e => setEventTypeId(e.target.value)} />
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
                                    {['scheduled', 'draft', 'tbc', 'cancelled', 'completed'].map((st) => (
                                        <div key={st} className="col-md-4 col-lg-2 mb-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="status" value={st} checked={status === st} onChange={e => setStatus(e.target.value)} />
                                                <label className="form-check-label text-capitalize">{st}</label>
                                            </div>
                                        </div>
                                    ))}
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
                                        <div key={index} className="badge bg-secondary d-flex align-items-center">
                                            {tag}
                                            <button type="button" className="btn-close btn-close-white ms-2 mb-1" style={{ fontSize: '0.4rem' }} onClick={(e) => { e.stopPropagation(); removeTag(index); }}></button>
                                        </div>
                                    ))}
                                    <input type="text" className="border-0 shadow-none flex-grow-1 outline-none" style={{ minWidth: '100px', outline: 'none' }} placeholder="Add tag..." value={searchInput} onChange={e => setSearchInput(e.target.value)} onFocus={() => setShowDropdown(true)} />
                                </div>
                                {showDropdown && (
                                    <ul className="dropdown-menu show w-100 position-absolute" style={{ top: '100%', zIndex: 1000 }}>
                                        {filteredTags.length === 0 ? (
                                            <li className="dropdown-item text-muted">No results found</li>
                                        ) : (
                                            filteredTags.map((tag, index) => (
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
                                <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} disabled={images.length >= 4} multiple />
                            </div>

                            {images.length > 0 && (
                                <div className="d-flex flex-wrap gap-3 mb-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="position-relative border p-1 rounded" style={{ width: '150px' }}>
                                            <button type="button" className="btn-close position-absolute top-0 end-0 m-1 bg-white" onClick={() => removeImage(index)}></button>
                                            <img src={img} className="img-fluid w-100 object-fit-cover" style={{ height: '100px' }} alt="upload" />
                                            <textarea className="form-control form-control-sm mt-1" rows="2" placeholder="Caption..." value={captions[index]} onChange={(e) => {
                                                const newCaptions = [...captions];
                                                newCaptions[index] = e.target.value;
                                                setCaptions(newCaptions);
                                            }}></textarea>
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
                                <button type="button" className="btn text-white w-25" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(-1)}>Back</button>
                                <button type="submit" className="btn text-white w-25" style={{ backgroundColor: '#4c4036' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-4">
                    <CalendarDashboard />

                    <div className="cardddd bg-white rounded p-4 shadow-sm mt-4">
                        <h5 className="mb-4">Recent Comments</h5>

                        <div className="event-list d-flex flex-column gap-3 mb-4">
                            {eventComments.slice(0, 3).map((c, idx) => (
                                <div key={idx} className="event-item d-flex align-items-center gap-3 border-bottom pb-2">
                                    <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white" style={{ width: '40px', height: '40px' }}>
                                        <i className="fa-regular fa-user"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-secondary" style={{ fontSize: '14px' }}>{c.comment || "Great event!"}</p>
                                    </div>
                                    <div className="text-end">
                                        <small className="d-block text-muted" style={{ fontSize: '11px' }}>2 days ago</small>
                                    </div>
                                </div>
                            ))}
                            {eventComments.length === 0 && <p className="text-muted small">No recent comments.</p>}
                        </div>

                        <div className="d-flex mt-auto gap-2">
                            <Link to="/notices" className="btn text-white w-50" style={{ backgroundColor: '#99816b' }}>View All</Link>
                            <Link to="/notice_single" className="btn text-white w-50" style={{ backgroundColor: '#4c4036' }}>Add New</Link>
                        </div>
                    </div>

                    <div className="mt-4">
                        <MoreEvents />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsAdd;
