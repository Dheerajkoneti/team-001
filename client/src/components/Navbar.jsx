import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Vote,
  PlusCircle,
  Users,
  UserPlus,
  User,
  Zap,
  BarChart3,
  Shield,
  Bell,
  Globe,
  Building2,
  GitCompare,
  MessageSquare
} from "lucide-react";
import { getNotifications } from "../services/notificationService";

function Navbar() {
  const location = useLocation();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user?._id) return;
        const res = await getNotifications();
        const notifications = Array.isArray(res.data) ? res.data : res.data?.notifications || [];
        
        const unread = notifications.filter(
          n => !n.isRead
        ).length;
        setCount(unread);
      } catch (err) {
        console.log("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [user?._id]);

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />
    },

    {
      path: "/polls",
      label: "Polls",
      icon: <Vote size={18} />
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      badge: count
    },
    {
      path: "/option-comparison",
      label: "Option Compare",
      icon: <GitCompare size={18} />
    },
    // All roles can create polls
    ...(role === "user" ||
    role === "moderator" ||
    role === "admin"
      ? [
          {
            path: "/polls/create",
            label: "Create Poll",
            icon: <PlusCircle size={18} />
          }
        ]
      : []),

    {
      path: "/teams",
      label: "Teams",
      icon: <Users size={18} />
    },

    // Moderator & Admin only
    ...(role === "user" ||
    role === "moderator" ||
    role === "admin"
      ? [
          {
            path: "/teams/create",
            label: "Create Team",
            icon: <UserPlus size={18} />
          }
        ]
      : []),

    ...(role === "admin" ||
    role === "moderator"
      ? [
          {
            path: "/communities/create",
            label: "Create Community",
            icon: <Building2 size={18} />
          }
        ]
      : []),
    {
      path: "/communities",
      label: "Communities",
      icon: <Globe size={18} />
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <BarChart3 size={18} />
    },

    {
      path: "/profile",
      label: "Profile",
      icon: <User size={18} />
    },

    ...(role === "admin"
    ? [
        {
          path: "/admin-feedbacks",
          label: "User Feedbacks",
          icon: <MessageSquare size={18} />
        }
      ]
    : [
        {
          path: "/feedback",
          label: "Feedback",
          icon: <MessageSquare size={18} />
        }
      ]),

    // Admin only
    ...(role === "admin"
      ? [
          {
            path: "/manage-users",
            label: "Manage Users",
            icon: <Shield size={18} />
          }
        ]
      : [])
  ];

  return (
    <div style={styles.navbar}>
      <style>{`
        .nav-link {
          transition: all 0.25s ease !important;
        }

        .nav-link:hover {
          background: rgba(56, 189, 248, 0.1) !important;
          color: #38bdf8 !important;
          transform: translateX(4px);
        }

        .nav-link.active {
          background: linear-gradient(
            135deg,
            rgba(14, 165, 233, 0.2),
            rgba(139, 92, 246, 0.2)
          ) !important;
          color: #38bdf8 !important;
          border-left: 4px solid #38bdf8;
        }
      `}</style>

      {/* Logo */}
      <div style={styles.logoBrand}>
        <div style={styles.logoBadge}>
          <Zap size={20} color="#38bdf8" />
        </div>

        <div>
          <h2 style={styles.logoText}>DecisionHub</h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              margin: 0,
              textTransform: "capitalize"
            }}
          >
            {role}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.linksContainer}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{
                ...styles.linkItem,
                color: isActive ? "#38bdf8" : "#94a3b8",
                background: isActive
                  ? "rgba(56, 189, 248, 0.1)"
                  : "transparent",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span
                  style={{
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "700"
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    flex: "0 0 280px",
    width: "280px",
    minWidth: 0,
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(20px)",
    height: "100vh",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  logoBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "25px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "20px",
  },

  logoBadge: {
    width: "38px",
    height: "38px",
    background: "rgba(56, 189, 248, 0.12)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)",
  },

  logoText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
  },

  linksContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },

  linkItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default Navbar;