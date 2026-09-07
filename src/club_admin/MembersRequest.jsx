import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from "../React/extra/LoaderAll";
import { API_URL, readApiResponse } from '../api/axios';
const MembersRequest = () => {
    const navigate = useNavigate();
    const [memberRequestData, setMemberRequestData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [itemsPerPage] = useState(24);
    const [processingId, setProcessingId] = useState(null);
    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    const getMemberRequestsData = async () => {
        try {
            const response = await fetch(`${API_URL}/member-pending-requests`, {
                method: "GET",
                headers: getHeaders(),
            });
            const data = await readApiResponse(response);
            console.log("Pending member requests:", data);
            if (!response.ok) {
                throw new Error(data?.message || "Failed to fetch member requests.");
            }
            setMemberRequestData(data?.data ?? []);
        } catch (error) {
            console.error("Get member requests error:", error);
            alert(error.message || "Failed to load member requests.");
        }
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await getMemberRequestsData();
            setIsLoading(false);
        };
        loadData();
    }, []);
    const filteredRequests = useMemo(() => {
        const requests = Array.isArray(memberRequestData)
            ? memberRequestData
            : Array.isArray(memberRequestData?.data)
                ? memberRequestData.data
                : Array.isArray(memberRequestData?.original?.data)
                    ? memberRequestData.original.data
                    : [];
        if (!search.trim()) {
            return requests;
        }
        const searchValue = search.toLowerCase();
        return requests.filter((member) =>
            `${member?.first_name || ''} ${member?.last_name || ''}`
                .toLowerCase()
                .includes(searchValue) ||
            (member?.username || '').toLowerCase().includes(searchValue) ||
            (member?.email || '').toLowerCase().includes(searchValue) ||
            (member?.title || '').toLowerCase().includes(searchValue)
        );
    }, [memberRequestData, search]);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(start, start + itemsPerPage);
    }, [filteredRequests, currentPage, itemsPerPage]);
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);
    const chunkedCards = useMemo(() => {
        const chunkSize = 4;
        const chunks = [];
        for (let i = 0; i < paginatedCards.length; i += chunkSize) {
            chunks.push(paginatedCards.slice(i, i + chunkSize));
        }
        return chunks;
    }, [paginatedCards]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleAccept = async (request) => {
        if (!request?.id) {
            alert("Invalid member request.");
            return;
        }
        if (processingId) {
            return;
        }
        const memberName = `${request?.first_name || ""} ${request?.last_name || ""}`.trim() || request?.username || "this member";
        const confirmed = window.confirm(`Are you sure you want to accept ${memberName}?`);
        if (!confirmed) {
            return;
        }
        try {
            setProcessingId(request.id);
            const response = await fetch(`${API_URL}/assign-club`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ user_id: request.id }),
            });
            const result = await readApiResponse(response);
            console.log("Assign club response:", result);
            if (!response.ok) {
                throw new Error(result?.message || "Failed to accept member request.");
            }
            setMemberRequestData((previous) =>
                previous.filter((item) => String(item.id) !== String(request.id))
            );
            alert(`${memberName} has been accepted successfully.`);
        } catch (error) {
            console.error("Accept member error:", error);
            alert(error.message || "Something went wrong while accepting the member.");
        } finally {
            setProcessingId(null);
        }
    };
    const handleReject = async (request) => {
        if (!request?.id) {
            alert("Invalid member request.");
            return;
        }
        if (processingId) {
            return;
        }
        const memberName = `${request?.first_name || ""} ${request?.last_name || ""}`
            .trim() ||
            request?.username ||
            "this member";
        const confirmed = window.confirm(`Are you sure you want to reject ${memberName}?`);
        if (!confirmed) {
            return;
        }
        try {
            setProcessingId(request.id);
            const response = await fetch(`${API_URL}/reject-club-request`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ user_id: request.id }),
            });
            const data = await readApiResponse(response);
            console.log("Reject request response:", data);
            if (!response.ok) {
                throw new Error(data?.message || "Failed to reject member request.");
            }
            setMemberRequestData((previous) =>
                previous.filter((item) => String(item.id) !== String(request.id))
            );
            alert(`${memberName} has been rejected successfully.`);
        } catch (error) {
            console.error("Reject member error:", error);
            alert(error.message || "Something went wrong while rejecting the member.");
        } finally {
            setProcessingId(null);
        }
    };
    return (
        <>
            <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Member Requests" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4" style={{ gap: '15px' }}>
                                        <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                            <div className="profile-left d-flex flex-column justify-content-center">
                                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>
                                                    List of requested members
                                                </small>
                                                <h2 className="name m-0 text-dark" style={{ fontSize: '30px', fontWeight: '500' }}>
                                                    Member Requests
                                                </h2>
                                                <small className="role text-danger" style={{ fontSize: '18px' }}>
                                                    {memberRequestData?.original?.data.length} Member Requests
                                                </small>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <div className="search-bar d-flex justify-content-space-between">
                                                    <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                    <i className="fas fa-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                            <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '463px', height: '148px' }}>
                                                <small className="ca-details" style={{ fontSize: '20px' }}>
                                                    Total Members Requests
                                                </small>
                                                <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>
                                                    {memberRequestData?.original?.data.length}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                    {chunkedCards.length > 0 ? (
                                        chunkedCards.map(
                                            (row, rowIndex) => (
                                                <div key={rowIndex} className="row-wrapper d-flex mb-4">
                                                    <div className="photographers d-flex w-100 gap-4 flex-wrap mt-2">
                                                        {row.map(
                                                            (member) => {
                                                                const isProcessing = processingId === member.id;
                                                                const memberName = `${member?.first_name || ""} ${member?.last_name || ""}`.trim() || member?.username || "Username";
                                                                return (
                                                                    <div key={member.id} className="photographer-card bg-white text-center rounded shadow-sm border p-3" style={{ width: '23.6%', border: '1px solid #99816b' }}>
                                                                        <img src={member.profile_image_url || '/placeholder.jpg'} alt="Profile" className="profile-pic rounded-circle mx-auto d-block my-3" style={{ width: '192px', height: '192px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                                        <div className="social-media-icons d-flex justify-content-center gap-2 mt-n4 mb-3 position-relative" style={{ top: '-25px' }}>
                                                                            <a href={member.facebook || '#'} target="_blank" rel="noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '40px', height: '40px' }}>
                                                                                <i className="fab fa-facebook-f"></i>
                                                                            </a>
                                                                            <a href={member.instagram || '#'} target="_blank" rel="noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#cc445e', color: 'white', width: '40px', height: '40px' }} >
                                                                                <i className="fab fa-instagram"></i>
                                                                            </a>
                                                                            <a href={member.twitter || '#'} target="_blank" rel="noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '40px', height: '40px' }}>
                                                                                <i className="fab fa-twitter"></i>
                                                                            </a>
                                                                        </div>
                                                                        <h3 className="head" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                                            {memberName}
                                                                        </h3>
                                                                        <small className="role mb-3">
                                                                            {member.title || 'No title provided'}
                                                                        </small>
                                                                        <div className="d-flex justify-content-center gap-2">
                                                                            <button type="button" className="btn" disabled={processingId !== null} onClick={() => handleAccept(member)} style={{ backgroundColor: '#4C4036', color: 'white', border: '1px solid #4C4036', width: '150px', maxWidth: '150px', height: '38px', opacity: isProcessing ? 0.7 : 1 }}>
                                                                                {isProcessing ? (
                                                                                    <>
                                                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                                        Processing
                                                                                    </>
                                                                                ) : (
                                                                                    'Accept'
                                                                                )}
                                                                            </button>
                                                                            <button type="button" className="btn" disabled={processingId !== null} onClick={() => handleReject(member)} style={{ backgroundColor: 'white', color: '#4C4036', border: '1px solid #4C4036', width: '150px', maxWidth: '150px', height: '38px', opacity: isProcessing ? 0.7 : 1 }}>
                                                                                {isProcessing
                                                                                    ? 'Processing'
                                                                                    : 'Reject'}
                                                                            </button>
                                                                        </div>
                                                                        <div className="d-flex justify-content-center gap-2 mt-2">
                                                                            <button type="button" className="btn" onClick={() => navigate(`/memberrequest/${member.id}`)} disabled={processingId !== null} style={{ backgroundColor: '#CC445E', color: 'white', border: '1px solid #CC445E', width: '307px', maxWidth: '307px', height: '38px' }}>
                                                                                View Profile
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-muted text-center pt-5">
                                            {search
                                                ? 'No members found for your search.'
                                                : 'No pending member requests.'}
                                        </p>
                                    )}
                                </div>
                            </section>
                            <section className="pb-5 mt-4">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="button-group ms-3">
                                            <button className="btn text-white" style={{ backgroundColor: '#4c4036', width: '120px' }} onClick={() => navigate('/members/create')}>
                                                Add New
                                            </button>
                                        </div>
                                        {memberRequestData.length > 0 && (
                                            <div className="dt-paging">
                                                <nav aria-label="pagination">
                                                    <button className={`dt-paging-button previous ${currentPage === 1 ? "disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous"> ‹ </button>
                                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)}>
                                                            {page}
                                                        </button>
                                                    ))}
                                                    <button className={`dt-paging-button next ${currentPage === totalPages ? "disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next"> › </button>
                                                </nav>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default MembersRequest;