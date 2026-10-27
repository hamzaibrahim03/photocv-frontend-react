import { useEffect, useMemo, useState } from "react";
import Loader from "../Ryton/extra/LoaderAll";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Ima from './assets/icons/member/image.svg';
import { useNavigate } from "react-router";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Seasons() {
    const [isLoading, setIsLoading] = useState(true);
    const [competitionResult, setCompetitionResult] = useState([])
    const [competitionExtra, setCompetitionExtra] = useState({})
    const [competitionData, setCompetitionData] = useState({})
    const [search, setSearch] = useState("");
    const [itemsPerPage] = useState(24);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate()

    useEffect(() => {
        const load = async (path, fallback, setter, label) => {
            try {
                const response = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
                const data = await response.json();
                setter(data?.data ?? fallback);
            } catch (error) {
                console.error(`${label} Error:`, error);
                setter(fallback);
            }
        };

        Promise.all([
            load("/competitions", {}, setCompetitionData, "Competition Data"),
            load("/competition-extras", {}, setCompetitionExtra, "Competition Extra"),
            load("/competition-results", [], (data) => setCompetitionResult(Array.isArray(data?.original?.data) ? data?.original?.data : []), "Competition Result"),
        ]).finally(() => {
            setIsLoading(false);
        });
    }, []);
    console.log(competitionResult)

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const filteredResults = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return competitionResult;
        }

        return competitionResult.filter((item) => {
            const memberName = `${item?.member?.first_name || ""} ${item?.member?.last_name || ""
                }`.toLowerCase();
            const competitionName = (item?.name || "").toLowerCase();

            return memberName.includes(keyword) || competitionName.includes(keyword);
        });
    }, [competitionResult, search]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredResults.length / itemsPerPage),
            1
        );
    }, [filteredResults.length, itemsPerPage]);

    const paginatedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;

        return filteredResults.slice(
            start,
            start + itemsPerPage
        );
    }, [filteredResults, currentPage, itemsPerPage]);

    const chunkedCards = useMemo(() => {
        const chunks = [];

        for (let i = 0; i < paginatedCards.length; i += 4) {
            chunks.push(paginatedCards.slice(i, i + 4));
        }

        return chunks;
    }, [paginatedCards]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getMedalIcon = (position) => {
        switch (Number(position)) {
            case 1:
                return { src: new URL('./assets/icons/positions/1.svg', import.meta.url).href, name: 'First Medal' };
            case 2:
                return { src: new URL('./assets/icons/positions/2.svg', import.meta.url).href, name: 'Second Medal' };
            default:
                return null;
        }
    };

    const competitionCount = competitionData?.competitions?.original?.data?.length ?? 0;
    const competitionsToGo = competitionExtra?.current_month_competition_count ?? 0;

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Season Results" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card" style={{ width: '160%' }}>
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Planned and regular club competition</small>
                                                    <h2 className="name">2024 - 2025 Season</h2>
                                                    <p className="role">{competitionsToGo} Competitions to go</p>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={handleSearch} />
                                                <i className="fas fa-search"></i>
                                            </div>

                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Competitions</small>
                                                <h3 className="number">{competitionCount}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: "1820px" }} >
                                    {chunkedCards.length > 0 ? (
                                        chunkedCards.map((row, rowIndex) => (
                                            <div key={rowIndex} className="row-wrapper d-flex mb-4" >
                                                <div className="photographers d-flex flex-wrap mt-2">
                                                    {row.map((result) => {
                                                        const member = result?.member;
                                                        const entries = (result?.competition_members || []).flatMap((cm) => cm?.entries || []);
                                                        const memberName = [member?.first_name, member?.last_name,]
                                                            .filter(Boolean)
                                                            .join(" ");
                                                        return (
                                                            <div key={result.id} className="photographer-card bg-white text-center shadow-sm position-relative" onClick={() => navigate(`/competitions/seasons/${result.id}`)}>
                                                                <div className="text-center mb-3">
                                                                    {result?.featured_image_url ? (
                                                                        <img src={result.featured_image_url} className="profile-pic rounded-circle d-block object-fit-cover mx-auto" style={{ marginTop: "20px", width: "192px", height: "192px", }} alt={memberName || "Profile"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    ) : (
                                                                        <div className="fallback-box rounded-circle d-flex justify-content-center align-items-center bg-light mx-auto" style={{ width: "192px", height: "192px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", }} >
                                                                            <i className="fa-regular fa-user text-secondary" style={{ fontSize: "48px", }} />
                                                                        </div>
                                                                    )}
                                                                    <h4 className="mt-3 mb-1">
                                                                        {result.name}
                                                                    </h4>
                                                                    <small className="text-muted">
                                                                        {" "}
                                                                        {result.name}
                                                                    </small>
                                                                </div>
                                                                <div className="social-icons d-flex justify-content-center gap-3 text-white" style={{ backgroundColor: '#d64561' }}>
                                                                    <div className="icon d-flex align-items-center gap-2"><span style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'right', }}>{entries.length}</span><img src={Ima} alt="icon" style={{ width: '20px', height: '20px', borderRadius: '0px' }} /></div>
                                                                </div>
                                                                <div className="gallery-preview d-flex">
                                                                    {entries.length > 0 ? (entries.slice(0, 2).map((entry) => {
                                                                        const medal = getMedalIcon(entry?.position);
                                                                        return (
                                                                            <div key={entry.id} className="pic-item position-relative" >
                                                                                {entry?.entry_image_url ? (
                                                                                    <div style={{ position: "relative" }}>
                                                                                        <img src={entry.entry_image_url} alt={entry.entry_image_title || "Competition entry"} style={{ width: "170px", height: "123px", objectFit: "cover", display: "block", marginTop: '0px', marginBottom: '0px', borderRadius: '0px' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.jpg"; }} />

                                                                                        {medal && (
                                                                                            <div className="pic-info" style={{ height: '30px' }}>
                                                                                                <img src={medal.src} alt={medal.name} style={{ position: "relative", top: "0px", right: "8px", width: "22px", height: "26px" }} />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="d-flex justify-content-center align-items-center bg-light text-muted" style={{ height: "180px" }} >
                                                                                        No image
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })
                                                                    ) : (
                                                                        <div className="text-center text-muted py-3">
                                                                            No competition entries
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted py-5">
                                            {search.trim() ? "No results match your search." : "No competition results available."}
                                        </div>
                                    )}
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
    )
}

export default Seasons
