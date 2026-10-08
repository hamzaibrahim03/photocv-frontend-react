import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll.jsx';
import apiClient from '../api/axios';

export function titleCase(str) {
    if (!str) return '';
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

// Maps a Booking API resource (snake_case, as returned by GET /booking and
// GET /booking/{id}) into the camelCase shape the existing UI renders.
export function mapBookingFromApi(b) {
    if (!b) return null;
    return {
        id: b.id,
        code: `BK-${String(b.id).padStart(4, '0')}`,
        title: b.title || '',
        type: b.booking_type?.title || '',
        bookingTypeId: b.booking_type?.id ?? '',
        leadSource: b.lead_source?.title || '',
        leadSourceId: b.lead_source?.id ?? '',
        status: titleCase(b.booking_status),
        statusValue: b.booking_status || 'pending',
        clientName: b.client_name || '',
        contactNumber: b.contact_number || '',
        email: b.email || '',
        secondaryContact: b.secondary_contact_number || '',
        address: b.address || '',
        eventDate: b.event_date || '',
        preMeetingDate: b.pre_event_meeting_date || '',
        startTime: b.start_time || '',
        endTime: b.end_time || '',
        reminderEvent: !!b.set_reminder,
        reminderPreEvent: !!b.pre_event_reminder,
        services: (b.services || []).map((s) => s.title),
        serviceIds: (b.services || []).map((s) => s.id),
        shootLocations: b.location || '',
        deliverables: b.deliverables || '',
        specialRequirements: b.special_requirements || '',
        internalNotes: b.internal_notes || '',
        clientNotes: b.client_notes || '',
        contractStatus: titleCase(b.contract_status),
        contractStatusValue: b.contract_status || 'draft',
        totalCost: b.total_cost ?? '',
        depositReceived: b.deposit_received ?? '',
        remainingBalance: b.remaining_balance ?? '',
        paymentStatus: titleCase(b.payment_status),
        paymentStatusValue: b.payment_status || 'unpaid',
        paymentDueDate: b.payment_due_date || '',
        paymentMethod: b.payment_method || '',
        invoiceNumber: b.invoice_number || '',
        gearChecklist: b.requirements || '',
        backupGear: !!b.backup_gear_needed,
    };
}

// The booking list endpoint wraps a DataTables payload inside the standard
// { success, message, data } envelope, so the array can live at
// response.data.data (plain array) or response.data.data.data (DataTables).
function extractBookingList(payload) {
    const d = payload?.data ?? payload;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    return [];
}

function PhotographerCalendar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [monthOffset, setMonthOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rawBookings, setRawBookings] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

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

    const bookings = useMemo(() => rawBookings.map(mapBookingFromApi).filter(Boolean), [rawBookings]);

    const today = new Date();
    const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const monthLabel = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const startWeekday = viewDate.getDay();

    const bookingsByDay = useMemo(() => {
        const map = {};
        bookings.forEach(b => {
            if (!b.eventDate) return;
            const d = new Date(b.eventDate);
            if (d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth()) {
                map[d.getDate()] = map[d.getDate()] || [];
                map[d.getDate()].push(b);
            }
        });
        return map;
    }, [bookings, viewDate]);

    const filtered = bookings.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.clientName.toLowerCase().includes(search.toLowerCase()));
    const upcoming = [...filtered].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    const nextBooking = upcoming.find(b => new Date(b.eventDate) >= today);
    const daysToGo = nextBooking ? Math.max(0, Math.ceil((new Date(nextBooking.eventDate) - today) / 86400000)) : 0;

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Calendar" />
                    <div className="content">
                        <div className="d-flex gap-3 py-4 flex-wrap">
                            <div className="bg-white shadow-sm p-4 rounded flex-grow-1 d-flex justify-content-between align-items-center">
                                <h4 className="head m-0">Booking Calendar</h4>
                                <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '260px', border: '1px solid #a0846c' }} />
                            </div>
                            <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px' }}>
                                <small style={{ fontSize: '18px' }}>Total Events</small>
                                <h3 className="number mt-2" style={{ fontSize: '40px' }}>{String(bookings.length).padStart(2, '0')}</h3>
                            </div>
                            <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#3a2e26', width: '219px' }}>
                                <small style={{ fontSize: '18px' }}>Next Event</small>
                                <h3 className="number mt-2" style={{ fontSize: '40px' }}>{String(daysToGo).padStart(2, '0')} <span style={{ fontSize: '14px' }}>days to go</span></h3>
                            </div>
                        </div>

                        <div className="card bg-white border-0 rounded shadow-sm overflow-hidden">
                            <div className="d-flex justify-content-between align-items-center p-3 text-white" style={{ backgroundColor: '#3a2e26' }}>
                                <button className="btn text-white" onClick={() => setMonthOffset(m => m - 1)}><i className="fas fa-chevron-left"></i></button>
                                <h5 className="m-0">{monthLabel}</h5>
                                <button className="btn text-white" onClick={() => setMonthOffset(m => m + 1)}><i className="fas fa-chevron-right"></i></button>
                            </div>
                            <div className="p-3">
                                <div className="row text-center fw-medium text-muted mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div className="col" key={d}>{d}</div>)}
                                </div>
                                <div className="row row-cols-7 g-2">
                                    {cells.map((d, idx) => (
                                        <div className="col" key={idx}>
                                            {d && (
                                                <div className="border rounded p-2" style={{ minHeight: '70px', backgroundColor: bookingsByDay[d] ? '#f3e9e0' : 'transparent' }}>
                                                    <div className="small">{d}</div>
                                                    {(bookingsByDay[d] || []).map(b => (
                                                        <div key={b.id} className="small text-truncate text-white rounded px-1 mt-1" style={{ backgroundColor: '#cc445e', cursor: 'pointer' }} onClick={() => navigate(`/calendar/${b.id}`)}>{b.title}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="head m-0">Bookings</h5>
                                <button className="btn text-white" style={{ backgroundColor: '#3a2e26' }} onClick={() => navigate('/calendar/create')}>+ Add Booking</button>
                            </div>
                            {upcoming.length === 0 && <p className="text-muted">No bookings yet.</p>}
                            {upcoming.map(b => (
                                <div key={b.id} className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ cursor: 'pointer' }} onClick={() => navigate(`/calendar/${b.id}`)}>
                                    <div>
                                        <h6 className="head mb-0">{b.title}</h6>
                                        <small className="text-muted">{b.clientName} &middot; {b.eventDate}</small>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: '#e7f6ec', color: '#1e8a4c' }}>{b.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export default PhotographerCalendar;
