import React, { useState } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import icon1 from '../assets/images/profile/icon.png';
import c1 from '../assets/images/dashboard/c1.jpg';
function LearningNotes() {
    const [user] = useState({
        first_name: 'Photographer',
        profile_image: '/placeholder.jpg'
    });
    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState([
        {
            title: 'Camera Focus',
            description: 'Lorem ipsum dolor sit amet...',
            time: '20 mins ago'
        },
        {
            title: 'Shutter Speed in Photography',
            description: 'Lorem ipsum...',
            time: '30 mins ago'
        },
        {
            title: 'Exposure in Photography',
            description: 'Lorem ipsum...',
            time: '50 mins ago'
        },
        {
            title: 'Camera Lenses and Focal Length',
            description: 'Lorem ipsum...',
            time: '4 hours ago'
        },
        {
            title: 'Understanding Light',
            description: 'Lorem ipsum...',
            time: '1 day ago'
        }
    ]);
    const [selectedNote, setSelectedNote] = useState({
        title: 'Exposure in Photography',
        content: 'Exposure in photography refers to the amount of light...',
        image: c1,
        tag: 'Exposure'
    });
    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Profile" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                        <div className="profile-left d-flex align-items-center gap-3">
                            <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                            <div className="profile-info">
                                <h2 className="name m-0 text-dark head">{user.first_name}</h2>
                            </div>
                        </div>
                        <div className="profile-icons d-flex flex-column gap-2 text-danger">
                            <div className="icon d-flex align-items-center gap-2"><span>20</span><i className="fas fa-comments"></i></div>
                            <div className="icon d-flex align-items-center gap-2"><span>53</span><i className="fas fa-desktop"></i></div>
                            <div className="icon d-flex align-items-center gap-2"><span>39</span><i className="fas fa-users"></i></div>
                        </div>
                    </div>
                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>My Photos</small>
                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>21</h3>
                        </div>
                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                            <div className="row mt-4 align-items-center">
                                <div className="col-md-5">
                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>99</h3>
                                </div>
                                <div className="days col-md-7 text-start">
                                    <span>Likes & Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card bg-white mt-4 border-0 p-3 rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="dt-search" style={{ width: '300px' }}>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0" style={{ borderColor: '#a0846c' }}><i className="fas fa-search" style={{ color: '#a0846c' }}></i></span>
                                <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="form-control border-start-0 shadow-none" placeholder="Search" style={{ borderColor: '#a0846c' }} />
                            </div>
                        </div>
                        <div className="button-group d-flex align-items-center gap-2">
                            <button className="btn d-flex align-items-center gap-2 px-3 py-2 text-white border-0" style={{ backgroundColor: '#99816B' }}>
                                <i className="fas fa-sticky-note"></i> Note
                            </button>
                            <button className="btn d-flex align-items-center gap-2 px-3 py-2 text-white border-0" style={{ backgroundColor: '#99816B' }}>
                                <i className="fas fa-list"></i> Add List
                            </button>
                            <button className="btn d-flex justify-content-center align-items-center border-0" style={{ width: '43px', height: '43px', borderRadius: '8px', backgroundColor: '#EBE6E1', color: '#99816B' }}>
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="notes-app d-flex mt-4 bg-white rounded shadow-sm overflow-hidden" style={{ height: '70vh' }}>
                    <aside className="sidebars overflow-auto" style={{ width: '400px', backgroundColor: '#ede5dd', borderRight: '1px solid #ddd' }}>
                        <div className="p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">My Notes</h5>
                                <span className="text-muted small">{notes.length} Notes</span>
                            </div>
                            {notes.map((note, index) => (
                                <div key={index} className={`note-preview p-3 rounded mb-3 bg-white position-relative ${note.title === selectedNote.title ? 'shadow' : ''}`} style={{ borderLeft: '3px solid #a0846c', cursor: 'pointer' }} onClick={() => setSelectedNote({ ...note, image: c1, tag: 'Other' })}>
                                    <h6 className="head mb-1">{note.title}</h6>
                                    <p className="text-secondary small mb-2">{note.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="badge bg-light text-dark small border">{note.time}</span>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-link text-secondary p-0"><i className="fas fa-trash-alt"></i></button>
                                            <button className="btn btn-sm btn-link text-secondary p-0"><i className="fas fa-edit"></i></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="note-preview p-4 rounded text-center bg-white" style={{ borderLeft: '3px solid #a0846c', cursor: 'pointer' }}>
                                <img src={icon1} alt="Create Note" className="mb-2" style={{ width: '32px' }} />
                                <p className="m-0 text-muted">Create New Note</p>
                            </div>
                        </div>
                    </aside>
                    <main className="editor flex-grow-1 p-4 overflow-auto bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="small text-muted">Last edited on Feb 7, 2025</span>
                            <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }}>Share</button>
                        </div>
                        <input
                            className="form-control form-control-lg head border-0 bg-transparent px-0 mb-3 fs-3 shadow-none"
                            style={{ color: '#333' }}
                            value={selectedNote.title}
                            onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                            placeholder="Note Title"
                        />
                        <div className="editor-container border rounded mb-3">
                            <div id="toolbar" className="bg-light p-2 border-bottom d-flex gap-2 flex-wrap text-secondary">
                                <i className="fas fa-bold cursor-pointer p-1"></i>
                                <i className="fas fa-italic cursor-pointer p-1"></i>
                                <i className="fas fa-underline cursor-pointer p-1"></i>
                                <i className="fas fa-strikethrough cursor-pointer p-1"></i>
                                <div className="border-end mx-1"></div>
                                <i className="fas fa-align-left cursor-pointer p-1"></i>
                                <i className="fas fa-align-center cursor-pointer p-1"></i>
                                <i className="fas fa-align-right cursor-pointer p-1"></i>
                                <div className="border-end mx-1"></div>
                                <i className="fas fa-list-ol cursor-pointer p-1"></i>
                                <i className="fas fa-list-ul cursor-pointer p-1"></i>
                            </div>
                            <textarea
                                className="form-control border-0 p-3 shadow-none"
                                rows="8"
                                value={selectedNote.content}
                                onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                                placeholder="Start writing your note..."
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>
                        <div className="note-image my-4">
                            <img src={selectedNote.image} alt="Note Attachment" className="img-fluid rounded w-100" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                        </div>
                        <div className="d-flex gap-2 mt-4">
                            <span className="badge bg-secondary px-3 py-2">{selectedNote.tag}</span>
                        </div>
                    </main>
                </div>
            </section>
        </div>
    );
};
export default LearningNotes;
