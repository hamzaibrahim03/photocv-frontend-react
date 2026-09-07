import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from './NavigationRoute';
import Loader from "../React/extra/LoaderAll";
import HeaderRoute from './HeaderRoute';
import { API_URL, readApiResponse } from '../api/axios';
function MemberSingleRequest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [memberRequestData, setMemberRequestData] = useState([]);
    const [memberSingleRequestData, setMemberSingleRequestData] = useState(null);
    const [search, setSearch] = useState("");
    const getToken = () => {
        return localStorage.getItem("token");
    };
    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    });
    const getMemberRequestsData = async () => {
        try {
            const response = await fetch(
                `${API_URL}/member-pending-requests`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );
            const data = await readApiResponse(response);
            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to fetch member requests."
                );
            }
            setMemberRequestData(data?.data ?? []);
        } catch (error) {
            console.error("Pending requests error:", error);
        }
    };
    const getMemberSingleRequestsData = async () => {
        try {
            const response = await fetch(
                `${API_URL}/member-request/${id}`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );
            const data = await readApiResponse(response);
            console.log("Single request API:", data);
            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to fetch member request."
                );
            }
            setMemberSingleRequestData(data?.data ?? null);
        } catch (error) {
            console.error("Single member request error:", error);
            alert(error.message || "Failed to load member request.");
        }
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([
                getMemberRequestsData(),
                getMemberSingleRequestsData(),
            ]);
            setIsLoading(false);
        };
        if (id) {
            loadData();
        }
    }, [id]);
    const member = memberSingleRequestData?.member;
    const handleAccept = async () => {
        if (!member) {
            alert("Member information is not available.");
            return;
        }
        if (isProcessing) return;
        const memberName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
        const confirmed = window.confirm(
            `Are you sure you want to accept ${memberName || "this member"}?`
        );
        if (!confirmed) return;
        try {
            setIsProcessing(true);
            const response = await fetch(
                `${API_URL}/assign-club`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({ user_id: id }),
                }
            );
            const data = await readApiResponse(response);
            console.log("Assign club response:", data);
            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to accept member request."
                );
            }
            alert(
                `${memberName || "Member"} has been accepted successfully.`
            );
            navigate('/members/request');
        } catch (error) {
            console.error("Accept member error:", error);
            alert(
                error.message ||
                "Something went wrong while accepting the member."
            );
        } finally {
            setIsProcessing(false);
        }
    };
    const handleReject = async () => {
        if (!member) {
            alert("Member information is not available.");
            return;
        }
        if (isProcessing) return;
        const memberName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
        const confirmed = window.confirm(
            `Are you sure you want to reject ${memberName || "this member"}?`
        );
        if (!confirmed) return;
        try {
            setIsProcessing(true);
            const response = await fetch(
                `${API_URL}/reject-club-request`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({ user_id: id }),
                }
            );
            const data = await readApiResponse(response);
            console.log("Reject response:", data);
            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to reject member request."
                );
            }
            alert(
                `${memberName || "Member"} has been rejected successfully.`
            );
            navigate('/members/request');
        } catch (error) {
            console.error("Reject member error:", error);
            alert(
                error.message ||
                "Something went wrong while rejecting the member."
            );
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <>
            <div
                style={{
                    backgroundColor: 'white',
                    minHeight: '100vh'
                }}
            >
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Members" />
                        <div className="content">
                            <section>
                                <div
                                    className="container"
                                    style={{ maxWidth: '1820px' }}
                                >
                                    <div
                                        className="dashboard-card d-flex align-items-center justify-content-between py-4"
                                        style={{ gap: '15px' }}
                                    >
                                        <div
                                            className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded"
                                            style={{
                                                width: '65.8%',
                                                height: '148px'
                                            }}
                                        >
                                            <div className="profile-left d-flex flex-column justify-content-center">
                                                <h2
                                                    className="name m-0 text-dark"
                                                    style={{
                                                        fontSize: '30px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Member Request
                                                </h2>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <div className="search-bar d-flex justify-content-space-between">
                                                    <input
                                                        type="search"
                                                        className="search-input"
                                                        id="dt-search-1"
                                                        placeholder="Search"
                                                        value={search}
                                                        onChange={(e) =>
                                                            setSearch(e.target.value)
                                                        }
                                                    />
                                                    <i className="fas fa-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="card-section d-flex gap-4"
                                            style={{ width: '32%' }}
                                        >
                                            <div
                                                className="stat-card text-white text-center rounded p-4"
                                                style={{
                                                    backgroundColor: '#cc445e',
                                                    width: '463px',
                                                    height: '148px'
                                                }}
                                            >
                                                <small
                                                    className="ca-details"
                                                    style={{ fontSize: '20px' }}
                                                >
                                                    Total Members Requests
                                                </small>
                                                <h3
                                                    className="number mt-4"
                                                    style={{
                                                        fontSize: '48px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {memberRequestData?.original?.data?.length ?? 0}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div
                                    className="container"
                                    style={{ maxWidth: '1820px' }}
                                >
                                    <div className="card p-4">
                                        {!member ? (
                                            <div className="text-center text-muted py-5">
                                                <h5>
                                                    Member request not found.
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn mt-3 text-white"
                                                    style={{
                                                        backgroundColor: '#4c4036'
                                                    }}
                                                    onClick={() =>
                                                        navigate('/members/request')
                                                    }
                                                >
                                                    Back to Requests
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="row">
                                                <div className="col-md-4 text-center">
                                                    {member.profile_image_url ? (
                                                        <img
                                                            src={member.profile_image_url}
                                                            className="profile-pic rounded-circle d-block object-fit-cover mx-auto"
                                                            style={{
                                                                marginTop: '30px',
                                                                width: '192px',
                                                                height: '192px'
                                                            }}
                                                            alt="Profile"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder.jpg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="fallback-box rounded-circle d-flex justify-content-center align-items-center bg-light mx-auto"
                                                            style={{
                                                                marginTop: '30px',
                                                                width: '192px',
                                                                height: '192px',
                                                                boxShadow:
                                                                    '0 0 10px rgba(0,0,0,0.1)'
                                                            }}
                                                        >
                                                            <i
                                                                className="fa-regular fa-user text-secondary"
                                                                style={{
                                                                    fontSize: '48px'
                                                                }}
                                                            ></i>
                                                        </div>
                                                    )}
                                                    <div
                                                        className="social-media-icons d-flex justify-content-center gap-2 mt-n4 position-relative"
                                                        style={{ top: '-5px' }}
                                                    >
                                                        <a
                                                            href={member.facebook || '#'}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                backgroundColor: '#99816b',
                                                                color: 'white',
                                                                width: '34px',
                                                                height: '34px'
                                                            }}
                                                        >
                                                            <i className="fab fa-facebook-f"></i>
                                                        </a>
                                                        <a
                                                            href={member.instagram || '#'}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                backgroundColor: '#cc445e',
                                                                color: 'white',
                                                                width: '34px',
                                                                height: '34px'
                                                            }}
                                                        >
                                                            <i className="fab fa-instagram"></i>
                                                        </a>
                                                        <a
                                                            href={member.twitter || '#'}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                backgroundColor: '#99816b',
                                                                color: 'white',
                                                                width: '34px',
                                                                height: '34px'
                                                            }}
                                                        >
                                                            <i className="fab fa-twitter"></i>
                                                        </a>
                                                    </div>
                                                    <h3
                                                        style={{
                                                            fontFamily: 'Inter',
                                                            fontSize: '24px',
                                                            marginBottom: '10px'
                                                        }}
                                                    >
                                                        {`${member.first_name || ''} ${member.last_name || ''}`.trim() ||
                                                            'Full Name'}
                                                    </h3>
                                                    <small
                                                        className="role"
                                                        style={{
                                                            fontFamily: 'Inter',
                                                            fontWeight: 400,
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        {member.title || 'Title'}
                                                    </small>
                                                </div>
                                                <div className="col-md-8">
                                                    <h3 className="role mt-4">
                                                        {member.tag_line ||
                                                            'No tagline available'}
                                                    </h3>
                                                    <p className="text-muted">
                                                        {member.bio ||
                                                            'No description available'}
                                                    </p>
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <label className="text-muted">
                                                                Email
                                                            </label>
                                                            <p style={{ color: 'black' }}>
                                                                {member.email ||
                                                                    'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <label className="text-muted">
                                                                Phone
                                                            </label>
                                                            <p style={{ color: 'black' }}>
                                                                {member.phone ||
                                                                    'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {member && (
                                        <div className="d-flex gap-3 mt-4">
                                            <button
                                                type="button"
                                                className="btn text-white px-4"
                                                style={{
                                                    backgroundColor: '#4c4036',
                                                    minWidth: '110px'
                                                }}
                                                onClick={handleAccept}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                        ></span>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Accept'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn text-white px-4"
                                                style={{
                                                    backgroundColor: '#99816b',
                                                    minWidth: '110px'
                                                }}
                                                onClick={handleReject}
                                                disabled={isProcessing}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default MemberSingleRequest;