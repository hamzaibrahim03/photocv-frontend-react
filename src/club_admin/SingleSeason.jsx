import { useEffect, useMemo, useState } from "react";
import Loader from "../Ryton/extra/LoaderAll";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import { useNavigate, useParams } from "react-router";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function SingleSeason() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [competitionResult, setCompetitionResult] = useState([]);
    const [singleCompetitionResult, setSingleCompetitionResult] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [itemsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadCompetition = async () => {
            setIsLoading(true);
            try {
                const competitionResponse = await fetch(`${API_BASE}/competition-results`, { headers: authHeaders(), });
                if (!competitionResponse.ok) {
                    throw new Error(`Competition API error: ${competitionResponse.status}`);
                }
                const competitionJson = await competitionResponse.json();
                const competitionData = competitionJson?.data?.original?.data;
                setCompetitionResult(Array.isArray(competitionData) ? competitionData : []);
                const singleResponse = await fetch(`${API_BASE}/competition-results/${id}`, { headers: authHeaders(), });
                if (!singleResponse.ok) {
                    throw new Error(`Single competition API error: ${singleResponse.status}`);
                }
                const singleJson = await singleResponse.json();
                console.log("Single Competition API Response:", singleJson);
                const singleData = singleJson?.data?.original?.data;
                setSingleCompetitionResult(
                    Array.isArray(singleData)
                        ? singleData
                        : []
                );
            } catch (error) {
                console.error("Competition Result Error:", error);
                setCompetitionResult([]);
                setSingleCompetitionResult([]);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            loadCompetition();
        }
    }, [id]);

    const filteredResults = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
        if (!searchValue) {
            return singleCompetitionResult;
        }
        return singleCompetitionResult.filter((entry) => {
            const memberName = entry?.member_name?.toLowerCase() || "";
            const imageTitle = entry?.entry_image_title?.toLowerCase() || "";
            return (
                memberName.includes(searchValue) ||
                imageTitle.includes(searchValue)
            );
        });
    }, [singleCompetitionResult, search]);

    const groupedResults = useMemo(() => {
        const groups = {};

        filteredResults.forEach((entry) => {
            const compId = entry.member_comp_id;

            if (!groups[compId]) {
                groups[compId] = {
                    member_comp_id: compId,
                    member_name: entry.member_name,
                    member_title: entry.member_title,
                    member_profile_image: entry.member_profile_image,
                    entries: [],
                };
            }

            groups[compId].entries.push(entry);
        });

        return Object.values(groups);
    }, [filteredResults]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(groupedResults.length / itemsPerPage),
            1
        );
    }, [groupedResults.length, itemsPerPage]);

    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;

        return groupedResults.slice(
            start,
            start + itemsPerPage
        );
    }, [groupedResults, currentPage, itemsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const totalImages = singleCompetitionResult.length;

    console.log("Competition Result:", competitionResult);
    console.log("Single Competition Result:", singleCompetitionResult);
    console.log("Filtered Results:", filteredResults);

    return (
        <>
            <Loader show={isLoading} />

            {!isLoading && (
                <>

                    <NavigationRoute />
                    <HeaderRoute title="Season Results" />

                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: "1820px", }} >
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card" style={{ width: "170%", }} >
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">
                                                    Gallery Uploaded by Club Members
                                                </small>
                                                <h2 className="name">
                                                    Season Results
                                                </h2>
                                                <p className="role">
                                                    Ryton Camera Club
                                                </p>
                                            </div>
                                        </div>

                                        <div className="search-bar d-flex" style={{ alignItems: "center", gap: "10px", }} >
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search member or image..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>

                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">
                                                Images
                                            </small>
                                            <h3 className="number">
                                                {totalImages}
                                            </h3>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div style={{ display: 'flex', justifyContent: 'right', margin: '30px' }}>
                                <button type="button" style={{ width: "184px", height: '40px', border: "none", background: "#4C4036", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: '400' }} onClick={() => navigate('/judge')} >
                                    Open for Judging
                                </button>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: "1820px", }} >
                                <div className="card" style={{ border: 'none' }}>
                                    {filteredResults.length === 0 && (
                                        <div style={{ textAlign: "center", padding: "50px", }} >
                                            <h3>
                                                No competition entries found
                                            </h3>
                                            <p>
                                                Try another search.
                                            </p>
                                        </div>
                                    )}
                                    {paginatedCards.length > 0 && (
                                        <div className="entrycard" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "25px", }} >
                                            {paginatedCards.map((group) => {
                                                const visibleEntries = group.entries.slice(0, 3);
                                                const totalEntries = group.entries.length;
                                                return (
                                                    <div className="entercard" key={group.member_comp_id} style={{ overflow: "hidden", background: "#fff", width: '472px', height: '411px', borderRadius: '13.89px', border: '1px solid #99816B' }} >
                                                        <div className="details" style={{ padding: "18px", }} >
                                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px", justifyContent: 'space-between' }} >
                                                                <img src={group.member_profile_image} alt={group.member_name || "Member"} style={{ width: "67px", height: "67px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd", }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: 'space-between', flexWrap: "wrap", }} >
                                                                        <h4 style={{ margin: 0, fontSize: "18px", }} >
                                                                            {group.member_name}
                                                                        </h4>
                                                                        <span style={{ display: "inline-flex", alignItems: "center", width: '87px', height: '26px', borderRadius: '14.37px', border: '1.2px solid #000000', color: 'white', backgroundColor: '#4C4036', padding: '2.39px 11.49px', gap: '4.79px', fontWeight: '400', fontSize: '14.36px', lineHeight: '19.14px', letterSpacing: '0px' }} >
                                                                            {totalEntries}{" "}
                                                                            {totalEntries === 1 ? "Entry" : "Entries"}
                                                                        </span>
                                                                    </div>
                                                                    <small className="role">
                                                                        {group.member_title}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: '40px' }} >
                                                                {visibleEntries.map((entry) => (
                                                                    <div key={entry.entry_id} style={{ borderRadius: "8px", overflow: "hidden", }} >
                                                                        <img src={entry.entry_image} alt={entry.entry_image_title || "Competition entry"} style={{ width: "131px", borderRadius: "8px", height: "131px", objectFit: "cover", display: "block", }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                        <p style={{ margin: "8px 0 0", fontSize: "14px", fontWeight: "500", }} >
                                                                            {entry.entry_image_title}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {totalEntries > 3 && (
                                                                <div style={{ textAlign: "center", marginTop: "18px", }} >
                                                                    <button type="button" onClick={() => navigate(`/competitions/seasons/${id}/${group.member_comp_id}`)} style={{ width: "426px", height: '53px', border: "none", background: "#CC445E", color: "#fff", padding: "12px 147px", borderRadius: "8px", cursor: "pointer", fontSize: "19px", fontWeight: "400", }} >
                                                                        View All Entries
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="pb-5 mt-4">
                            <div className="container" style={{ maxWidth: "1820px", }}>
                                <div className="d-flex justify-content-end align-items-center">
                                    {totalPages > 1 && (
                                        <div className="dt-paging" >
                                            <nav aria-label="pagination">
                                                <button className="dt-paging-button previous" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                                                    ‹
                                                </button>
                                                {Array.from({ length: totalPages }, (_, index) => {
                                                    const page = index + 1; return (
                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)}>
                                                            {page}
                                                        </button>
                                                    );
                                                }
                                                )}
                                                <button className="dt-paging-button next" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                                                    ›
                                                </button>
                                            </nav>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </>
    );
}

export default SingleSeason;