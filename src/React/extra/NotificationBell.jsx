import { useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import "../assets/css/navbar.css";

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="notification-wrapper">
      <button className="bell-btn" onClick={toggle}>
        <i className="fa-regular fa-bell text-lg mx-3" style={{ fontSize: "22px" }}></i>

        {/* {unreadCount > 0 && (
          <span className="badge rounded-pill badge-notification bg-danger">
            {unreadCount}
          </span>
        )} */}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

export default NotificationBell;
