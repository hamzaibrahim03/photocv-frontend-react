import { useState, useEffect, useRef } from "react";
import apiClient from "../api/axios";
import "../Ryton/assets/css/rytonstyle.css";
function CommentsDrawMember({ photo, onClose }) {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [exifOpen, setExifOpen] = useState(true);
    const [commentsOpen, setCommentsOpen] = useState(true);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState("");
    const commentsRef = useRef(null);
    const exif = photo?.exif || {};
    const like = Number(photo?.likes_count || 0);
    useEffect(() => {
        setComments(
            Array.isArray(photo?.comments)
                ? photo.comments
                : []
        );
    }, [photo]);
    const postComment = async () => {
        if (!newComment.trim() || posting || !photo?.photo_id) {
            return;
        }
        try {
            setPosting(true);
            setPostError("");
            const response = await apiClient.post(`/photos/${photo.photo_id}/comments`,
                {
                    body: newComment.trim(),
                }
            );
            const comment = response.data?.data;
            if (!comment) {
                throw new Error("Comment was not saved. Please try again.");
            }
            setComments((previous) => [
                ...previous,
                comment,
            ]);
            setNewComment("");
            setTimeout(() => {
                commentsRef.current?.scrollTo({
                    top: commentsRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        } catch (err) {
            console.error("Error posting comment:", err);
            setPostError(
                err.response?.data?.message || err.message || "Failed to post comment. Please try again."
            );
        } finally {
            setPosting(false);
        }
    };
    const time = (date) => {
        if (!date) {
            return "";
        }
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }
        return parsedDate.toLocaleDateString();
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);
    return (
        <div className="drawer-overlay" onClick={(event) => { if (event.target === event.currentTarget) { onClose?.(); } }} style={{ backgroundColor: 'black', height: '80vh', position: 'fixed', top: '150px', right: '50px', bottom: '0', width: '680px', pointerEvents: 'auto', zIndex: '50', overflowY: 'auto' }} >
            <div className="drawer">
                <div className="top">
                    <span className="title" style={{ color: 'white' }}>
                        Details
                    </span>
                    <button type="button" className="close" onClick={onClose} aria-label="Close" style={{ color: 'white' }} >
                        ×
                    </button>
                </div>

                <div className="block">
                    <h5 className="mb-2" style={{ color: 'white' }}>
                        {photo?.title || "Photo"}
                    </h5>
                    {photo?.galleryName && (
                        <small style={{ color: 'white' }}>
                            {photo.galleryName}
                        </small>
                    )}
                </div>

                <div className="block">
                    <div className="block-head" onClick={() => setExifOpen((previous) => !previous)} >
                        <span>
                            EXIF Details
                        </span>
                        <span className="chev">
                            {exifOpen ? "⌃" : "⌄"}
                        </span>
                    </div>
                    {exifOpen && (
                        <div className="exif-grid">
                            <div className="exif-item">
                                <label>
                                    Camera
                                </label>
                                <br />
                                <span>
                                    {exif?.camera_model || "-"}
                                </span>
                            </div>
                            <div className="exif-item">
                                <label>
                                    Focal Length
                                </label>
                                <br />
                                <span>
                                    {exif?.focal_length || "-"}
                                </span>
                            </div>
                            <div className="exif-item">
                                <label>
                                    Lens
                                </label>
                                <br />
                                <span>
                                    {exif?.lens || "-"}
                                </span>
                            </div>
                            <div className="exif-item">
                                <label>
                                    Aperture
                                </label>
                                <br />
                                <span>
                                    {exif?.aperture || "-"}
                                </span>
                            </div>
                            <div className="exif-item">
                                <label>
                                    Shutter Speed
                                </label>
                                <br />
                                <span>
                                    {exif?.shutter_speed || "-"}
                                </span>
                            </div>
                            <div className="exif-item">
                                <label>
                                    ISO
                                </label>
                                <br />
                                <span>
                                    {exif?.iso || "-"}
                                </span>
                            </div>
                            <div className="exif-item">
                                <label>
                                    Captured At
                                </label>
                                <br />
                                <span>
                                    {exif?.captured_at || "-"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="block comments-block">
                    <div className="block-head" onClick={() => setCommentsOpen((previous) => !previous)} >
                        <span>
                            Comments
                        </span>
                        <span className="chev">
                            {commentsOpen ? "⌃" : "⌄"}
                        </span>
                    </div>
                    {commentsOpen && (
                        <>
                            <div className="comments" ref={commentsRef} >
                                {comments.length > 0 ? (
                                    comments.map(
                                        (comment, index) => (
                                            <div className="comment" key={comment?.id ?? index} >
                                                <strong style={{ color: 'white' }}>
                                                    {comment?.posted_by || "User"}
                                                </strong>
                                                <p style={{ color: 'white' }}>
                                                    {comment?.comment || ""}
                                                </p>
                                                <small>
                                                    {time(comment?.posted_at)}
                                                </small>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="empty">
                                        No comments yet
                                    </p>
                                )}
                            </div>

                            {postError ? (
                                <p className="empty" style={{ color: "#e74c3c" }}>
                                    {postError}
                                </p>
                            ) : null}
                            <div className="input-bar">
                                <input type="text" value={newComment} placeholder="Add a comment..." onChange={(event) => setNewComment(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { postComment(); } }} />
                                <button type="button" onClick={postComment} disabled={posting} >
                                    {posting ? "..." : "➤"}
                                </button>
                            </div>
                            <div className="comment-stats">
                                <div className="stat">
                                    <span className="icon heart">
                                        ♥
                                    </span>
                                    <span className="count">
                                        {like}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="icon comment">
                                        💬
                                    </span>
                                    <span className="count">
                                        {comments.length}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
export default CommentsDrawMember;