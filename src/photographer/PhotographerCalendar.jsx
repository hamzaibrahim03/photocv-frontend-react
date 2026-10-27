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

export const STATUS_META = {
    confirmed: { label: 'Confirmed', bg: '#d7f3e3', color: '#1e8a4c' },
    pending: { label: 'Tentative', bg: '#fbf0c7', color: '#9a7b0a' },
    completed: { label: 'Completed', bg: '#e9e4df', color: '#6b5d53' },
    cancelled: { label: 'Cancelled', bg: '#fbd9df', color: '#b23a52' },
};
export function statusMeta(statusValue) {
    return STATUS_META[statusValue] || STATUS_META.pending;
}

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
        eventReminders: Array.isArray(b.event_reminders) ? b.event_reminders : [],
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
        gearLibraries: (b.gear_libraries || []).map((g) => ({ id: g.id, title: g.title })),
        gearLibraryIds: (b.gear_libraries || []).map((g) => g.id),
        attachments: (b.attachments || []).map((a) => ({ id: a.id, url: a.url, fileType: a.file_type })),
    };
}

function extractBookingList(payload) {
    const d = payload?.data ?? payload;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.original?.data)) return d.original.data;
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

    const formatTime = (timeStr) => {
        if (!timeStr) return "";

        if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
            const [hours, minutes] = timeStr.split(":").map(Number);

            if (hours > 23 || minutes > 59) return "";

            const date = new Date();
            date.setHours(hours, minutes, 0, 0);

            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }

        const date = new Date(timeStr);

        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

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
                                <div className="card bg-white border-0 rounded shadow-sm overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-center p-3 text-white" style={{ backgroundColor: '#3a2e26' }}>
                                        <button className="btn text-white" onClick={() => setMonthOffset(m => m - 1)}><i className="fas fa-chevron-left"></i></button>
                                        <h5 className="m-0">{monthLabel}</h5>
                                        <button className="btn text-white" onClick={() => setMonthOffset(m => m + 1)}><i className="fas fa-chevron-right"></i></button>
                                    </div>
                                    <div className="p-3">
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px' }} className="fw-medium text-muted">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', margin: '25px 50px' }}>
                                            {cells.map((d, idx) => {
                                                const hasBookings = d && bookingsByDay[d];
                                                const goToAddForDay = () => {
                                                    const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
                                                    const iso = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
                                                    navigate(`/calendar/create?date=${iso}`);
                                                };
                                                return (
                                                    <div key={idx}>
                                                        {d && (
                                                            <div className="border rounded p-2" style={{ minHeight: "80px", backgroundColor: hasBookings ? "#ffffff" : "transparent", cursor: hasBookings ? "default" : "pointer", textAlign: "left", }} onClick={hasBookings ? undefined : goToAddForDay} >
                                                                <div className="small" style={{ textAlign: "right", color: "#777" }} >
                                                                    {d}
                                                                </div>
                                                                {(bookingsByDay[d] || []).map((b) => {
                                                                    const meta = statusMeta(b.statusValue);
                                                                    return (
                                                                        <div key={b.id} onClick={(e) => { e.stopPropagation(); navigate(`/calendar/${b.id}`); }} title={`${b.title} - ${meta.label}`} style={{ backgroundColor: "#fbcaca", color: "#705050", borderRadius: "5px", padding: "4px 5px", marginTop: "5px", fontSize: "9px", lineHeight: "1.3", textAlign: "left", cursor: "pointer", overflow: "hidden", overflowWrap: "break-word", }} >
                                                                            <div style={{ fontWeight: "500" }}>
                                                                                {b.startTime ? formatTime(b.startTime) : "No time"}
                                                                            </div>

                                                                            <div style={{ fontWeight: "400" }}>
                                                                                {b.title}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="d-flex gap-4 flex-wrap mt-3 pt-3 border-top">
                                            {Object.entries(STATUS_META).map(([key, meta]) => (
                                                <div className="d-flex align-items-center gap-2" key={key}>
                                                    <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: meta.bg, border: `1px solid ${meta.color}`, display: 'inline-block' }}></span>
                                                    <small className="text-muted">{meta.label}</small>
                                                </div>
                                            ))}
                                        </div>
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
export default PhotographerCalendar;
