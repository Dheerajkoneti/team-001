const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, FiSearch, FiShield, FiCheckCircle, FiAlertCircle, 
  FiRefreshCw, FiUserCheck, FiFilter 
} from "react-icons/fi";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const token = localStorage.getItem("token");

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const timeoutRef = useRef(null);

  const showToast = (message, type = "success") => {
    clearTimeout(timeoutRef.current);
    setToast({ show: true, message, type });
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${__DECISIONHUB_API_ORIGIN__}/api/users/all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch users list ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await axios.put(
        `${__DECISIONHUB_API_ORIGIN__}/api/users/update-role`,
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Role updated successfully! ✨", "success");
      fetchUsers();
    } catch (err) {
      console.log(err);
      showToast(err.response?.data?.message || "Failed to update role ❌", "error");
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)", color: "white", padding: "40px", boxSizing: "border-box", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>
      <style>
        {`
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; background-color: #020617; width: 100%; overflow-x: hidden; }
          .glass-card { background: rgba(30, 41, 59, 0.55); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 15px 35px rgba(0,0,0,0.4); border-radius: 20px; }
          .btn-primary { background: linear-gradient(135deg, #2563eb, #38bdf8); color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5); }
          .custom-input:focus { border-color: #38bdf8 !important; outline: none; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); }
          .table-row { transition: background 0.2s ease; }
          .table-row:hover { background: rgba(56, 189, 248, 0.04); }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 10px; }
        `}
      </style>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              position: "fixed", top: "20px", right: "20px", zIndex: 9999,
              background: toast.type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
              backdropFilter: "blur(12px)", color: "white", padding: "12px 22px",
              borderRadius: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            {toast.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.15)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <FiUsers size={28} color="#38bdf8" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "900", background: "linear-gradient(to right, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              User Management Hub
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>
              Monitor system users, evaluate permissions, and manage roles dynamically.
            </p>
          </div>
        </div>

        <button onClick={fetchUsers} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiRefreshCw size={16} /> Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: "20px 25px", marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
        
        {/* Search Input */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <FiSearch style={{ position: "absolute", top: "14px", left: "16px", color: "#38bdf8" }} size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="custom-input"
            style={{
              width: "100%", padding: "12px 16px 12px 48px", background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid #334155", borderRadius: "12px", color: "white", fontSize: "0.95rem", transition: "all 0.3s"
            }}
          />
        </div>

        {/* Role Filter Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FiFilter color="#38bdf8" size={18} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="custom-input"
            style={{
              padding: "12px 18px", background: "#1e293b", border: "1px solid #334155",
              borderRadius: "12px", color: "white", fontSize: "0.95rem", cursor: "pointer"
            }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} style={{ width: "45px", height: "45px", border: "4px solid rgba(56,189,248,0.2)", borderTop: "4px solid #38bdf8", borderRadius: "50%", margin: "0 auto 15px auto" }} />
            Loading registered users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
            <FiUserCheck size={40} color="#334155" style={{ marginBottom: "10px" }} />
            <p style={{ fontSize: "1.1rem", margin: 0 }}>No matching users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(15, 23, 42, 0.6)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  <th style={{ padding: "18px 25px" }}>User Name</th>
                  <th style={{ padding: "18px 25px" }}>Email Address</th>
                  <th style={{ padding: "18px 25px" }}>Current Role</th>
                  <th style={{ padding: "18px 25px" }}>Change Role</th>
                  <th style={{ padding: "18px 25px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const badgeBg = user.role === "admin" ? "rgba(124, 58, 237, 0.15)" : user.role === "moderator" ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.08)";
                  const badgeColor = user.role === "admin" ? "#a855f7" : user.role === "moderator" ? "#38bdf8" : "#94a3b8";
                  const badgeBorder = user.role === "admin" ? "rgba(168, 85, 247, 0.3)" : user.role === "moderator" ? "rgba(56, 189, 248, 0.3)" : "rgba(255, 255, 255, 0.15)";

                  return (
                    <tr key={user._id} className="table-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      
                      {/* Name */}
                      <td style={{ padding: "20px 25px", fontWeight: "600", color: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #0284c7, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.95rem" }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          {user.name}
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "20px 25px", color: "#cbd5e1" }}>
                        {user.email}
                      </td>

                      {/* Current Role Badge */}
                      <td style={{ padding: "20px 25px" }}>
                        <span style={{
                          padding: "6px 14px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "bold", textTransform: "uppercase",
                          background: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeBorder}`,
                          display: "inline-block"
                        }}>
                          {user.role}
                        </span>
                      </td>

                      {/* Change Role Selector */}
                      <td style={{ padding: "20px 25px" }}>
                        <select
                          value={user.role}
                          onChange={(e) => {
                            const updatedUsers = users.map((u) =>
                              u._id === user._id ? { ...u, role: e.target.value } : u
                            );
                            setUsers(updatedUsers);
                          }}
                          className="custom-input"
                          style={{
                            padding: "8px 14px", background: "rgba(15, 23, 42, 0.7)", border: "1px solid #334155",
                            borderRadius: "10px", color: "white", fontSize: "0.9rem", cursor: "pointer"
                          }}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Update Action Button */}
                      <td style={{ padding: "20px 25px", textAlign: "center" }}>
                        <button
                          onClick={() => updateRole(user._id, user.role)}
                          className="btn-primary"
                          style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                        >
                          Update Role
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
  );
}

export default ManageUsers;