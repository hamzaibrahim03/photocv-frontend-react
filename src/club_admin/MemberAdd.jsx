import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from '../React/extra/LoaderAll';
import apiClient from '../api/axios';
function MemberAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        email: '',
        phone: '',
        description: '',
        role: 'Photographer',
        facebook: '',
        instagram: '',
        flickr: '',
    });
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (isEditMode) {
            getMember();
        } else {
            setIsLoading(false);
        }
    }, [id]);
    const getMember = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(`/members/${id}`);
            console.log('Member API:', response.data);
            const member = response.data?.data || response.data;
            setFormData({
                title: member?.title || '',
                name: member?.first_name + ' ' + member?.last_name || '',
                email: member?.email || '',
                phone: member?.phone || '',
                description: member?.bio || '',
                role: member?.role || 'Photographer',
                facebook:
                    member?.facebook ||
                    member?.facebook_url ||
                    '',
                instagram:
                    member?.instagram ||
                    member?.social_link ||
                    '',
                flickr:
                    member?.flickr ||
                    member?.flickr_url ||
                    '',
            });
            setExistingImage(
                member?.profile_image_url ||
                member?.image_url ||
                member?.image ||
                ''
            );
        } catch (error) {
            console.error('Error loading member:', error);
            alert(
                error?.response?.data?.message ||
                'Unable to load member.'
            );
            navigate('/members');
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setImage(null);
            return;
        }
        setImage(file);
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required.';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setIsSaving(true);
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('phone', formData.phone);
            payload.append('description', formData.description);
            payload.append('role', formData.role);
            payload.append('facebook', formData.facebook);
            payload.append('instagram', formData.instagram);
            payload.append('flickr', formData.flickr);
            if (image) {
                payload.append('image', image);
            }
            let response;
            if (isEditMode) {
                response = await apiClient.post(
                    `/members/${id}`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        params: {
                            _method: 'PUT',
                        },
                    }
                );
            } else {
                response = await apiClient.post('/members', payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            console.log('Save response:', response.data);
            alert(
                isEditMode
                    ? 'Member updated successfully.'
                    : 'Member added successfully.'
            );
            navigate('/members');
        } catch (error) {
            console.error('Error saving member:', error);
            if (error?.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            alert(
                error?.response?.data?.message ||
                'Unable to save member.'
            );
        } finally {
            setIsSaving(false);
        }
    };
    const imagePreview = image
        ? URL.createObjectURL(image)
        : existingImage;
    return (
        <>
            <div style={{backgroundColor: 'white'}}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="" />
                        <div className="content">
                            <section>
                                <div className="container mx-auto px-0" style={{maxWidth: '1810px'}}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                                        <div className="profile-card bg-white shadow-sm p-4 rounded d-flex align-items-center" style={{width: '100%', height: '100px'}}>
                                            <div className="profile-info ms-3">
                                                <h2 className="name m-0 text-dark head fs-3">
                                                    {isEditMode
                                                        ? 'Edit Member'
                                                        : 'Add New Member'}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="row container mx-auto px-0" style={{maxWidth: '1810px'}}>
                                <div className="col-md-8 px-0">
                                    <section className="bg-white p-4 rounded shadow-sm mb-5">
                                        <form onSubmit={submitForm}>
                                            <h5 className="head mb-4">
                                                General Information
                                            </h5>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Title</label>
                                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" placeholder="Mr, Mrs, Dr..."/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Full Name</label>
                                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`form-control ${errors.name ? 'is-invalid' : ''}`} required/>
                                                    {errors.name && (
                                                        <div className="invalid-feedback">
                                                            {Array.isArray(errors.name)
                                                                ? errors.name[0]
                                                                : errors.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Email</label>
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`form-control ${errors.email ? 'is-invalid' : ''}`} required/>
                                                    {errors.email && (
                                                        <div className="invalid-feedback">
                                                            {Array.isArray(errors.email)
                                                                ? errors.email[0]
                                                                : errors.email}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Phone</label>
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} required/>
                                                    {errors.phone && (
                                                        <div className="invalid-feedback">
                                                            {Array.isArray(errors.phone)
                                                                ? errors.phone[0]
                                                                : errors.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Description</label>
                                                    <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="5" style={{resize: 'none'}}/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Image</label>
                                                    <input type="file" accept="image/*" className="form-control bg-light" onChange={handleImageChange}/>
                                                    {imagePreview && (
                                                        <div className="mt-3">
                                                            <img src={imagePreview} alt="Member" style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px',}}/>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-12">
                                                    <label className="form-label text-muted">Role</label>
                                                    <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                                                        <option value="Admin">Admin</option>
                                                        <option value="Photographer">Photographer</option>
                                                        <option value="Member">Member</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <h5 className="head mb-4 border-top pt-4">Social Media Links</h5>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Facebook</label>
                                                <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="form-control" placeholder="Facebook link..."/>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Instagram</label>
                                                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="form-control" placeholder="Instagram link..."/>
                                            </div>
                                            <div className="mb-5">
                                                <label className="form-label text-muted">Flickr</label>
                                                <input type="text" name="flickr" value={formData.flickr} onChange={handleChange} className="form-control" placeholder="Flickr link..."/>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="button-group d-flex gap-2">
                                                    <button type="submit" disabled={isSaving} className="btn text-white px-4" style={{backgroundColor: '#4c4036',}}>
                                                        {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
                                                    </button>
                                                    <button type="button" className="btn text-white px-4 bg-secondary" onClick={() => navigate('/members')} disabled={isSaving}>
                                                        Cancel
                                                    </button>
                                                </div>
                                                <button type="button" className="btn text-white px-4" style={{backgroundColor: '#99816b',}} onClick={() => navigate('/members')}>
                                                    Back
                                                </button>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default MemberAdd;