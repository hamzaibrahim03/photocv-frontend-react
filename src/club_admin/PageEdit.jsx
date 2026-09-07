import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Loader from "../React/extra/LoaderAll";
import Calendar from "../React/extra/CalendarRyton";
import apiClient from '../api/axios';
const initialFormData = {
    title: '',
    page_type: '',
    description: '',
    featured_image_url: '',
    featured_image: null,
    location: '',
    link_page_url: '',
    tags: [],
    images: [],
    documents: [],
    status: 'draft',
    created_at: '',
};
function PageEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [pageData, setPageData] = useState({});
    const [pageExtra, setPageExtra] = useState({});
    const [tagInput, setTagInput] = useState('');
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]);
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) {
            return '';
        }
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const formatDateTimeForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) {
            return '';
        }
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    useEffect(() => {
        loadPage();
    }, [id]);
    useEffect(() => {
        getPageData();
        getPageExtras();
    }, []);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const loadPage = async () => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                const response = await apiClient.get(`/pages/${id}`);
                const page = response.data?.data ||
                    response.data;
                console.log('Page:', page);
                setFormData({
                    ...initialFormData,
                    title: page.title || '',
                    page_type: page.page_type || '',
                    description: page.description || '',
                    featured_image_url: page.featured_image_url || '',
                    location: page.location || '',
                    link_page_url: page.link_page_url || '',
                    tags: Array.isArray(page.tags)
                        ? page.tags
                        : [],
                    status: page.status || 'draft',
                    created_at: formatDateTimeForInput(page.created_at),
                });
                setExistingImages(
                    Array.isArray(page.images)
                        ? page.images
                        : []
                );
                setExistingDocuments(
                    Array.isArray(page.documents)
                        ? page.documents
                        : []
                );
            } else {
                setFormData(initialFormData);
                setImages([]);
                setDocuments([]);
                setExistingImages([]);
                setExistingDocuments([]);
            }
        } catch (error) {
            console.error(
                'Error loading page:',
                error
            );
            if (isEditMode) {
                alert('Unable to load page.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    async function getPageData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setPageData(data.data);
    };
    console.log(pageData.original?.data)
    async function getPageExtras() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setPageExtra(data.data);
    };
    console.log(pageExtra)
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('page_type', formData.page_type);
            payload.append('description', formData.description);
            payload.append('location', formData.location);
            payload.append('link_page_url', formData.link_page_url);
            payload.append('status', formData.status);
            payload.append('poll', formData.poll);
            payload.append('urgency_importance', formData.urgency_importance);
            payload.append('comment_allowed', formData.comment_allowed);
            formData.tags.forEach(
                (tag, index) => {
                    payload.append(
                        `tags[${index}]`,
                        tag
                    );
                }
            );
            if (formData.featured_image) {
                payload.append(
                    'featured_image',
                    formData.featured_image
                );
            }
            images.forEach((image, index) => {
                payload.append(
                    `images[${index}]`,
                    image
                );
            });
            documents.forEach((document, index) => {
                payload.append(
                    `documents[${index}]`,
                    document
                );
            });
            if (isEditMode) {
                payload.append('_method', 'PUT');
                await apiClient.post(`/pages/${id}`, payload);
                alert('Page updated successfully!');
            } else {
                await apiClient.post('/pages', payload);
                alert('Page created successfully!');
            }
            navigate('/pages');
        } catch (error) {
            console.error('Error saving page:', error);
            console.error('Validation errors:', error.response?.data);
            alert(error.response?.data?.message || 'Unable to save page.');
        } finally {
            setIsSaving(false);
        }
    };
    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            featured_image: file,
            featured_image_url: URL.createObjectURL(file)
        }));
    };
    const handleTagKeyDown = (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const newTag = tagInput.trim();
        if (!newTag) return;
        if (formData.tags.includes(newTag)) {
            setTagInput('');
            return;
        }
        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, newTag]
        }));
        setTagInput('');
    };
    const removeTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(item => item !== tag)
        }));
    };
    const handleImageUpload = (e) => {
        const files = Array.from(
            e.target.files || []
        );
        const availableSlots = Math.max(4 - images.length, 0);
        setImages(prev => [
            ...prev,
            ...files.slice(0, availableSlots)
        ]);
        e.target.value = '';
    };
    const removeImage = (index) => {
        setImages(prev =>
            prev.filter((_, i) => i !== index)
        );
    };
    const handleDocumentUpload = (e) => {
        const files = Array.from(
            e.target.files || []
        );
        const availableSlots = Math.max(4 - documents.length, 0);
        setDocuments(prev => [
            ...prev,
            ...files.slice(0, availableSlots)
        ]);
        e.target.value = '';
    };
    const removeDocument = (index) => {
        setDocuments(prev =>
            prev.filter((_, i) => i !== index)
        );
    };
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Pages" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">
                                                        {isEditMode
                                                            ? 'Edit Page'
                                                            : 'Add New Page'}
                                                    </small>
                                                    <h2 className="name">
                                                        {formData.title ||
                                                            (isEditMode
                                                                ? 'Edit Page'
                                                                : 'New Page')}
                                                    </h2>
                                                    <small className="role">
                                                        {isEditMode && formData.created_at
                                                            ? formatDate(formData.created_at)
                                                            : 'Create a new page'}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Pages</small>
                                                <h3 className="number">{pageExtra?.total_pages}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Last Page</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{pageExtra?.last_page_days_ago}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>days ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="mt-4">
                                                        <div id="news">
                                                            <div className="news-list">
                                                                <div className="form-containers">
                                                                    <form onSubmit={submitForm}>
                                                                        <h5>Basic Information</h5>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <label for="title"> Page Title </label>
                                                                                <input type="text" name='title' id='title' className="form-control" value={formData.title} onChange={handleChange} required />
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="page_type"> Page Type </label>
                                                                                <select id="page_type" name="page_type" className="form-control" value={formData.page_type} onChange={handleChange} required>
                                                                                    <option value=""> - Select - </option>
                                                                                    <option value="1"> General Page </option>
                                                                                    <option value="2"> Important Page </option>
                                                                                    <option value="3"> Event Page </option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="divider3"></div>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="description"> Page Body </label>
                                                                                <textarea id="description" name="description" className="form-control" value={formData.description} onChange={handleChange} />
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="featured_image"> Upload Thumbnail </label>
                                                                                <input type="file" id="featured_image" className="form-control" accept="image/*" onChange={handleThumbnailChange} />
                                                                                {formData.featured_image_url && (
                                                                                    <img src={formData.featured_image_url} alt="Page thumbnail" className="mt-2 rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="divider3"></div>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <label for="link"> Location </label>
                                                                                <input type="text" id="location" name="location" className="form-control" value={formData.location} onChange={handleChange} />
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <label for="link"> Link to related Page </label>
                                                                                <input type="url" id="link" name="link" className="form-control" value={formData.link_url} onChange={handleChange} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="divider3"></div>
                                                                        <div className="container col-md-12 mb-3">
                                                                            <label>
                                                                                Tags / Keywords
                                                                            </label>
                                                                            <div className="tag-dropdown">
                                                                                <div className="d-flex flex-wrap gap-2 mb-2">
                                                                                    {formData.tags.map((tag) => (
                                                                                        <div className="tag" key={tag}>
                                                                                            {tag}
                                                                                            <button type="button" onClick={() => removeTag(tag)}>
                                                                                                ×
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <input type="text" placeholder="Type tag and press Enter..." className="sea" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="divider3"></div>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <label for="image"> Image to be chosen </label>
                                                                                <input type="file" id="imageUpload" className="form-control" accept="image/*" multiple disabled={images.length >= 4} onChange={handleImageUpload} />
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <label for="image"> Documents to be download </label>
                                                                                <input type="file" id="docUpload" className="form-control" multiple disabled={documents.length >= 4} onChange={handleDocumentUpload} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="divider3"></div>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <label for="upload"> Uploaded Images </label>
                                                                                <div className="row mt-2">
                                                                                    <div className="col-md-12">
                                                                                        <div id="imagePreview" className="d-flex gap-2 flex-wrap">
                                                                                            {images.map((img, index) => (
                                                                                                <div key={index} className="position-relative border rounded p-1" style={{ width: '70px', height: '70px', background: '#f8f9fa' }}>
                                                                                                    <img src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                                                                                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => removeImage(index)}>
                                                                                                        ×
                                                                                                    </button>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <label for="Attachments"> Attachments </label>
                                                                                <div className="row mt-2">
                                                                                    <div className="col-md-12">
                                                                                        <div className="d-flex gap-2 flex-wrap">
                                                                                            {documents.map((doc, index) => (
                                                                                                <div key={index} className="border rounded p-2 position-relative">
                                                                                                    <i className="fa-regular fa-file me-2"></i>
                                                                                                    {doc.name}
                                                                                                    <button type="button" className="btn btn-sm ms-2" onClick={() => removeDocument(index)}>
                                                                                                        ×
                                                                                                    </button>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="divider3"></div>
                                                                        <div className="divider3"></div>
                                                                        <h5>Settings</h5>
                                                                        <div className="divider3"></div>
                                                                        <label className="mb-3 d-block">
                                                                            Page Status
                                                                        </label>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div className="row">
                                                                                    {[
                                                                                        'active',
                                                                                        'draft',
                                                                                        'deleted'
                                                                                    ].map(status => (
                                                                                        <div className="col-md-4 mb-3" key={status}>
                                                                                            <div className="premium-radio">
                                                                                                <input type="radio" id={`status-${status}`} name="status" value={status} checked={formData.status === status} onChange={handleChange} />
                                                                                                <label htmlFor={`status-${status}`}>
                                                                                                    <div className="premium-radio-circle" />
                                                                                                    <div className="premium-radio-content">
                                                                                                        <div className="premium-radio-title text-capitalize">
                                                                                                            {status}
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
                                                                                    {[
                                                                                        'scheduled',
                                                                                        'pending'
                                                                                    ].map(status => (
                                                                                        <div className="col-md-4 mb-3" key={status}>
                                                                                            <div className="premium-radio">
                                                                                                <input type="radio" id={`status-${status}`} name="status" value={status} checked={formData.status === status} onChange={handleChange} />
                                                                                                <label htmlFor={`status-${status}`}>
                                                                                                    <div className="premium-radio-circle" />
                                                                                                    <div className="premium-radio-content">
                                                                                                        <div className="premium-radio-title text-capitalize">
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
                                                                        <div className="divider3"></div>
                                                                        <div className="button-group">
                                                                            <button type="button" className="btn me-2" id="e-view" onClick={() => navigate(-1)}>
                                                                                Back
                                                                            </button>
                                                                            <button type="submit" className="btn" id="edit" disabled={isSaving}>
                                                                                {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
                                                                            </button>
                                                                        </div>
                                                                    </form >
                                                                </div >
                                                            </div >
                                                        </div >
                                                    </div >
                                                </div >
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments on Page</h5>
                                                            {pageData?.original?.data?.flatMap((page) => page.comments || [])?.slice(0, 4)?.map((comment) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                    <div className="event-item">
                                                                        {comment.user?.profile_image_url ? (
                                                                            <img className="img-fluid event-img" src={comment.user.profile_image_url} onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                            }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{comment?.comment}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(comment?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(comment?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">More Pages</h5>
                                                            {pageData?.original?.data?.slice(0, 6)?.map((page) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={page.id}>
                                                                    <div className="event-item">
                                                                        {page.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={page.featured_image_url} onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                            }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{page?.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(page?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(page?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="button-group mt-auto">
                                                                <button className="btn btn-sm" id="e-view" onClick={() => navigate('/pages')}>
                                                                    View All
                                                                </button>
                                                                <button className="btn btn-sm" id="new" onClick={() => navigate('/pages/create')}>
                                                                    Add New
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div >
                                </div >
                            </section >
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                                </div>
                            </footer>
                        </div >
                    </>
                )
                }
            </div >
        </>
    );
}
export default PageEdit;
