import React, { useState, useEffect } from 'react';

function PhotographerGear() {
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
                        <div className="dt-search">
                            <div className="input-group">
                                <span className="input-group-text" style={{ backgroundColor: '#fff', border: '1px solid #a0846c' }}>
                                    <i className="fas fa-search" style={{ color: '#a0846c' }}></i>
                                </span>
                                <input v-model="search" type="search" className="form-control" placeholder="Search" aria-label="Search" style={{ border: '1px solid #a0846c' }} />
                            </div>
                        </div>

                        <div className="button-group d-flex align-items-center gap-2">
                            <button className="btn d-flex align-items-center gap-2 px-3 py-2 text-white" style={{ backgroundColor: '#99816B' }}>
                                <i className="fas fa-sticky-note"></i> Note
                            </button>
                            <button className="btn d-flex align-items-center gap-2 px-3 py-2 text-white" style={{ backgroundColor: '#99816B' }}>
                                <i className="fas fa-list"></i> Add List
                            </button>
                            <button className="btn d-flex justify-center align-items-center" style={{ width: '43px', height: '43px', borderRadius: '8px', backgroundColor: '#EBE6E1', color: '#99816B' }}>
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ height: 'auto', padding: '15px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Recent Notices</h5>
                        <div className="d-flex align-items-center justify-content-between" style={{ gap: '10px' }}>
                            <div className="input-group" style={{ flex: '1' }}>
                                <input v-model="search" type="search" className="form-control" placeholder="Search" aria-label="Search" style={{ border: '1px solid #a0846c' }} />
                                <span className="input-group-text" style={{ backgroundColor: '#fff', border: '1px solid #a0846c' }}>
                                    <i className="fas fa-search" style={{ color: '#a0846c' }}></i>
                                </span>
                            </div>
                            <button className="btn" id="view" style={{ whiteSpace: 'nowrap' }}>View All</button>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '15px' }}>
                        <div className="col-md-4">
                            <div className="note-card p-3 rounded">
                                <h6 className="fw-bold mb-2">Class</h6>
                                <p className="text-secondary small mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                                </p>
                                <span className="badge mb-2">class</span>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">20 mins ago</small>
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

                        <div className="col-md-4">
                            <div className="note-card p-3 rounded">
                                <h6 className="fw-bold mb-2">Class</h6>
                                <p className="text-secondary small mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                                </p>
                                <span className="badge mb-2">class</span>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">20 mins ago</small>
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

                        <div className="col-md-4">
                            <div className="note-card p-3 rounded">
                                <h6 className="fw-bold mb-2">Class</h6>
                                <p className="text-secondary small mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                                </p>
                                <span className="badge mb-2">class</span>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">20 mins ago</small>
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

                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col-md-4">
                            <div className="note-card p-3 rounded">
                                <h6 className="fw-bold mb-2">Class</h6>
                                <p className="text-secondary small mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                                </p>
                                <span className="badge mb-2">class</span>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">20 mins ago</small>
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

                        <div className="col-md-4">
                            <div className="note-card p-3 rounded">
                                <h6 className="fw-bold mb-2">Class</h6>
                                <p className="text-secondary small mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                                </p>
                                <span className="badge mb-2">class</span>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">20 mins ago</small>
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

                        <div className="col-md-4">
                            <div className="note-card p-3 rounded" style={{ textAlign: 'center' }}>
                                <img src="@/assets/images/profile/icon.png" alt="Create Note" className="note-icon" />
                                <p className="note-label">Create New Note</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card" style={{ height: 'auto', padding: '15px', width: '95%' }}>
                            <h5 className="mb-3">Topics of Interest</h5>
                            <div className="topics-grid">
                                <div className="left-column">
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/photography.jpg" className="topic-img" />
                                        <span>Photography</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/animal.jpg" className="topic-img" />
                                        <span>Animal Photography</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/moon.jpg" className="topic-img" />
                                        <span>Moon Photography</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/night.jpg" className="topic-img" />
                                        <span>Night Photography</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/digital.jpg" className="topic-img" />
                                        <span>Digital Art</span>
                                    </div>
                                </div>
                                <div className="right-column">
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/nature.jpg" className="topic-img" />
                                        <span>Nature Photography</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/flower.jpg" className="topic-img" />
                                        <span>Flowers Photography</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/paint.jpg" className="topic-img" />
                                        <span>Paintings</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/sketch.jpg" className="topic-img" />
                                        <span>Sketches</span>
                                    </div>
                                    <div className="topic-item">
                                        <img src="@/assets/images/topics/abstract.jpg" className="topic-img" />
                                        <span>Abstract Art</span>
                                    </div>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn me-2" id="view">View All</button>
                                <button className="btn me-2" id="new">Add New</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card" style={{ height: 'auto', padding: '15px', width: '95%' }}>
                            <h5>Classes Log</h5>
                            <div className="event-items">
                                <div className="col-md-2">
                                    <img className="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                                </div>
                                <div className="col-md-6">
                                    <div className="event-details">
                                        <h5 className="names mb-1">Camera Focus</h5>
                                        <h5 className="text-secondary">Description</h5>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <h5 className="date">Feb 04, 2025 - Present </h5>
                                </div>
                            </div>
                            <div className="divider3"></div>

                            <div className="event-items">
                                <div className="col-md-2">
                                    <img className="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                                </div>
                                <div className="col-md-6">
                                    <div className="event-details">
                                        <h5 className="names mb-1">Camera Focus</h5>
                                        <h5 className="text-secondary">Description</h5>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <h5 className="date">Feb 04, 2025 - Present </h5>
                                </div>
                            </div>
                            <div className="divider3"></div>

                            <div className="event-items">
                                <div className="col-md-2">
                                    <img className="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                                </div>
                                <div className="col-md-6">
                                    <div className="event-details">
                                        <h5 className="names mb-1">Camera Focus</h5>
                                        <h5 className="text-secondary">Description</h5>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <h5 className="date">Feb 04, 2025 - Present </h5>
                                </div>
                            </div>
                            <div className="divider3"></div>

                            <div className="event-items">
                                <div className="col-md-2">
                                    <img className="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                                </div>
                                <div className="col-md-6">
                                    <div className="event-details">
                                        <h5 className="names mb-1">Camera Focus</h5>
                                        <h5 className="text-secondary">Description</h5>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <h5 className="date">Feb 04, 2025 - Present </h5>
                                </div>
                            </div>
                            <div className="divider3"></div>

                            <div className="button-group">
                                <button className="btn me-2" id="view">View All</button>
                                <button className="btn me-2" id="new">Add New</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PhotographerGear;
