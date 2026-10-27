import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loader from "../Ryton/extra/LoaderAll";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function SingleMemberEntries() {
    const { id, memberCompId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [itemsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadMemberEntries = async () => {
            setIsLoading(true);
            try {
                console.log("Season ID:", id);
                console.log("Member Competition ID:", memberCompId);
                const response = await fetch(
                    `${API_BASE}/competition-results/${id}`,
                    {
                        headers: authHeaders(),
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Competition API error: ${response.status}`
                    );
                }
                const json = await response.json();
                console.log("Single Season API Response:", json);
                const data = json?.data?.original?.data;
                console.log("Season Entries:", data);
                const memberEntries = Array.isArray(data)
                    ? data.filter(
                        (entry) =>
                            String(entry.member_comp_id) ===
                            String(memberCompId)
                    )
                    : [];
                console.log("Member Entries:", memberEntries);
                setEntries(memberEntries);
            } catch (error) {
                console.error("Member Entries Error:", error);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        };
        if (id && memberCompId) {
            loadMemberEntries();
        }
    }, [id, memberCompId]);

    const member = entries[0];
    const filteredEntries = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
        if (!searchValue) {
            return entries;
        }
        return entries.filter((entry) => {
            const title =
                entry?.entry_image_title?.toLowerCase() || "";
            return title.includes(searchValue);
        });
    }, [entries, search]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredEntries.length / itemsPerPage),
            1
        );
    }, [filteredEntries.length, itemsPerPage]);

    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;

        return filteredEntries.slice(
            start,
            start + itemsPerPage
        );
    }, [filteredEntries, currentPage, itemsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const getMedalIcon = (position) => {
        switch (position) {
            case 1:
                return { src: new URL('./assets/icons/positions/1.svg', import.meta.url).href, name: 'First Medal' };
            case 2:
                return { src: new URL('./assets/icons/positions/2.svg', import.meta.url).href, name: 'Second Medal' };
            case 3:
                return { src: new URL('./assets/icons/positions/3.svg', import.meta.url).href, name: 'Third Medal' };
            case 4:
                return { src: new URL('./assets/icons/positions/4.svg', import.meta.url).href, name: 'Forth Medal' };
            case 5:
                return { src: new URL('./assets/icons/positions/5.svg', import.meta.url).href, name: 'Fifth Medal' };
            case 6:
                return { src: new URL('./assets/icons/positions/6.svg', import.meta.url).href, name: 'Sixth Medal' };
            case 7:
                return { src: new URL('./assets/icons/positions/7.svg', import.meta.url).href, name: 'Seventh Medal' };
            case 8:
                return { src: new URL('./assets/icons/positions/8.svg', import.meta.url).href, name: 'Eighth Medal' };
            case 9:
                return { src: new URL('./assets/icons/positions/9.svg', import.meta.url).href, name: 'Ninth Medal' };
            case 10:
                return { src: new URL('./assets/icons/positions/c.svg', import.meta.url).href, name: 'Commended' };
            case 11:
                return { src: new URL('./assets/icons/positions/h.svg', import.meta.url).href, name: 'Highly' };
            case 12:
                return { src: new URL('./assets/icons/positions/i.svg', import.meta.url).href, name: 'Intermediate' };
            default:
                return null;
        }
    };
    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Member Entries" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: "1820px", marginBottom: "20px", }} >
                                <button type="button" onClick={() => navigate(`/competitions/seasons/${id}`)} style={{ border: "none", background: "transparent", padding: "0", cursor: "pointer", fontSize: "15px", fontWeight: "600", color: "#555", }} >
                                    ← Back to Season Results
                                </button>
                            </div>
                        </section>

                        {entries.length === 0 ? (
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", }} >
                                    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #eee", padding: "60px 20px", textAlign: "center", }} >
                                        <h3 style={{ margin: "0 0 10px", }} >
                                            No entries found
                                        </h3>
                                        <p style={{ margin: '0', color: "#777", }} >
                                            No entries were found for this member in this season.
                                        </p>
                                        <button type="button" onClick={() => navigate(`/competitions/seasons/${id}`)} style={{ marginTop: "20px", border: "none", background: "#4C4036", color: "#fff", padding: "11px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", }} >
                                            Back to Season
                                        </button>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <>
                                <section>
                                    <div className="container" style={{ maxWidth: "1820px", }} >
                                        <div className="dashboard-card" id="cl" >
                                            <div className="profile-card">
                                                <div className="profile-left">
                                                    <img src={member.member_profile_image} alt={member.member_name || "Member"} style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd", }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                    <div className="profile-info">
                                                        <div style={{ marginLeft: '10px' }}>
                                                            <h2 style={{ margin: '0', fontSize: "26px", fontWeight: "700", color: "#222", }} >
                                                                {member.member_name}
                                                            </h2>
                                                            <p style={{ margin: "6px 0", color: "#777", fontSize: "14px", }} >
                                                                {member.member_title}
                                                            </p>
                                                            <p style={{ margin: '0', color: "#999", fontSize: "13px", }} >
                                                                Competition ID:{" "} {member.member_comp_id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="search-bar d-flex" style={{ alignItems: "center", gap: "10px", }} >
                                                    <input type="search" id="dt-search-1" className="search-input" placeholder="Search entry..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                                    <i className="fas fa-search"></i>
                                                </div>
                                            </div>

                                            <div className="card-section">
                                                <div className="stat-card">
                                                    <small className="ca-details">
                                                        Total Entries
                                                    </small>
                                                    <h3 className="number">
                                                        {entries.length}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="container" style={{ maxWidth: "1820px", }} >
                                        <div className="card" style={{ marginTop: '15px', paddingTop: '15px', width: '1480px', border: 'none' }}>
                                            <h1 className="head">Result Galleries</h1>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} >
                                                {paginatedCards.map((entry, index) => (
                                                    <div key={entry.entry_id || index} onClick={() => navigate(`/competitions/seasons/${id}/${memberCompId}/${entry.entry_id}`)} style={{ background: "#fff", overflow: "hidden", cursor: "pointer", }} >
                                                        <img src={entry.entry_image} alt={entry.entry_image_title || "Competition entry"} style={{ width: "493px", height: "370px", objectFit: "cover", display: "block", }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                        <div style={{ padding: "16px", backgroundColor: index % 2 === 0 ? "#99816b" : "#4c4036" }} >
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", }} >
                                                                <div>
                                                                    <img src={entry.member_profile_image} alt={entry.member_name || "Member"} style={{ width: "45px", height: "45px", borderRadius: "7px", objectFit: "cover", border: "1px solid #ddd", }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    <span style={{ fontSize: "16px", color: "white", fontWeight: "500", marginLeft: '15px' }} >
                                                                        {entry.member_name}
                                                                    </span>
                                                                </div>
                                                                {entry.position && (
                                                                    <span style={{ padding: "4px 8px", borderRadius: "5px", color: "#555", fontSize: "12px", fontWeight: "600", }} >
                                                                        {getMedalIcon(entry.position) && (
                                                                            <img src={getMedalIcon(entry.position).src} alt={getMedalIcon(entry.position).name} id="sco-medal-inline" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                )}
                                            </div>
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
                            </>
                        )}
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                            </div>
                        </footer>
                    </div>
                </>
            )
            }
        </>
    );
}

export default SingleMemberEntries;