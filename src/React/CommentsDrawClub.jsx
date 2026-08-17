import { useState, useEffect, useRef } from "react";
import "./assets/css/rytonstyle.css";
import apiClient from "../api/axios";

function CommentsDrawClub({ photo, onClose }) {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [exifOpen, setExifOpen] = useState(true);
    const [commentsOpen, setCommentsOpen] = useState(true);
    const [posting, setPosting] = useState(false);

    const commentsRef = useRef(null);

    const exif = photo?.exif || {};
    const like = photo?.likes_count || 0;

    useEffect(() => {
        setComments(photo?.comments || []);
    }, [photo]);

    const postComment = async () => {
        if (!newComment.trim() || posting) return;

        try {
            setPosting(true);

            const response = await apiClient.post(
                `/photos/${photo.photo_id}/comments`,
                {
                    body: newComment,
                }
            );

            console.log("Comment Response:", response.data);

            const comment = response.data?.data || {
                id: Date.now(),
                comment: newComment,
                posted_by: "You",
                posted_at: new Date().toISOString(),
            };

            setComments((prev) => [...prev, comment]);
            setNewComment("");

            setTimeout(() => {
                commentsRef.current?.scrollTo({
                    top: commentsRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        } catch (err) {
            console.log("Error:", err);

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Response:", err.response.data);
            } else {
                console.log(err.message);
            }
        } finally {
            setPosting(false);
        }
    };

    const time = (date) =>
        date ? new Date(date).toLocaleDateString() : "";

    return (
        <div className="drawer-overlay">
            <div className="drawer">

                <div className="top">
                    <span className="title"></span>

                    <button className="close" onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* EXIF DETAILS */}

                <div className="block">

                    <div className="block-head" onClick={() => setExifOpen(!exifOpen)}>
                        <span>EXIF Details</span>
                        <span>{exifOpen ? "⌃" : "⌄"}</span>
                    </div>

                    {exifOpen && (
                        <div className="exif-grid">

                            <div className="exif-item">
                                <label>Camera</label>
                                <span>{exif.camera_model}</span>
                            </div>

                            <div className="exif-item">
                                <label>Focal Length</label>
                                <span>{exif.focal_length}</span>
                            </div>

                            <div className="exif-item">
                                <label>Lens</label>
                                <span>{exif.lens}</span>
                            </div>

                            <div className="exif-item">
                                <label>Aperture</label>
                                <span>{exif.aperture}</span>
                            </div>

                            <div className="exif-item">
                                <label>Shutter Speed</label>
                                <span>{exif.shutter_speed}</span>
                            </div>

                            <div className="exif-item">
                                <label>ISO</label>
                                <span>{exif.iso}</span>
                            </div>

                        </div>
                    )}

                </div>

                {/* COMMENTS */}

                <div className="block comments-block">

                    <div className="block-head" onClick={() => setCommentsOpen(!commentsOpen)}>
                        <span>Comments</span>
                        <span>{commentsOpen ? "⌃" : "⌄"}</span>
                    </div>

                    {commentsOpen && (
                        <>
                            <div className="comments" ref={commentsRef}>

                                {comments.length > 0 ? (
                                    comments.map((c) => (
                                        <div className="comment" key={c.id}>
                                            <strong>{c.posted_by || "User"}</strong>
                                            <p>{c.comment}</p>
                                            <small>{time(c.posted_at)}</small>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty">
                                        No comments yet
                                    </p>
                                )}

                            </div>

                            <div className="input-bar">

                                <input type="text" value={newComment} placeholder="Add a comment..." onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && postComment()} />

                                <button onClick={postComment} disabled={posting}>{posting ? "..." : "➤"}</button>

                            </div>

                            <div className="comment-stats">

                                <div className="stat">
                                    <span className="icon heart">♥</span>
                                    <span>{like}</span>
                                </div>

                                <div className="stat">
                                    <span className="icon comment">💬</span>
                                    <span>{comments.length}</span>
                                </div>

                            </div>

                        </>
                    )}

                </div>

            </div>
        </div>
    );
}

export default CommentsDrawClub;