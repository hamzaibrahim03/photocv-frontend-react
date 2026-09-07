import { useNavigate } from "react-router";
import Ima from "./assets/icons/gallery/image.svg";
import Hea from "./assets/icons/gallery/heart.svg";
import Com from "./assets/icons/gallery/comment.svg";
import Pro from "./assets/icons/event_list/pro.svg"
import Cal from "./assets/icons/event_list/cal.svg"
import Cam from "./assets/icons/event_list/cam.svg"
import Mess from "./assets/icons/event_list/mess.svg"
function SavedLibraryCard({ item, index, onRemove }) {
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    const navigate = useNavigate();
    const handleView = () => {
        switch (item.category) {
            case "Events":
                navigate(`/event/${item.id}`);
                break;
            case "Competitions":
                navigate(`/competitions/${item.id}`);
                break;
            case "News":
                navigate(`/news/${item.id}`);
                break;
            case "Notices":
                navigate(`/notices/${item.id}`);
                break;
            case "Galleries":
                navigate("/gallery");
                break;
            default:
                break;
        }
    };
    const handleEdit = () => {
        switch (item.category) {
            case "Events":
                navigate(`/event/${item.id}/edit`);
                break;
            case "Competitions":
                navigate(`/competitions/${item.id}/edit`);
                break;
            case "News":
                navigate(`/news/${item.id}/edit`);
                break;
            case "Notices":
                navigate(`/notices/${item.id}/edit`);
                break;
            default:
                break;
        }
    };
    if (item.category === "Galleries") {
        return (
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div key={item.id}>
                    <div className="galleriy">
                        <div className="galleriy-item">
                            {item.image ? (
                                <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '370px', objectFit: 'cover' }} />
                            ) : (
                                <div className="fallback-box">
                                    No Image
                                </div>
                            )}
                            <div className="galleriy-infos" style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                <div className="gal-item">
                                    {item.profileImage ? (
                                        <img className="img-fluid event-img" style={{ width: '40px', height: '40px' }} src={item.profileImage} alt="Profile" />
                                    ) : (
                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                                        </div>
                                    )}
                                    <div className="gal-details">
                                        <span>
                                            {item.title || "Gallery"}
                                        </span>
                                    </div>
                                    <br />
                                    <button className="btn me-2" id="e-edit" onClick={() => onRemove(item)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                                <div className="profile-icon d-flex justify-content-between mt-2">
                                    <div className="icons">
                                        <span>
                                            {item.photos || 0}
                                        </span>
                                        <img src={Ima} alt="Images" style={{ width: '14px', height: '14px' }} />
                                    </div>
                                    <div className="icons">
                                        <span>
                                            {item.likes || 0}
                                        </span>
                                        <img src={Hea} alt="Likes" style={{ width: '14px', height: '14px' }} />
                                    </div>
                                    <div className="icons">
                                        <span>
                                            {item.comments || 0}
                                        </span>
                                        <img src={Com} alt="Comments" style={{ width: '14px', height: '14px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="custom-card mb-3 p-3">
                <div className="d-flex gap-3" style={{ flex: 1 }}>
                    {item.image ? (
                        <img src={item.image} alt={item.title} />
                    ) : (
                        <div>
                            No Image
                        </div>
                    )}
                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5>
                                {item.title}
                            </h5>
                            <div className="e-icon-container ms-3">
                                <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                            </div>
                        </div>
                        {item.date && (
                            <p className="date" style={{ color: 'black' }}>
                                {formatDate(item.date) || 'Date Not Available'}
                            </p>
                        )}
                        <p className="text-secondary" dangerouslySetInnerHTML={{ __html: item.description || "No description provided." }}>
                        </p>
                        <div className="button-group d-flex align-items-center gap-2">
                            <button className="btn me-2" id="e-view" onClick={handleView}>View</button>
                            {item.category !== "Galleries" && (
                                <button className="btn me-2" id="e-edit" onClick={handleEdit}>Edit</button>
                            )}
                            <button className="btn me-2" id="e-edit" onClick={() => onRemove(item)}>Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SavedLibraryCard;
