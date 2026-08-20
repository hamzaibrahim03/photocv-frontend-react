import { useState, useEffect, useMemo, useRef } from "react";
import "../assets/css/navbar.css";

function NotificationDropdown({ onClose }) {

  const dropdownRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const defaultAvatar =
    "https://ui-avatars.com/api/?background=6aa96a&color=fff&name=User";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const formatDate = (date) => {
    const d = new Date(date);

    if (isNaN(d)) return "";

    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const cleanBody = (item) => {
    if (!item?.data?.body) return "";

    if (item.type === "photo_commented") {
      return item.data.body.replace(/“.*?”/, "");
    }

    return item.data.body;
  };

  const handleItemClick = (item) => {
    if (!item.read_at) {
      store.markAsRead(item.id);
    }

  };

  const filteredNotifications = useMemo(() => {
    if (selectedCategory === "all") {
      return store.notifications;
    }

    return store.notifications.filter(
      (n) => n.category === selectedCategory
    );
  }, [selectedCategory, store.notifications]);

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="header">
        <h4>Notifications</h4>

        <button
          className="close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="filter-bar">
        <span className="tab active">All</span>

        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="all">- Select -</option>
          <option value="social">Social</option>
          <option value="profile">
            Profile & Activity
          </option>
          <option value="club">
            Club / Events
          </option>
          <option value="notice">
            Notices / News
          </option>
        </select>
      </div>

      <div className="list">
        {filteredNotifications.length ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className="item"
              onClick={() =>
                handleItemClick(item)
              }
            >
              <img
                className="avatar"
                src={
                  item.actor?.profile_image_url ||
                  defaultAvatar
                }
                alt=""
              />

              <div className="content">
                <p className="note">
                  <strong>
                    {item.data?.actor_name}
                  </strong>{" "}
                  {cleanBody(item)}

                  {item.type ===
                    "photo_liked" && (
                      <>
                        {" "}
                        "
                        {
                          item.data
                            ?.photo_title
                        }
                        "
                      </>
                    )}
                </p>

                <span className="date">
                  {formatDate(
                    item.created_at
                  )}
                </span>
              </div>

              {!item.read_at && (
                <span className="dot"></span>
              )}
            </div>
          ))
        ) : (
          <p className="d-flex flex-column justify-content-center align-items-center">
            No notifications
          </p>
        )}
      </div>

      <div
        className="footer"
        onClick={() => {
          store.markAllAsRead();
          onClose();
        }}
      >
        Mark all as read
      </div>
    </div>
  );
}

export default NotificationDropdown;