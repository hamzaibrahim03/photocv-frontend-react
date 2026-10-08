import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll.jsx';
import apiClient from '../api/axios';
import { mapBookingFromApi } from './PhotographerCalendar';

function Field({ label, value }) {
    return (
        <div className="col-md-6 mb-3">
            <div className="text-danger small fw-medium">{label}</div>
            <div>{value || '—'}</div>
        </div>
    );
}

function PhotographerCalendarSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [booking, setBooking] = useState(null);

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
                        <div className="card bg-white border-0 rounded shadow-sm p-5 mt-4 text-center text-muted">
                            Booking not found.
                            <div className="mt-3"><button className="btn text-white" style={{ backgroundColor: '#3a2e26' }} onClick={() => navigate('/calendar')}>Back to Calendar</button></div>
                        </div>
                    </div>
                </>
            )}
            {!isLoading && booking && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Calendar" />
                    <div className="content">
                        <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h4 className="head m-0">{booking.title}</h4>
                                    <small className="text-muted">{booking.code}</small> &nbsp;
                                    <span className="badge" style={{ backgroundColor: '#eee', color: '#333' }}>{booking.type}</span> &nbsp;
                                    <span className="badge" style={{ backgroundColor: '#e7f6ec', color: '#1e8a4c' }}>{booking.status}</span>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate(`/calendar/${booking.id}/edit`)}><i className="fas fa-edit me-1"></i>Edit</button>
                                    <button className="btn" style={{ border: '1px solid #cc445e', color: '#cc445e' }} onClick={handleDelete}><i className="fas fa-trash-alt me-1"></i>Delete</button>
                                    <button className="btn" id="e-view" onClick={() => navigate('/calendar')}>Close</button>
                                </div>
                            </div>

                            <h6 className="head mb-3">Client Information</h6>
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
                                <Field label="Set Reminder for Event" value={booking.reminderEvent ? 'Yes' : 'No'} />
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
                                <Field label="Contract Status" value={booking.contractStatus} />
                            </div>

                            <h6 className="head mb-3 mt-2">Payment Tracking</h6>
                            <div className="row">
                                <Field label="Total Cost" value={booking.totalCost ? `£ ${booking.totalCost}` : ''} />
                                <Field label="Deposit Received" value={booking.depositReceived ? `£ ${booking.depositReceived}` : ''} />
                                <Field label="Remaining Balance" value={(booking.totalCost || booking.depositReceived) ? `£ ${(Number(booking.totalCost || 0) - Number(booking.depositReceived || 0))}` : ''} />
                                <Field label="Payment Status" value={booking.paymentStatus} />
                                <Field label="Payment Due Date" value={booking.paymentDueDate} />
                                <Field label="Payment Method" value={booking.paymentMethod} />
                                <Field label="Invoice Number" value={booking.invoiceNumber} />
                            </div>

                            <h6 className="head mb-3 mt-2">Gear Planning (Optional)</h6>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <div className="text-danger small fw-medium">Gear Checklist</div>
                                    {booking.gearChecklist ? <div className="text-decoration-underline">{booking.gearChecklist}</div> : '—'}
                                </div>
                                <Field label="Backup Gear Needed" value={booking.backupGear ? 'Yes' : 'No'} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export default PhotographerCalendarSingle;
