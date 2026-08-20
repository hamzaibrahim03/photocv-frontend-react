import React, { useState } from 'react';
import NavigationRoute from '../../components/NavigationRoute';
import HeaderRoute from '../../components/HeaderRoute';

const MemberAdd = () => {
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        email: '',
        phone: '',
        description: '',
        role: '',
        facebook: '',
        instagram: '',
        flickr: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitForm = (e) => {
        e.preventDefault();
        console.log("Submitting:", formData);
        alert("Member saved!");
    };

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="" />

            <div className="content" style={{ padding: '0 30px' }}>
                <section>
                    <div className="container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                            <div className="profile-card bg-white shadow-sm p-4 rounded d-flex align-items-center" style={{ width: '100%', height: '100px' }}>
                                <div className="profile-info ms-3">
                                    <h2 className="name m-0 text-dark fw-bold fs-3">Add New Member</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="row container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                    <div className="col-md-8 px-0">
                        <section className="bg-white p-4 rounded shadow-sm mb-5">
                            <form onSubmit={submitForm}>
                                <h5 className="fw-bold mb-4">General Information</h5>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Phone</label>
                                        <input type="number" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" style={{ resize: 'none' }}></textarea>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Image</label>
                                        <input type="file" className="form-control bg-light" />
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-12">
                                        <label className="form-label text-muted">Role</label>
                                        <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                                            <option value=""></option>
                                            <option value="Admin">Admin</option>
                                            <option value="Photographer">Photographer</option>
                                            <option value="Member">Member</option>
                                        </select>
                                    </div>
                                </div>

                                <h5 className="fw-bold mb-4 border-top pt-4">Social Media Links</h5>
                                <div className="mb-3">
                                    <label className="form-label text-muted">Facebook</label>
                                    <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="form-control" placeholder="Facebook link..." />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted">Instagram</label>
                                    <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="form-control" placeholder="Instagram link..." />
                                </div>

                                <div className="mb-5">
                                    <label className="form-label text-muted">Flickr</label>
                                    <input type="text" name="flickr" value={formData.flickr} onChange={handleChange} className="form-control" placeholder="Flickr link..." />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="button-group d-flex gap-2">
                                        <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }}>Save</button>
                                        <button type="button" className="btn text-white px-4 bg-secondary">Cancel</button>
                                    </div>
                                    <button type="button" className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => window.history.back()}>Back</button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberAdd;
