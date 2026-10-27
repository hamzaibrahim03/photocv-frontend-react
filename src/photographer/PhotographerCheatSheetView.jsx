import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function formatRange(min, max, prefix = '') {
    if (min == null && max == null) return '—';
    if (min == null) return `${prefix}${max}`;
    if (max == null) return `${prefix}${min}`;
    if (String(min) === String(max)) return `${prefix}${min}`;
    return `${prefix}${min} - ${prefix}${max}`;
}

function Field({ label, value }) {
    if (!value) return null;
    return (
        <div className="col-md-6 mb-3">
            <div className="text-danger small fw-medium mb-1">{label}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{value}</div>
        </div>
    );
}

function Pill({ color, bg, children, style }) {
    return (
        <span style={{ display: 'inline-block', padding: '2px 12px', borderRadius: '12px', fontSize: '12px', backgroundColor: bg, color, ...style }}>
            {children}
        </span>
    );
}

function PhotographerCheatSheetView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sheet, setSheet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({ first_name: 'Photographer', last_name: '', profile_image_url: '/placeholder.jpg' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    useEffect(() => {
        async function loadSheet() {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/cheat-sheets/${id}`);
                setSheet(response.data?.data || response.data);
            } catch (error) {
                console.error('Error loading cheat sheet:', error);
                setSheet(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadSheet();
    }, [id]);

    useEffect(() => {
        apiClient.get('/member-admin/profile/portfolio')
            .then((response) => {
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            })
            .catch((error) => console.error('Error loading profile summary:', error));
    }, []);

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && !sheet && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profile" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-5 mt-4 text-center text-muted">
                                        Cheat sheet not found.
                                        <div className="mt-3"><button className="btn" id="edit" onClick={() => navigate('/learn')}>Back to Cheat Sheets</button></div>
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
                {!isLoading && sheet && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profile" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className='dashboard-card' id="cl">
                                        <div className='profile-card'>
                                            <div className='profile-left'>
                                                <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                                <div className='profile-info'>
                                                    <h2 className='head'>{user.first_name} {user.last_name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">My Photos</small>
                                                <h3 className="number">{totals.totalPhotos}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Interactions</small>
                                                <div className="row align-items-center">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                                    </div>
                                                    <div className="days col-md-7 text-start">
                                                        <span>Likes & Comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                        <div className="card border-0 rounded shadow-sm p-4 mb-4" style={{ position: "relative", backgroundColor: "#fff" }} >
                                            <div style={{ position: "absolute", top: "12px", right: "20px", }} >
                                                <Pill bg={sheet.visibility === "private" ? "#e9e4df" : "#d7f3e3"} color={sheet.visibility === "private" ? "#6b5d53" : "#1e8a4c"} style={{ fontSize: "9px", padding: "2px 6px", textTransform: "capitalize", }} >
                                                    • {sheet.visibility || "public"}
                                                </Pill>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <div className="d-flex align-items-center flex-wrap mb-1" style={{ justifyContent: 'space-between' }}>
                                                        <h4 className="head mb-0">
                                                            {sheet.title}
                                                        </h4>
                                                        {sheet.category?.name && (
                                                            <Pill bg="#fde5e9" color="#d95370" style={{ fontSize: "10px", padding: "3px 8px", }} >
                                                                {sheet.category.name}
                                                            </Pill>
                                                        )}
                                                    </div>
                                                    {sheet.description && (
                                                        <p className="text-secondary mb-2" style={{ width: "100%", padding: '10px 0 0 10px' }} >
                                                            {sheet.description}
                                                        </p>
                                                    )}
                                                    {sheet.reference_image && (
                                                        <img src={sheet.reference_image} alt={sheet.title} className="rounded" style={{ width: "100%", maxWidth: "700px", height: "auto", maxHeight: "360px", objectFit: "cover", display: "block", }} />
                                                    )}


                                                    <h6 className="head mt-5 mb-5">Manual Settings</h6>
                                                    <div className="row mb-2">
                                                        <div className='col-md-4'>
                                                            <Field label="Shutter Speed" value={formatRange(sheet.shutter_min, sheet.shutter_max)} />
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <Field label="ISO" value={formatRange(sheet.iso_min, sheet.iso_max)} />
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <Field label="Aperture" value={formatRange(sheet.aperture_min, sheet.aperture_max, 'f/')} />
                                                        </div>
                                                    </div>

                                                    <h6 className="head mb-3 mt-3">Essential Settings</h6>
                                                    <div className="row mb-2">
                                                        <Field label="Lens" value={sheet.lens} />
                                                        <Field label="Camera" value={sheet.camera} />
                                                        <Field label="White Balance" value={sheet.white_balance} />
                                                        <Field label="In Camera Noise Reduction" value={sheet.noise_reduction} />
                                                    </div>

                                                    {sheet.notes && (
                                                        <>
                                                            <h6 className="head mb-2 mt-3 text-danger" style={{ fontSize: '14px' }}>Notes</h6>
                                                            <ul className="mb-3">
                                                                {sheet.notes.split('\n').filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
                                                            </ul>
                                                        </>
                                                    )}

                                                    {sheet.reference_image && (
                                                        <img src={sheet.reference_image} alt={sheet.title} className="rounded" style={{ width: "100%", maxWidth: "300px", height: "auto", maxHeight: "360px", objectFit: "cover", display: "block", }} />
                                                    )}

                                                    {sheet.tips?.length > 0 && (
                                                        <>
                                                            <h6 className="head mb-2 mt-3">Tips</h6>
                                                            <h6 className="head mb-2 mt-3 pl-4">Top Tips</h6>
                                                            <ul className="mb-3">
                                                                {sheet.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                                            </ul>
                                                        </>
                                                    )}



                                                    {sheet.accessories?.length > 0 && (
                                                        <>
                                                            <h6 className="head mb-2 mt-3">Accessories</h6>
                                                            <div className="d-flex gap-2 flex-wrap mb-3">
                                                                {sheet.accessories.map((a, i) => <Pill key={i} bg="#f3e9e0" color="#99816b">{a}</Pill>)}
                                                            </div>
                                                        </>
                                                    )}

                                                    {sheet.tags?.length > 0 && (
                                                        <>
                                                            <h6 className="head mb-2 mt-3">Tags</h6>
                                                            <div className="d-flex gap-2 flex-wrap mb-3">
                                                                {sheet.tags.map((t, i) => <Pill key={i} bg="#f3e2e6" color="#cc445e">{t}</Pill>)}
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="d-flex gap-2 pt-3 border-top">
                                                        <button className="btn" id="edit" onClick={() => navigate(`/cheatsheet/${id}/edit`)}>Edit</button>
                                                        <button className="btn" id="e-view" onClick={() => navigate('/cheatsheet')}>Back</button>
                                                    </div>
                                                </div>
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
                )
                }
            </div>
        </>
    );
}
export default PhotographerCheatSheetView;
