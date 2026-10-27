import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll.jsx';
import apiClient from '../api/axios';
import { mapBookingFromApi, statusMeta } from './PhotographerCalendar';

function Field({ label, value }) {
    return (
        <div className="col-md-6 mb-3">
            <div className="text-danger small fw-medium">{label}</div>
            <div>{value || '—'}</div>
        </div>
    );
}

function Badge({ label, bg, color }) {
    if (!label) return <span>—</span>;
    return <span className="d-inline-block px-2 py-1 rounded" style={{ backgroundColor: bg, color, fontSize: '0.85em', fontWeight: '500' }}>{label}</span>;
}

const CONTRACT_META = {
    draft: { bg: '#e9e4df', color: '#6b5d53' },
    signed: { bg: '#d7f3e3', color: '#1e8a4c' },
    void: { bg: '#fbd9df', color: '#b23a52' },
};
const PAYMENT_META = {
    unpaid: { bg: '#e9e4df', color: '#6b5d53' },
    partial: { bg: '#fbf0c7', color: '#9a7b0a' },
    paid: { bg: '#d7f3e3', color: '#1e8a4c' },
};

function extractBookingList(payload) {
    const d = payload?.data ?? payload;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.original?.data)) return d.original.data;
    return [];
}

function PhotographerCalendarSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [rawBookings, setRawBookings] = useState([]);
    const [search, setSearch] = useState('');
    async function loadBookings() {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/booking');
            setRawBookings(extractBookingList(response.data));
        } catch (error) {
            console.error('Error loading bookings:', error);
            setRawBookings([]);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        loadBookings();
    }, []);
    useEffect(() => {
        loadBooking();
    }, [id]);

    async function loadBooking() {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/booking/${id}`);
            const data = response.data?.data || response.data;
            setBooking(mapBookingFromApi(data));
        } catch (error) {
            console.error('Error loading booking:', error);
            setBooking(null);
        } finally {
            setIsLoading(false);
        }
    }

    const bookings = useMemo(
        () => rawBookings.map((b) => ({
            title: b.title || '',
            clientName: b.client_name || '',
            eventDate: b.event_date || '',
        })),
        [rawBookings]
    );
    const daysToGo = useMemo(() => {
        const today = new Date();
        const upcoming = bookings
            .filter((b) => b.eventDate)
            .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        const nextBooking = upcoming.find((b) => new Date(b.eventDate) >= today);
        return nextBooking ? Math.max(0, Math.ceil((new Date(nextBooking.eventDate) - today) / 86400000)) : 0;
    }, [bookings]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this booking?')) return;
        try {
            await apiClient.delete(`/booking/${id}`);
            navigate('/calendar');
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && !booking && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Calendar" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="card bg-white border-0 rounded shadow-sm p-5 mt-4 text-center text-muted">
                                    Booking not found.
                                    <div className="mt-3"><button className="btn" id="edit" onClick={() => navigate('/calendar')}>Back to Calendar</button></div>
                                </div>
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
            {!isLoading && booking && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Calendar" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <h4 className="head m-0">Booking Calendar</h4>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex justify-content-between">
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className='ca-details'>Total Events</small>
                                            <h3 className="number">{String(bookings.length).padStart(2, '0')}</h3>
                                        </div>
                                        <div className="event-cards">
                                            <small className='ca-details'>Next Event</small>
                                            <div className="row align-items-center">
                                                <div className="col-md-5">
                                                    <h3 className="number">{String(daysToGo).padStart(2, '0')}</h3>
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

                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div>
                                            <h4 className="head m-0">{booking.title}</h4>
                                            <small className="text-muted">{booking.code}</small> &nbsp;
                                            <span className="d-inline-block px-2 py-1 rounded" style={{ backgroundColor: '#eee', color: '#333', fontSize: '0.85em', fontWeight: '500' }}>{booking.type}</span> &nbsp;
                                            <Badge label={statusMeta(booking.statusValue).label} bg={statusMeta(booking.statusValue).bg} color={statusMeta(booking.statusValue).color} />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate(`/calendar/${booking.id}/edit`)}><i className="fas fa-edit me-1"></i>Edit</button>
                                            <button className="btn" style={{ border: '1px solid #cc445e', color: '#cc445e' }} onClick={handleDelete}><i className="fas fa-trash-alt me-1"></i>Delete</button>
                                            <button className="btn" id="e-view" onClick={() => navigate('/calendar')}>Close</button>
                                        </div>
                                    </div>

                                    <h6 className="head mt-5 mb-5">Client Information</h6>
                                    <div className="row">
                                        <Field label="Client Name" value={booking.clientName} />
                                        <Field label="Contact Number" value={booking.contactNumber} />
                                        <Field label="Email Address" value={booking.email} />
                                        <Field label="Secondary Contact Number" value={booking.secondaryContact} />
                                        <div className="col-md-12 mb-3"><div className="text-danger small fw-medium">Address/Venue</div><div>{booking.address}</div></div>
                                    </div>

                                    <h6 className="head mb-3 mt-2">Booking Schedule</h6>
                                    <div className="row">
                                        <Field label="Event Date" value={booking.eventDate} />
                                        <Field label="Pre-Event Meeting Date" value={booking.preMeetingDate} />
                                        <Field label="Start Time" value={booking.startTime} />
                                        <Field label="End Time" value={booking.endTime} />
                                        <div className="col-md-6 mb-3">
                                            <div className="text-danger small fw-medium">Set Reminder for Event</div>
                                            <div>{booking.reminderEvent ? 'Yes' : 'No'}</div>
                                            {booking.eventReminders.length > 0 && (
                                                <ul className="mb-0 ps-3 small text-muted">
                                                    {booking.eventReminders.map((d, i) => <li key={i}>{d} days before event</li>)}
                                                </ul>
                                            )}
                                        </div>
                                        <Field label="Set Reminder for Pre-Event" value={booking.reminderPreEvent ? 'Yes' : 'No'} />
                                    </div>

                                    <h6 className="head mb-3 mt-2">Services & Deliverables</h6>
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <div className="text-danger small fw-medium">Services Included</div>
                                            {(booking.services || []).map(s => <div key={s}><i className="fas fa-check text-success me-2"></i>{s}</div>)}
                                        </div>
                                        <Field label="Shoot Locations" value={booking.shootLocations} />
                                        <Field label="Deliverables" value={booking.deliverables} />
                                        <div className="col-md-12 mb-3"><div className="text-danger small fw-medium">Special Requirements</div><div>{booking.specialRequirements}</div></div>
                                    </div>

                                    <h6 className="head mb-3 mt-2">Notes & Communication</h6>
                                    <div className="row">
                                        <Field label="Internal Notes" value={booking.internalNotes} />
                                        <Field label="Client Notes" value={booking.clientNotes} />
                                        <div className="col-md-6 mb-3">
                                            <div className="text-danger small fw-medium">Contract Status</div>
                                            <Badge label={booking.contractStatus} {...(CONTRACT_META[booking.contractStatusValue] || {})} />
                                        </div>
                                        {booking.attachments.length > 0 && (
                                            <div className="col-md-12 mb-3">
                                                <div className="text-danger small fw-medium">Attachments</div>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {booking.attachments.map((a) => (
                                                        <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="d-inline-block px-2 py-1 rounded" style={{ backgroundColor: '#eee', color: '#333', textDecoration: 'none', fontSize: '0.85em', fontWeight: '500' }}>
                                                            <i className="fas fa-paperclip me-1"></i>{a.fileType}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <h6 className="head mb-3 mt-2">Payment Tracking</h6>
                                    <div className="row">
                                        <Field label="Total Cost" value={booking.totalCost ? `£ ${booking.totalCost}` : ''} />
                                        <Field label="Deposit Received" value={booking.depositReceived ? `£ ${booking.depositReceived}` : ''} />
                                        <Field label="Remaining Balance" value={(booking.totalCost || booking.depositReceived) ? `£ ${(Number(booking.totalCost || 0) - Number(booking.depositReceived || 0))}` : ''} />
                                        <div className="col-md-6 mb-3">
                                            <div className="text-danger small fw-medium">Payment Status</div>
                                            <Badge label={booking.paymentStatus} {...(PAYMENT_META[booking.paymentStatusValue] || {})} />
                                        </div>
                                        <Field label="Payment Due Date" value={booking.paymentDueDate} />
                                        <Field label="Payment Method" value={booking.paymentMethod} />
                                        <Field label="Invoice Number" value={booking.invoiceNumber} />
                                    </div>

                                    <h6 className="head mb-3 mt-2">Gear Planning (Optional)</h6>
                                    <div className="row">
                                        {booking.gearLibraries.length > 0 && (
                                            <div className="col-md-12 mb-3">
                                                <div className="text-danger small fw-medium">Gear Libraries</div>
                                                {booking.gearLibraries.map(g => <div key={g.id}><i className="fas fa-check text-success me-2"></i>{g.title}</div>)}
                                            </div>
                                        )}
                                        <div className="col-md-12 mb-3">
                                            <div className="text-danger small fw-medium">Gear Checklist</div>
                                            {booking.gearChecklist ? <div className="text-decoration-underline">{booking.gearChecklist}</div> : '—'}
                                        </div>
                                        <Field label="Backup Gear Needed" value={booking.backupGear ? 'Yes' : 'No'} />
                                    </div>
                                    <div className='button-group'>
                                        <button className="btn" id="edit" onClick={() => navigate(`/calendar/${booking.id}/edit`)}>Edit</button>
                                        <button className="btn" id="e-view" onClick={() => navigate(-1)}>Back</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
        </>
    );
}
export default PhotographerCalendarSingle;
