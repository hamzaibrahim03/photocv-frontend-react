import { useState, useEffect, useRef } from "react";
import "./assets/css/memberdraw.css";
import apiClient from "../api/axios";

function CommentsDrawMember({ photo, onClose }) {
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
        <div className="md-drawer-overlay">
            <div className="md-drawer">
                <div className="md-top">
                    <span className="md-title">Details</span>
                    <button className="md-close" onClick={onClose}>×</button>
                </div>
                <div className="md-block">
                    <div className="md-block-head" onClick={() => setExifOpen(!exifOpen)}>
                        <span>EXIF Details</span>
                        <span className="md-chev">{exifOpen ? "⌃" : "⌄"}</span>
                    </div>

                    {exifOpen && (
                        <div className="md-exif-grid">
                            <div className="md-exif-item">
                                <label>Camera</label><br />
                                <span>{exif?.camera_model}</span>
                            </div>
                            <div className="md-exif-item">
                                <label>Focal Length</label><br />
                                <span>{exif?.focal_length}</span>
                            </div>

                            <div className="md-exif-item">
                                <label>Lens</label><br />
                                <span>{exif?.lens}</span>
                            </div>
                            <div className="md-exif-item">
                                <label>Aperture</label><br />
                                <span>{exif?.aperture}</span>
                            </div>

                            <div className="md-exif-item">
                                <label>Shutter Speed</label><br />
                                <span>{exif?.shutter_speed}</span>
                            </div>
                            <div className="md-exif-item">
                                <label>ISO</label><br />
                                <span>{exif?.iso}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="md-block md-comments-block">
                    <div className="md-block-head" onClick={() => setCommentsOpen(!commentsOpen)}>
                        <span>Comments</span>
                        <span className="md-chev"> {commentsOpen ? "⌃" : "⌄"}</span>
                    </div>


                    {commentsOpen && (
                        <>
                            <div className="cd-comments" ref={commentsRef}>

                                {comments.length > 0 ? (
                                    comments.map((c) => (
                                        <div className="md-comment" key={c.id}>
                                            <strong>{c.posted_by || "User"}</strong>
                                            <p>{c.comment}</p>
                                            <small>{time(c.posted_at)}</small>
                                        </div>
                                    ))
                                ) : (
                                    <p className="md-empty">No comments yet</p>
                                )}
                            </div>



                            <div className="md-input-bar">

                                <input type="text" value={newComment} placeholder="Add a comment..." onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && postComment()} />

                                <button onClick={postComment} disabled={posting}>{posting ? "..." : "➤"}</button>

                            </div>
                            <div className="md-comment-stats">
                                <div className="md-stat">
                                    <span className="md-icon heart">♥</span>
                                    <span className="md-count">{like}</span>
                                </div>

                                <div className="md-stat">
                                    <span className="md-icon comment">💬</span>
                                    <span className="md-count">{comments.length}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div >
            </div >
        </div >
    );
}

export default CommentsDrawMember;

