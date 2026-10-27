import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import { suitabilityFields, suitabilityLabels, suitabilityBackendKeys } from './PhotographerGear';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function Field({ label, value }) {
    return (
        <div className="col-md-6 mb-3">
            <div className="text-danger small fw-medium">{label}</div>
            <div>{value || value === 0 ? value : '—'}</div>
        </div>
    );
}

function PhotographerGearSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/gears/${id}`);
                const data = response.data?.data || response.data;
                if (!cancelled) setItem(data || null);
            } catch (error) {
                console.error('Error loading gear:', error);
                if (!cancelled) setItem(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this gear item?')) return;
        try {
            await apiClient.delete(`/gears/${id}`);
            navigate('/gear');
        } catch (error) {
            console.error('Error deleting gear:', error);
            alert(error?.response?.data?.message || 'Unable to delete gear item.');
        }
    };

    if (!isLoading && !item) {
        return (
            <>
                <div style={{ backgroundColor: 'white' }}>
                    <NavigationRoute />
                    <HeaderRoute title="Gear" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="card bg-white border-0 rounded shadow-sm p-5 mt-4 text-center text-muted">
                                    Gear item not found.
                                    <div className="mt-3"><button className="btn" id="edit" onClick={() => navigate('/gear')}>Back to Gear</button></div>
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
                </div>
            </>
        );
    }

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && item && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Gear" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm" style={{ padding: '40px 80px' }}>
                                        <div className="row g-4 mb-4">
                                            <div className="col-md-3">
                                                {item.image && <img src={item.image} alt={item.title} className="rounded w-100" style={{ height: '150px', objectFit: 'cover' }} />}
                                            </div>
                                            <div className="col-md-9">
                                                <div className="text-danger small fw-medium">Title</div>
                                                <h4 className="head mt-5 mb-5">{item.title}</h4>
                                                <div className="text-danger small fw-medium">Description</div>
                                                <p className="text-secondary">{item.description}</p>
                                            </div>
                                        </div>

                                        <h6 className="head mt-5 mb-5">Basic Gear Information</h6>
                                        <div className="row">
                                            <Field label="Category" value={item.category?.name} />
                                            <Field label="System" value={item.system} />
                                            <Field label="Type" value={item.type} />
                                            <Field label="Model Name" value={item.model_name} />
                                        </div>

                                        <h6 className="head mb-3 mt-2">Purchase & Ownership Details</h6>
                                        <div className="row">
                                            <Field label="Brought for (Price)" value={item.purchase_price || item.purchase_price === 0 ? `£ ${item.purchase_price}` : ''} />
                                            <Field label="Purchase Date" value={item.purchase_date} />
                                            <Field label="Dealer" value={item.vendor} />
                                            <Field label="Serial Number" value={item.serial_number} />
                                            <Field label="Insurance?" value={item.insured === true ? 'Yes' : item.insured === false ? 'No' : ''} />
                                            <Field label="Firmware Link" value={item.firmware_link} />
                                        </div>

                                        <h6 className="head mb-3 mt-2">Technical Specifications</h6>
                                        <div className="row">
                                            <Field label="Mount" value={item.mount} />
                                            <Field label="Min Focal Length (mm)" value={item.min_focal_length} />
                                            <Field label="Max Focal Length (mm)" value={item.max_focal_length} />
                                            <Field label="Aperture Range (Wide / Tele / Min)" value={item.min_aperture || item.max_aperture ? `${item.min_aperture ?? '—'}–${item.max_aperture ?? '—'}` : ''} />
                                            <Field label="Weight (g)" value={item.weight} />
                                            <Field label="Dimensions (Diameter / Length in mm)" value={item.dimensions} />
                                            <Field label="Min Focus Distance (cm)" value={item.min_focus_distance} />
                                            <Field label="Max Magnification (x)" value={item.max_magnification} />
                                        </div>

                                        <h6 className="head mb-3 mt-2">Photography Niches Suitability</h6>
                                        <div className="row">
                                            {suitabilityFields.map(f => {
                                                const [primaryKey] = suitabilityBackendKeys[f];
                                                const entry = item.suitability?.[primaryKey];
                                                return <Field key={f} label={suitabilityLabels[f]} value={entry?.label} />;
                                            })}
                                        </div>

                                        <h6 className="head mb-3 mt-2">Maintenance & Status</h6>
                                        <div className="row mb-3">
                                            <Field label="Shutter Count" value={item.shutter_count} />
                                            <Field label="Pick / Priority Tag" value={item.priority_tag} />
                                        </div>
                                        {item.notes && <p className="text-secondary">{item.notes}</p>}

                                        <h6 className="head mb-3 mt-4">Photos of This Gear</h6>
                                        {item.gear_images?.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-3 mb-3">
                                                {item.gear_images.map(img => (
                                                    <img key={img.id} src={img.url} alt="Gear reference" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted mb-3">No reference photos uploaded for this item yet.</p>
                                        )}

                                        <h6 className="head mb-3 mt-2">Photos Taken Using This Gear</h6>
                                        {item.photos_using_gear?.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-3 mb-3">
                                                {item.photos_using_gear.map(photo => (
                                                    <div key={photo.id} style={{ width: '120px' }}>
                                                        <img src={photo.thumb_url} alt={photo.title} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                                                        <div className="small text-muted text-truncate mt-1">{photo.title}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted mb-3">No photos linked to this gear item yet.</p>
                                        )}

                                        <div className="d-flex justify-content-between pt-3 border-top mt-3">
                                            <button className="btn" id="e-view" onClick={() => navigate('/gear')}>Back</button>
                                            <div className="d-flex gap-2">
                                                <button className="btn" id="e-edit" onClick={() => navigate(`/gear/${item.id}/edit`)}>Edit</button>
                                                <button className="btn" id="e-view" style={{ backgroundColor: '#cc445e' }} onClick={handleDelete}>Delete</button>
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
            </div>
        </>
    );
}
export default PhotographerGearSingle;
