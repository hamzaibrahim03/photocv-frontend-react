import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll.jsx';
import apiClient from '../api/axios';

const CATALOG_API_BASE = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1';

const REMINDER_SLOT_COUNT = 5;
const DEFAULT_REMINDER_DAYS = [30, 14, 7, 3, 1];
const REMINDER_UNITS = ['minutes', 'hours', 'days', 'weeks'];
const UNIT_TO_DAYS = { minutes: 1 / 1440, hours: 1 / 24, days: 1, weeks: 7 };

function reminderDaysToSlots(days) {
    return Array.from({ length: REMINDER_SLOT_COUNT }, (_, i) => ({
        enabled: i < (days?.length || 0),
        value: days?.[i] ?? DEFAULT_REMINDER_DAYS[i],
        unit: 'days',
    }));
}
function reminderSlotsToDays(slots) {
    return slots
        .filter((s) => s.enabled)
        .map((s) => Math.round((Number(s.value) || 0) * (UNIT_TO_DAYS[s.unit] || 1)));
}

const emptyForm = {
    title: '', bookingTypeId: '', leadSourceId: '', status: 'pending',
    clientName: '', contactNumber: '', email: '', secondaryContact: '', address: '',
    eventDate: '', preMeetingDate: '', startTime: '', endTime: '', reminderEvent: false, reminderPreEvent: false,
    reminderSlots: reminderDaysToSlots([]),
    serviceIds: [], shootLocations: '', deliverables: '', specialRequirements: '',
    internalNotes: '', clientNotes: '', contractStatus: 'draft',
    totalCost: '', depositReceived: '', paymentStatus: 'unpaid', paymentDueDate: '', paymentMethod: '', invoiceNumber: '',
    gearChecklist: '', backupGear: false, gearLibraryIds: [],
};

function mapApiToForm(b) {
    return {
        title: b.title || '',
        bookingTypeId: b.booking_type?.id ?? '',
        leadSourceId: b.lead_source?.id ?? '',
        status: b.booking_status || 'pending',
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
        reminderSlots: reminderDaysToSlots(b.event_reminders),
        reminderPreEvent: !!b.pre_event_reminder,
        serviceIds: (b.services || []).map((s) => s.id),
        shootLocations: b.location || '',
        deliverables: b.deliverables || '',
        specialRequirements: b.special_requirements || '',
        internalNotes: b.internal_notes || '',
        clientNotes: b.client_notes || '',
        contractStatus: b.contract_status || 'draft',
        totalCost: b.total_cost ?? '',
        depositReceived: b.deposit_received ?? '',
        paymentStatus: b.payment_status || 'unpaid',
        paymentDueDate: b.payment_due_date || '',
        paymentMethod: b.payment_method || '',
        invoiceNumber: b.invoice_number || '',
        gearChecklist: b.requirements || '',
        backupGear: !!b.backup_gear_needed,
        gearLibraryIds: (b.gear_libraries || []).map((g) => g.id),
    };
}

function extractBookingList(payload) {
    const d = payload?.data ?? payload;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.original?.data)) return d.original.data;
    return [];
}

function PhotographerCalendarAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const prefilledDate = !id ? searchParams.get('date') || '' : '';
    const [form, setForm] = useState({ ...emptyForm, eventDate: prefilledDate });
    const [catalogOptions, setCatalogOptions] = useState({ booking_type: [], lead_source: [], service_type: [] });
    const [gearLibraries, setGearLibraries] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [rawBookings, setRawBookings] = useState([]);
    const [showAttachNotes, setShowAttachNotes] = useState(false);
    const [attachNotes, setAttachNotes] = useState([]);
    const [attachNotesSearch, setAttachNotesSearch] = useState('');
    const [attachNotesLoading, setAttachNotesLoading] = useState(false);

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
        async function loadCatalogOptions() {
            try {
                const response = await fetch(`${CATALOG_API_BASE}/club/public/catalog/all-grouped`, {
                    headers: { Accept: 'application/json' },
                });
                const json = await response.json();
                setCatalogOptions(json?.data || {});
            } catch (err) {
                console.error('Error loading catalog options:', err);
            }
        }
        loadCatalogOptions();
        loadGearLibraries();
    }, []);

    async function loadGearLibraries() {
        try {
            const response = await apiClient.get('/gear-libraries');
            const list = response.data?.data || response.data;
            setGearLibraries(Array.isArray(list) ? list : (list?.data || []));
        } catch (err) {
            console.error('Error loading gear libraries:', err);
        }
    }

    useEffect(() => {
        if (!id) return;
        async function loadBooking() {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/booking/${id}`);
                const data = response.data?.data || response.data;
                setForm({ ...emptyForm, ...mapApiToForm(data) });
                setExistingAttachments(data.attachments || []);
            } catch (err) {
                console.error('Error loading booking:', err);
                setError('Failed to load booking.');
            } finally {
                setIsLoading(false);
            }
        }
        loadBooking();
    }, [id]);

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

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    const toggleService = (serviceId) => {
        setForm(prev => ({
            ...prev,
            serviceIds: prev.serviceIds.includes(serviceId)
                ? prev.serviceIds.filter(s => s !== serviceId)
                : [...prev.serviceIds, serviceId],
        }));
    };
    const toggleGearLibrary = (libraryId) => {
        setForm(prev => ({
            ...prev,
            gearLibraryIds: prev.gearLibraryIds.includes(libraryId)
                ? prev.gearLibraryIds.filter(g => g !== libraryId)
                : [...prev.gearLibraryIds, libraryId],
        }));
    };
    const openAttachNotes = async () => {
        setShowAttachNotes(true);
        setAttachNotesLoading(true);
        try {
            const response = await apiClient.get('/cheat-sheets');
            const payload = response.data?.data;
            const list = Array.isArray(payload) ? payload : payload?.data || [];
            setAttachNotes(list);
        } catch (err) {
            console.error('Error loading notes:', err);
            setAttachNotes([]);
        } finally {
            setAttachNotesLoading(false);
        }
    };
    const attachNoteToInternal = (note) => {
        const chunk = `${note.title || ''}\n${note.notes || note.description || ''}`.trim();
        setForm(prev => ({ ...prev, internalNotes: prev.internalNotes ? `${prev.internalNotes}\n\n${chunk}` : chunk }));
        setShowAttachNotes(false);
    };

    const updateReminderSlot = (index, patch) => {
        setForm(prev => ({
            ...prev,
            reminderSlots: prev.reminderSlots.map((slot, i) => i === index ? { ...slot, ...patch } : slot),
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        const fields = {
            title: form.title,
            booking_type_id: form.bookingTypeId || '',
            lead_source_id: form.leadSourceId || '',
            booking_status: form.status,
            client_name: form.clientName,
            email: form.email,
            contact_number: form.contactNumber,
            secondary_contact_number: form.secondaryContact,
            address: form.address,
            event_date: form.eventDate,
            pre_event_meeting_date: form.preMeetingDate,
            start_time: form.startTime,
            end_time: form.endTime,
            set_reminder: form.reminderEvent ? '1' : '0',
            pre_event_reminder: form.reminderPreEvent ? '1' : '0',
            location: form.shootLocations,
            deliverables: form.deliverables,
            special_requirements: form.specialRequirements,
            internal_notes: form.internalNotes,
            client_notes: form.clientNotes,
            contract_status: form.contractStatus,
            requirements: form.gearChecklist,
            total_cost: form.totalCost,
            deposit_received: form.depositReceived,
            payment_status: form.paymentStatus,
            payment_due_date: form.paymentDueDate,
            payment_method: form.paymentMethod,
            invoice_number: form.invoiceNumber,
            backup_gear_needed: form.backupGear ? '1' : '0',
        };

        const payload = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') payload.append(key, value);
        });
        form.serviceIds.forEach((sid) => payload.append('service_ids[]', sid));
        form.gearLibraryIds.forEach((gid) => payload.append('gear_library_ids[]', gid));
        reminderSlotsToDays(form.reminderSlots).forEach((days) => payload.append('event_reminders[]', days));
        attachmentFiles.forEach((file) => payload.append('attachments[]', file));
        if (id) payload.append('_method', 'PUT');

        const multipartConfig = { headers: { 'Content-Type': undefined } };

        try {
            if (id) {
                await apiClient.post(`/booking/${id}`, payload, multipartConfig);
                navigate(`/calendar/${id}`);
            } else {
                const response = await apiClient.post('/booking', payload, multipartConfig);
                const created = response.data?.data || response.data;
                navigate(created?.id ? `/calendar/${created.id}` : '/calendar');
            }
        } catch (err) {
            console.error('Error saving booking:', err);
            const apiErrors = err.response?.data?.errors;
            const firstError = apiErrors ? Object.values(apiErrors)[0]?.[0] : null;
            setError(firstError || err.response?.data?.message || 'Failed to save booking. Please check the form and try again.');
        } finally {
            setIsSaving(false);
        }
    };

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
                                <div className="card bg-white border-0 rounded shadow-sm mt-4" style={{ padding: '40px 80px' }}>
                                    <h4 className="head mt-5 mb-5">{id ? 'Edit Booking' : 'New Booking'}</h4>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <form onSubmit={handleSave}>
                                        <div className='row'>
                                            <div className='col-md-8'>
                                                <h6 className="head mt-5 mb-5">Basic Booking Information</h6>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Booking Title</label>
                                                        <input className="form-control" placeholder="Text here..." value={form.title} onChange={(e) => update('title', e.target.value)} required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Booking Type</label>
                                                        <select className="form-select" value={form.bookingTypeId} onChange={(e) => update('bookingTypeId', e.target.value)} required>
                                                            <option value="">- Select -</option>
                                                            {(catalogOptions.booking_type || []).map(opt => (
                                                                <option key={opt.id} value={opt.id}>{opt.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Lead Source</label>
                                                        <select className="form-select" value={form.leadSourceId} onChange={(e) => update('leadSourceId', e.target.value)} required>
                                                            <option value="">- Select -</option>
                                                            {(catalogOptions.lead_source || []).map(opt => (
                                                                <option key={opt.id} value={opt.id}>{opt.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Booking Status</label>
                                                        <select className="form-select" value={form.status} onChange={(e) => update('status', e.target.value)}>
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <h6 className="head mt-5 mb-5">Client Information</h6>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Client Name</label>
                                                        <input className="form-control" type='text' value={form.clientName} onChange={(e) => update('clientName', e.target.value)} required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Contact Number</label>
                                                        <input className="form-control" type='phone' value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Email Address</label>
                                                        <input type="email" className="form-control" value={form.email} onChange={(e) => update('email', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Secondary Contact Number</label>
                                                        <input className="form-control" type='phone' value={form.secondaryContact} onChange={(e) => update('secondaryContact', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-12">
                                                        <label className="form-label">Address/Venue</label>
                                                        <textarea className="form-control" rows="2" value={form.address} onChange={(e) => update('address', e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                </div>

                                                <h6 className="head mt-5 mb-5">Booking Schedule</h6>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Event Date</label>
                                                        <input type="date" className="form-control" value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Pre-Event Meeting Date</label>
                                                        <input type="date" className="form-control" value={form.preMeetingDate} onChange={(e) => update('preMeetingDate', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Start Time</label>
                                                        <input type="time" className="form-control" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">End Time</label>
                                                        <input type="time" className="form-control" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6 d-flex align-items-center gap-2">
                                                        <label className="form-label m-0">Set Reminder for Event</label>
                                                        <input type="checkbox" checked={form.reminderEvent} onChange={(e) => update('reminderEvent', e.target.checked)} />
                                                    </div>
                                                </div>
                                                {form.reminderEvent && (
                                                    <div className="col-md-12">
                                                        {form.reminderSlots.map((slot, idx) => (
                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #e4d9cc', borderRadius: '8px', padding: '14px 18px', marginBottom: '12px', opacity: slot.enabled ? 1 : 0.55, }} >
                                                                <input type="checkbox" checked={slot.enabled} onChange={(e) => updateReminderSlot(idx, { enabled: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#99816b', cursor: 'pointer' }} />
                                                                <span style={{ minWidth: '90px', fontWeight: '500', color: '#3a2e26' }}>Reminder {idx + 1}</span>
                                                                <input type="number" min="0" value={slot.value} disabled={!slot.enabled} onChange={(e) => updateReminderSlot(idx, { value: e.target.value })} style={{ width: '70px', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 10px', textAlign: 'center', }} />
                                                                <select value={slot.unit} disabled={!slot.enabled} onChange={(e) => updateReminderSlot(idx, { unit: e.target.value })} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px 10px', minWidth: '110px', color: '#3a2e26', }} >
                                                                    {REMINDER_UNITS.map((u) => (
                                                                        <option key={u} value={u}>{u}</option>
                                                                    ))}
                                                                </select>
                                                                <span style={{ color: '#9a9a9a', fontSize: '14px' }}>{slot.value} {slot.unit} before</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6 d-flex align-items-center gap-2">
                                                        <label className="form-label m-0">Set Reminder for Pre-Event</label>
                                                        <input type="checkbox" checked={form.reminderPreEvent} onChange={(e) => update('reminderPreEvent', e.target.checked)} />
                                                    </div>
                                                </div>

                                                <h6 className="head mt-5 mb-5">Services & Deliverables</h6>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Services Included</label>
                                                        <div className="d-flex gap-3 flex-wrap">
                                                            {(catalogOptions.service_type || []).map(opt => (
                                                                <label key={opt.id} className="d-flex align-items-center gap-2">
                                                                    <input type="checkbox" checked={form.serviceIds.includes(opt.id)} onChange={() => toggleService(opt.id)} /> {opt.name}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Shoot Locations</label>
                                                        <textarea className="form-control" rows="2" value={form.shootLocations} onChange={(e) => update('shootLocations', e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Deliverables</label>
                                                        <textarea className="form-control" rows="2" value={form.deliverables} onChange={(e) => update('deliverables', e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-12">
                                                        <label className="form-label">Special Requirements</label>
                                                        <textarea className="form-control" rows="2" value={form.specialRequirements} onChange={(e) => update('specialRequirements', e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                </div>

                                                <h6 className="head mt-5 mb-5">Notes & Communication</h6>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label d-flex align-items-center justify-content-between">
                                                            Internal Notes
                                                            <button type="button" className="btn" id="e-view" onClick={openAttachNotes}>
                                                                <i className="fas fa-paperclip me-1"></i>Attach from Notes
                                                            </button>
                                                        </label>
                                                        <textarea className="form-control" rows="2" value={form.internalNotes} onChange={(e) => update('internalNotes', e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Client Notes</label>
                                                        <textarea className="form-control" rows="2" value={form.clientNotes} onChange={(e) => update('clientNotes', e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Contract Status</label>
                                                        <select className="form-select" value={form.contractStatus} onChange={(e) => update('contractStatus', e.target.value)}>
                                                            <option value="draft">Draft</option>
                                                            <option value="signed">Signed</option>
                                                            <option value="void">Void</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">File Attachment</label>
                                                        <input type="file" className="form-control" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []))} />
                                                        {attachmentFiles.length > 0 && <small className="text-muted d-block mt-1">{attachmentFiles.length} new file(s) selected</small>}
                                                        {existingAttachments.length > 0 && (
                                                            <div className="mt-2 d-flex flex-wrap gap-2">
                                                                {existingAttachments.map((a) => (
                                                                    <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="d-inline-block px-2 py-1 rounded" style={{ backgroundColor: '#eee', color: '#333', textDecoration: 'none', fontSize: '0.85em', fontWeight: '500' }}>
                                                                        <i className="fas fa-paperclip me-1"></i>{a.file_type}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <h6 className="head mt-5 mb-5">Payment Tracking</h6>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Total Cost</label>
                                                        <input type="number" className="form-control" value={form.totalCost} onChange={(e) => update('totalCost', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Deposit Received</label>
                                                        <input type="number" className="form-control" value={form.depositReceived} onChange={(e) => update('depositReceived', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className='col-md-6'>
                                                        <label className='form-label'>Remaining Balance</label>
                                                        <input type="number" className="form-control" value={(Number(form.totalCost) || 0) - (Number(form.depositReceived) || 0)} readOnly />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Payment Status</label>
                                                        <select className="form-select" value={form.paymentStatus} onChange={(e) => update('paymentStatus', e.target.value)}>
                                                            <option value="unpaid">Unpaid</option>
                                                            <option value="partial">Partial</option>
                                                            <option value="paid">Paid</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Payment Due Date</label>
                                                        <input type="date" className="form-control" value={form.paymentDueDate} onChange={(e) => update('paymentDueDate', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Payment Method</label>
                                                        <select className="form-select" value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                                                            <option value="">- Select -</option>
                                                            <option>Bank Transfer</option><option>Card</option><option>Cash</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-12">
                                                        <label className="form-label">Invoice Number</label>
                                                        <input className="form-control" value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} />
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="head mt-5 mb-5">Gear Planning (Optional)</h6>
                                                    <button type="button" className="btn" id="edit" onClick={() => window.open('/gear/library', '_blank')}>+ Add New Library</button>
                                                </div>
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-12">
                                                        <label className="form-label d-flex align-items-center gap-2">
                                                            Pick from Library
                                                            <button type="button" className="btn" title="Refresh list" onClick={loadGearLibraries}><i className="fas fa-rotate"></i></button>
                                                        </label>
                                                        {gearLibraries.length === 0 && <p className="text-muted small">No gear libraries yet - use "+ Add New Library" to create one.</p>}
                                                        <div className="d-flex gap-3 flex-wrap">
                                                            {gearLibraries.map(lib => (
                                                                <label key={lib.id} className="d-flex align-items-center gap-2">
                                                                    <input type="checkbox" checked={form.gearLibraryIds.includes(lib.id)} onChange={() => toggleGearLibrary(lib.id)} /> {lib.title}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6"><label className="form-label">Gear Checklist</label><input className="form-control" placeholder="e.g. Night Wedding Kit" value={form.gearChecklist} onChange={(e) => update('gearChecklist', e.target.value)} /></div>
                                                    <div className="col-md-6 d-flex align-items-center gap-2"><label className="form-label m-0">Backup Gear Needed?</label><input type="checkbox" checked={form.backupGear} onChange={(e) => update('backupGear', e.target.checked)} /></div>
                                                </div>

                                                <div className="d-flex gap-2 pt-3 border-top">
                                                    <button type="submit" className="btn" id="e-edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                    <button type="button" className="btn" id="e-view" onClick={() => navigate('/calendar')}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
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
                    {showAttachNotes && (
                        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Attach from Notes</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowAttachNotes(false)}></button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                        <input type="search" className="form-control mb-3" placeholder="Search notes..." value={attachNotesSearch} onChange={(e) => setAttachNotesSearch(e.target.value)} />
                                        <button type="button" className="btn w-100 mb-3 text-white" style={{ backgroundColor: '#99816B' }} onClick={() => window.open('/cheatsheet/add', '_blank')} >
                                            <i className="fas fa-plus me-2"></i>Create New Note
                                        </button>
                                        {attachNotesLoading && <p className="text-muted text-center">Loading notes...</p>}
                                        {!attachNotesLoading && attachNotes.filter(n => (n.title || '').toLowerCase().includes(attachNotesSearch.toLowerCase())).length === 0 && (
                                            <p className="text-muted text-center">No notes found.</p>
                                        )}
                                        {!attachNotesLoading && attachNotes
                                            .filter(n => (n.title || '').toLowerCase().includes(attachNotesSearch.toLowerCase()))
                                            .map(note => (
                                                <div key={note.id} className="border rounded p-3 mb-2" style={{ cursor: 'pointer' }} onClick={() => attachNoteToInternal(note)} >
                                                    <div className="fw-bold">{note.title}</div>
                                                    <div className="text-muted small text-truncate">{note.description || note.notes}</div>
                                                    <div className="text-muted small mt-1">{note.updated_at ? new Date(note.updated_at).toLocaleDateString() : ''}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
export default PhotographerCalendarAdd;
