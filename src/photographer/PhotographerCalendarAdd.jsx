import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll.jsx';
import apiClient from '../api/axios';

// Booking type / lead source / service options come from the Catalog table.
// That lookup is exposed only via the domain-gated public club route, so it
// has to be fetched against the real tenant domain the same way
// SecretaryDashboard.jsx does for its public data, rather than through the
// apiClient baseURL (which points at 127.0.0.1 in local dev).
const CATALOG_API_BASE = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1';

const emptyForm = {
    title: '', bookingTypeId: '', leadSourceId: '', status: 'pending',
    clientName: '', contactNumber: '', email: '', secondaryContact: '', address: '',
    eventDate: '', preMeetingDate: '', startTime: '', endTime: '', reminderEvent: false, reminderPreEvent: false,
    serviceIds: [], shootLocations: '', deliverables: '', specialRequirements: '',
    internalNotes: '', clientNotes: '', contractStatus: 'draft',
    totalCost: '', depositReceived: '', paymentStatus: 'unpaid', paymentDueDate: '', paymentMethod: '', invoiceNumber: '',
    gearChecklist: '', backupGear: false,
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
    };
}

function PhotographerCalendarAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState(emptyForm);
    const [catalogOptions, setCatalogOptions] = useState({ booking_type: [], lead_source: [], service_type: [] });
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

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
    }, []);

    useEffect(() => {
        if (!id) return;
        async function loadBooking() {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/booking/${id}`);
                const data = response.data?.data || response.data;
                setForm({ ...emptyForm, ...mapApiToForm(data) });
            } catch (err) {
                console.error('Error loading booking:', err);
                setError('Failed to load booking.');
            } finally {
                setIsLoading(false);
            }
        }
        loadBooking();
    }, [id]);

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    const toggleService = (serviceId) => {
        setForm(prev => ({
            ...prev,
            serviceIds: prev.serviceIds.includes(serviceId)
                ? prev.serviceIds.filter(s => s !== serviceId)
                : [...prev.serviceIds, serviceId],
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        const payload = {
            title: form.title,
            booking_type_id: form.bookingTypeId ? Number(form.bookingTypeId) : null,
            lead_source_id: form.leadSourceId ? Number(form.leadSourceId) : null,
            booking_status: form.status,
            client_name: form.clientName,
            email: form.email || null,
            contact_number: form.contactNumber || null,
            secondary_contact_number: form.secondaryContact || null,
            address: form.address || null,
            event_date: form.eventDate || null,
            pre_event_meeting_date: form.preMeetingDate || null,
            start_time: form.startTime || null,
            end_time: form.endTime || null,
            set_reminder: !!form.reminderEvent,
            pre_event_reminder: !!form.reminderPreEvent,
            service_ids: form.serviceIds,
            location: form.shootLocations || null,
            deliverables: form.deliverables || null,
            special_requirements: form.specialRequirements || null,
            internal_notes: form.internalNotes || null,
            client_notes: form.clientNotes || null,
            contract_status: form.contractStatus,
            requirements: form.gearChecklist || null,
            total_cost: form.totalCost !== '' ? Number(form.totalCost) : null,
            deposit_received: form.depositReceived !== '' ? Number(form.depositReceived) : null,
            payment_status: form.paymentStatus,
            payment_due_date: form.paymentDueDate || null,
            payment_method: form.paymentMethod || null,
            invoice_number: form.invoiceNumber || null,
            backup_gear_needed: !!form.backupGear,
        };

        try {
            if (id) {
                await apiClient.put(`/booking/${id}`, payload);
                navigate(`/calendar/${id}`);
            } else {
                const response = await apiClient.post('/booking', payload);
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
                        <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                            <h4 className="head mb-4">{id ? 'Edit Booking' : 'New Booking'}</h4>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSave}>
                                <h6 className="head mb-3">Basic Booking Information</h6>
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

                                <h6 className="head mb-3">Client Information</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6"><label className="form-label">Client Name</label><input className="form-control" value={form.clientName} onChange={(e) => update('clientName', e.target.value)} required /></div>
                                    <div className="col-md-6"><label className="form-label">Contact Number</label><input className="form-control" value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label">Email Address</label><input type="email" className="form-control" value={form.email} onChange={(e) => update('email', e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label">Secondary Contact Number</label><input className="form-control" value={form.secondaryContact} onChange={(e) => update('secondaryContact', e.target.value)} /></div>
                                    <div className="col-md-12"><label className="form-label">Address/Venue</label><textarea className="form-control" rows="2" value={form.address} onChange={(e) => update('address', e.target.value)}></textarea></div>
                                </div>

                                <h6 className="head mb-3">Booking Schedule</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6"><label className="form-label">Event Date</label><input type="date" className="form-control" value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label">Pre-Event Meeting Date</label><input type="date" className="form-control" value={form.preMeetingDate} onChange={(e) => update('preMeetingDate', e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label">Start Time</label><input type="time" className="form-control" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label">End Time</label><input type="time" className="form-control" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} /></div>
                                    <div className="col-md-6 d-flex align-items-center gap-2"><label className="form-label m-0">Set Reminder for Event</label><input type="checkbox" checked={form.reminderEvent} onChange={(e) => update('reminderEvent', e.target.checked)} /></div>
                                    <div className="col-md-6 d-flex align-items-center gap-2"><label className="form-label m-0">Set Reminder for Pre-Event</label><input type="checkbox" checked={form.reminderPreEvent} onChange={(e) => update('reminderPreEvent', e.target.checked)} /></div>
                                </div>

                                <h6 className="head mb-3">Services & Deliverables</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-12">
                                        <label className="form-label">Services Included</label>
                                        <div className="d-flex gap-3 flex-wrap">
                                            {(catalogOptions.service_type || []).map(opt => (
                                                <label key={opt.id} className="d-flex align-items-center gap-2">
                                                    <input type="checkbox" checked={form.serviceIds.includes(opt.id)} onChange={() => toggleService(opt.id)} /> {opt.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6"><label className="form-label">Shoot Locations</label><textarea className="form-control" rows="2" value={form.shootLocations} onChange={(e) => update('shootLocations', e.target.value)}></textarea></div>
                                    <div className="col-md-6"><label className="form-label">Deliverables</label><textarea className="form-control" rows="2" value={form.deliverables} onChange={(e) => update('deliverables', e.target.value)}></textarea></div>
                                    <div className="col-md-12"><label className="form-label">Special Requirements</label><textarea className="form-control" rows="2" value={form.specialRequirements} onChange={(e) => update('specialRequirements', e.target.value)}></textarea></div>
                                </div>

                                <h6 className="head mb-3">Notes & Communication</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6"><label className="form-label">Internal Notes</label><textarea className="form-control" rows="2" value={form.internalNotes} onChange={(e) => update('internalNotes', e.target.value)}></textarea></div>
                                    <div className="col-md-6"><label className="form-label">Client Notes</label><textarea className="form-control" rows="2" value={form.clientNotes} onChange={(e) => update('clientNotes', e.target.value)}></textarea></div>
                                    <div className="col-md-6">
                                        <label className="form-label">Contract Status</label>
                                        <select className="form-select" value={form.contractStatus} onChange={(e) => update('contractStatus', e.target.value)}>
                                            <option value="draft">Draft</option>
                                            <option value="signed">Signed</option>
                                            <option value="void">Void</option>
                                        </select>
                                    </div>
                                </div>

                                <h6 className="head mb-3">Payment Tracking</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6"><label className="form-label">Total Cost</label><input type="number" className="form-control" value={form.totalCost} onChange={(e) => update('totalCost', e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label">Deposit Received</label><input type="number" className="form-control" value={form.depositReceived} onChange={(e) => update('depositReceived', e.target.value)} /></div>
                                    <div className="col-md-6">
                                        <label className="form-label">Payment Status</label>
                                        <select className="form-select" value={form.paymentStatus} onChange={(e) => update('paymentStatus', e.target.value)}>
                                            <option value="unpaid">Unpaid</option>
                                            <option value="partial">Partial</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6"><label className="form-label">Payment Due Date</label><input type="date" className="form-control" value={form.paymentDueDate} onChange={(e) => update('paymentDueDate', e.target.value)} /></div>
                                    <div className="col-md-6">
                                        <label className="form-label">Payment Method</label>
                                        <select className="form-select" value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                                            <option value="">- Select -</option>
                                            <option>Bank Transfer</option><option>Card</option><option>Cash</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6"><label className="form-label">Invoice Number</label><input className="form-control" value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} /></div>
                                </div>

                                <h6 className="head mb-3">Gear Planning (Optional)</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6"><label className="form-label">Gear Checklist</label><input className="form-control" placeholder="e.g. Night Wedding Kit" value={form.gearChecklist} onChange={(e) => update('gearChecklist', e.target.value)} /></div>
                                    <div className="col-md-6 d-flex align-items-center gap-2"><label className="form-label m-0">Backup Gear Needed?</label><input type="checkbox" checked={form.backupGear} onChange={(e) => update('backupGear', e.target.checked)} /></div>
                                </div>

                                <div className="d-flex gap-2 pt-3 border-top">
                                    <button type="submit" className="btn" id="e-edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                    <button type="button" className="btn" id="e-view" onClick={() => navigate('/calendar')}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export default PhotographerCalendarAdd;
