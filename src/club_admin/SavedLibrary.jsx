import { useNavigate } from "react-router";

import Pro from "./assets/icons/event_list/pro.svg"
import Cal from "./assets/icons/event_list/cal.svg"
import Cam from "./assets/icons/event_list/cam.svg"
import Mess from "./assets/icons/event_list/mess.svg"
function SavedLibraryCard({ item, onRemove }) {
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
                navigate(`/events/${item.id}`);
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

            case "Pages":
                navigate(`/pages/${item.id}`);
                break;

            default:
                break;
        }
    };

    const handleEdit = () => {

        switch (item.category) {

            case "Events":
                navigate(`/events/${item.id}/edit`);
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

            case "Pages":
                navigate(`/pages/${item.id}/edit`);
                break;

            default:
                break;
        }
    };

    return (
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
                        <button className="btn me-2" id="e-edit" onClick={handleEdit}>Edit</button>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default SavedLibraryCard;
