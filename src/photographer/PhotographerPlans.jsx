import React, { useState, useEffect } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';

function PhotographerPlans() {
    return (
        <>
            <NavigationRoute />
            <HeaderRoute title="Profile" />
            <section className="content">
                <div className="dashboard-card">
                    <div className="profile-card">
                        <div className="profile-left" style={{ alignItems: 'center' }}>
                            <img className="img-fluid" src={user.profile_image} alt="Profile Picture" />
                            <div className="profile-info">
                                <h2 className="name">{user.first_name}</h2>
                            </div>
                        </div>
                        <div className="profile-icons">
                            <div className="icon">
                                <span>20</span>
                                <i className="fas fa-comments"></i>
                            </div>
                            <div className="icon">
                                <span>53</span>
                                <i className="fas fa-desktop"></i>
                            </div>
                            <div className="icon">
                                <span>39</span>
                                <i className="fas fa-users"></i>
                            </div>
                        </div>
                    </div>
                    <div className="card-section">
                        <div className="stat-card">
                            <small className="ca-details">My Photos</small>
                            <h3 className="number">21</h3>
                        </div>
                        <div className="event-card">
                            <small className="ca-details">Interactions</small>
                            <div className="row">
                                <div className="col-md-5">
                                    <h3 className="number">99</h3>
                                </div>
                                <div className="days col-md-7">
                                    <span>Likes & Coments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ height: 'auto', padding: '15px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Planned Locations</h5>
                        <div className="d-flex align-items-center justify-content-between" style={{ gap: '10px' }}>
                            <div className="input-group" style={{ flex: '1' }}>
                                <input v-model="search" type="search" className="form-control" placeholder="Search" aria-label="Search" style={{ border: '1px solid #a0846c' }} />
                                <span className="input-group-text" style={{ backgroundColor: '#fff', border: '1px solid #a0846c' }}>
                                    <i className="fas fa-search" style={{ color: '#a0846c' }}></i>
                                </span>
                            </div>
                            <button className="btn" id="view" style={{ whiteSpace: 'nowrap' }}>Add</button>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l4.png" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" />Not Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l4.png" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" />Not Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l4.png" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" />Not Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" checked /> Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="note-card p-3 rounded d-flex gap-3">
                                <div className="image-wrapper">
                                    <img src="@/assets/images/topics/l4.png" alt="Notice Image" className="note-img" />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                                        <h6 className="date">Penrith, UK</h6>
                                        <p className="text-secondary small mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="small">
                                            <input type="checkbox" />Not Visited
                                        </label>
                                        <div className="d-flex gap-2">
                                            <button className="icon-btn" onClick="deleteNote">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="icon-btn" onClick="editNote">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

export default PhotographerPlans;
