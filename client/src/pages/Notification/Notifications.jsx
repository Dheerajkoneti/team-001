const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCircle2, Trash2, Clock, Inbox, Sparkles, CheckCheck } from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${__DECISIONHUB_API_ORIGIN__}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = Array.isArray(res.data) ? res.data : res.data?.notifications || [];
      setNotifications(data);
    } catch (err) {
      console.log("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${__DECISIONHUB_API_ORIGIN__}/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.log("Failed to update notification", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) =>
            axios.put(
              `${__DECISIONHUB_API_ORIGIN__}/api/notifications/${n._id}/read`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
      );
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.log("Failed to mark all as read", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${__DECISIONHUB_API_ORIGIN__}/api/notifications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.log("Failed to delete notification", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={styles.container}>
      <style>{`
        .notif-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .notif-card:hover {
          transform: translateY(-3px);
          border-color: rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 15px 30px -5px rgba(14, 165, 233, 0.15);
        }
        .action-btn:hover {
          background: rgba(56, 189, 248, 0.2) !important;
          color: #38bdf8 !important;
          transform: scale(1.05);
        }
        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          color: #f87171 !important;
          transform: scale(1.05);
        }
        .mark-all-btn:hover {
          background: rgba(139, 92, 246, 0.25) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
        }
      `}</style>

      {/* Header Section */}
      <div style={styles.headerRow}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={styles.iconBadge}>
            <Bell size={24} color="#38bdf8" />
          </div>
          <div>
            <h2 style={styles.title}>Notifications</h2>
            <p style={styles.subtitle}>Stay updated with your latest alerts and activities</p>
          </div>
        </div>
        
        <div style={styles.headerActions}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="mark-all-btn"
              style={styles.markAllBtn}
            >
              <CheckCheck size={16} />
              <span>Mark all read</span>
            </button>
          )}
          <div style={styles.badgeCount}>
            <Sparkles size={14} color="#38bdf8" />
            <span>{unreadCount} Unread</span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={styles.emptyState}>
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Inbox size={42} color="#64748b" />
          </div>
          <h3 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700" }}>All caught up!</h3>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>You have no new notifications right now.</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {notifications.map((n) => {
            const isUnread = !n.isRead;
            return (
              <div
                key={n._id}
                className="notif-card"
                style={{
                  ...styles.card,
                  background: isUnread 
                    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))" 
                    : "rgba(15, 23, 42, 0.4)",
                  borderColor: isUnread ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.05)",
                  borderLeft: isUnread ? "4px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={styles.cardContent}>
                  <div style={styles.cardTop}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {isUnread && <span style={styles.unreadDot} />}
                      <h4 style={{ ...styles.cardTitle, color: isUnread ? "#fff" : "#94a3b8" }}>
                        {n.title}
                      </h4>
                    </div>
                    <div style={styles.timeTag}>
                      <Clock size={12} color="#94a3b8" />
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p style={styles.cardMessage}>{n.message}</p>
                </div>

                <div style={styles.cardActions}>
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(n._id)}
                      className="action-btn"
                      title="Mark as read"
                      style={styles.iconButton}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="delete-btn"
                    title="Delete notification"
                    style={styles.iconButton}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "850px",
    margin: "0 auto",
    padding: "20px 10px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "20px",
  },
  iconBadge: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.15))",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 25px rgba(56, 189, 248, 0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 4px 0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  markAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    color: "#c084fc",
    padding: "9px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  badgeCount: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    color: "#38bdf8",
    padding: "9px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(56, 189, 248, 0.1)",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    borderRadius: "18px",
    padding: "22px 24px",
    border: "1px solid",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "8px",
  },
  unreadDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#38bdf8",
    boxShadow: "0 0 8px #38bdf8",
  },
  cardTitle: {
    fontSize: "17px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  timeTag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
    background: "rgba(255, 255, 255, 0.04)",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },
  cardMessage: {
    color: "#cbd5e1",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.6",
  },
  cardActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  iconButton: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "rgba(15, 23, 42, 0.4)",
    borderRadius: "24px",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
  },
  emptyIcon: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "rgba(100, 116, 139, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px auto",
    border: "1px solid rgba(100, 116, 139, 0.2)",
    boxShadow: "inset 0 0 15px rgba(100, 116, 139, 0.1)",
  },
};

export default Notifications;