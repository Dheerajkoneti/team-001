const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiUserCheck,
  FiFilter,
  FiSave,
} from "react-icons/fi";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedRoles, setSelectedRoles] = useState({});
  const [updatingUsers, setUpdatingUsers] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const timeoutRef = useRef(null);
  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    clearTimeout(timeoutRef.current);

    setToast({ show: true, message, type });

    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  useEffect(() => {
    fetchUsers();

    return () => clearTimeout(timeoutRef.current);
    // Fetch users when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${__DECISIONHUB_API_ORIGIN__}/api/users/all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const fetchedUsers = res.data.users || [];
      setUsers(fetchedUsers);

      // Remove unsaved selections for users that no longer exist.
      setSelectedRoles((previous) => {
        const next = {};

        fetchedUsers.forEach((user) => {
          if (
            Object.prototype.hasOwnProperty.call(previous, user._id) &&
            previous[user._id] !== user.role
          ) {
            next[user._id] = previous[user._id];
          }
        });

        return next;
      });
    } catch (err) {
      console.error(
        "Fetch users error:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message || "Failed to fetch users.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((previous) => ({
      ...previous,
      [userId]: role,
    }));
  };

  const updateRole = async (userId) => {
    const user = users.find((item) => item._id === userId);
    const role = selectedRoles[userId] ?? user?.role;

    if (!user || !role) {
      showToast("User or role not found.", "error");
      return;
    }

    if (role === user.role) {
      showToast("No changes to save.", "error");
      return;
    }

    try {
      setUpdatingUsers((previous) => ({
        ...previous,
        [userId]: true,
      }));

      const response = await axios.put(
        `${__DECISIONHUB_API_ORIGIN__}/api/users/update-role`,
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        // Update the displayed role only after the server succeeds.
        setUsers((previous) =>
          previous.map((item) =>
            item._id === userId ? { ...item, role } : item
          )
        );

        setSelectedRoles((previous) => {
          const next = { ...previous };
          delete next[userId];
          return next;
        });

        showToast("Role updated successfully!", "success");
      }
    } catch (err) {
      console.error(
        "Update role error:",
        err.response?.status,
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Failed to update role. Please try again.",
        "error"
      );
    } finally {
      setUpdatingUsers((previous) => ({
        ...previous,
        [userId]: false,
      }));
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const currentRole = selectedRoles[user._id] ?? user.role;
    const matchesRole =
      roleFilter === "all" || currentRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)",
        color: "white",
        padding: "40px",
        boxSizing: "border-box",
        fontFamily: "system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .glass-card {
          background: rgba(30, 41, 59, 0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
        }

        .custom-input:focus {
          border-color: #38bdf8 !important;
          outline: none;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
        }

        .table-row {
          transition: background 0.2s ease;
        }

        .table-row:hover {
          background: rgba(56, 189, 248, 0.04);
        }

        .save-role-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white;
          border: none;
          padding: 9px 14px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
          white-space: nowrap;
        }

        .save-role-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .save-role-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(56, 189, 248, 0.25);
        }

        .role-select {
          max-width: 100%;
          padding: 9px 12px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          color: white;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .manage-users-content {
            padding: 20px !important;
          }
        }
      `}</style>

      {/* Toast notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 9999,
              background:
                toast.type === "success"
                  ? "rgba(5, 150, 105, 0.96)"
                  : "rgba(220, 38, 38, 0.96)",
              color: "white",
              padding: "14px 20px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 600,
              maxWidth: "calc(100vw - 40px)",
            }}
          >
            {toast.type === "success" ? (
              <FiCheckCircle size={20} />
            ) : (
              <FiAlertCircle size={20} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="manage-users-content" style={{ padding: 0 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                background: "rgba(56, 189, 248, 0.15)",
                padding: "14px",
                borderRadius: "16px",
                border: "1px solid rgba(56, 189, 248, 0.3)",
              }}
            >
              <FiUsers size={28} color="#38bdf8" />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 900,
                  background: "linear-gradient(to right, #38bdf8, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                User Management Hub
              </h1>

              <p style={{ margin: "4px 0 0", color: "#94a3b8" }}>
                Monitor system users, manage permissions, and update roles.
              </p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="save-role-btn"
          >
            <FiRefreshCw size={16} />
            {loading ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        {/* Search and filter */}
        <div
          className="glass-card"
          style={{
            padding: "20px 25px",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <FiSearch
              style={{
                position: "absolute",
                top: "14px",
                left: "16px",
                color: "#38bdf8",
              }}
              size={18}
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input"
              style={{
                width: "100%",
                padding: "12px 16px 12px 48px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FiFilter color="#38bdf8" size={18} />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="custom-input"
              style={{
                padding: "12px 18px",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
              }}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Users table */}
        <div className="glass-card" style={{ overflow: "hidden" }}>
          {loading ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Loading registered users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              <FiUserCheck
                size={40}
                color="#64748b"
                style={{ marginBottom: "10px" }}
              />
              <p>No matching users found.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: "850px",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      color: "#94a3b8",
                      fontSize: "0.82rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                    }}
                  >
                    <th style={{ padding: "18px 25px" }}>User Name</th>
                    <th style={{ padding: "18px 25px" }}>Email Address</th>
                    <th style={{ padding: "18px 25px" }}>Current Role</th>
                    <th style={{ padding: "18px 25px" }}>Change Role</th>
                    <th style={{ padding: "18px 25px", textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const currentRole = user.role || "user";
                    const selectedRole =
                      selectedRoles[user._id] ?? currentRole;
                    const hasChanges = selectedRole !== currentRole;
                    const isUpdating = Boolean(updatingUsers[user._id]);

                    const badgeStyle = {
                      admin: {
                        background: "rgba(124, 58, 237, 0.15)",
                        color: "#c084fc",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                      },
                      moderator: {
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                      },
                      user: {
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "#cbd5e1",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      },
                    }[currentRole] || {};

                    return (
                      <tr
                        key={user._id}
                        className="table-row"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td
                          style={{
                            padding: "20px 25px",
                            fontWeight: 600,
                            color: "#f8fafc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                flexShrink: 0,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #0284c7, #38bdf8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            {user.name || "Unnamed User"}
                          </div>
                        </td>

                        <td style={{ padding: "20px 25px", color: "#cbd5e1" }}>
                          {user.email}
                        </td>

                        <td style={{ padding: "20px 25px" }}>
                          <span
                            style={{
                              ...badgeStyle,
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "0.78rem",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              display: "inline-block",
                            }}
                          >
                            {currentRole}
                          </span>
                        </td>

                        <td style={{ padding: "20px 25px" }}>
                          <select
                            value={selectedRole}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className="role-select custom-input"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>

                          {hasChanges && (
                            <div
                              style={{
                                marginTop: "6px",
                                color: "#fbbf24",
                                fontSize: "0.75rem",
                              }}
                            >
                              Unsaved changes
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            padding: "20px 25px",
                            textAlign: "center",
                          }}
                        >
                          <button
                            onClick={() => updateRole(user._id)}
                            disabled={!hasChanges || isUpdating}
                            className="save-role-btn"
                          >
                            <FiSave size={15} />
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;