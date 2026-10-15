const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  FiMessageSquare, FiStar, FiTrash2, FiSearch, FiFilter, 
  FiCheckCircle, FiAlertCircle, FiRefreshCw, FiUser 
} from "react-icons/fi";

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

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
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${__DECISIONHUB_API_ORIGIN__}/api/feedback`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch user feedbacks ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(
        `${__DECISIONHUB_API_ORIGIN__}/api/feedback/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Feedback deleted successfully! 🗑️", "success");
      fetchFeedbacks();
    } catch (err) {
      console.log(err);
      showToast("Failed to delete feedback ❌", "error");
    }
  };

  // Calculate Average Rating
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedbacks.length).toFixed(1)
    : "0.0";

  // Filter feedbacks based on search query and rating
  const filteredFeedbacks = feedbacks.filter((item) => {
    const userName = item.user?.name || "Anonymous";
    const userEmail = item.user?.email || "";
    const feedbackText = item.feedback || "";

    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedbackText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === "all" || String(item.rating) === ratingFilter;

    return matchesSearch && matchesRating;
  });

  return (
    <div style={{ width: "100%",maxWidth: "100%",minWidth: 0, minHeight: "100vh", background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)", color: "white", padding: "40px", boxSizing: "border-box", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>
      <style>
        {`
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; background-color: #020617; width: 100%; overflow-x: hidden; }
          .glass-card { background: rgba(30, 41, 59, 0.55); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 15px 35px rgba(0,0,0,0.4); border-radius: 20px; }
          .feedback-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .feedback-card:hover { transform: translateY(-4px); border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .btn-primary { background: linear-gradient(135deg, #2563eb, #38bdf8); color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5); }
          .btn-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 16px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
          .btn-danger:hover { background: rgba(239, 68, 68, 0.3); color: white; transform: translateY(-1px); }
          .custom-input:focus { border-color: #38bdf8 !important; outline: none; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 10px; }
        `}
      </style>

      {/* Toast Notification */}
      {toast.show && (
        <div
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
        </div>
      )}

      {/* Header Banner & Stats Overview */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.15)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <FiMessageSquare size={28} color="#38bdf8" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "900", background: "linear-gradient(to right, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              User Feedbacks Hub
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>
              Explore what users are saying, view ratings, and curate feedback items.
            </p>
          </div>
        </div>

        {/* Mini Stats Banner */}
        <div style={{ display: "flex", gap: "15px" }}>
          <div className="glass-card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ color: "#fbbf24" }}><FiStar size={22} /></div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>Average Rating</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{averageRating} <span style={{ fontSize: "0.8rem", color: "#64748b" }}>/ 5</span></div>
            </div>
          </div>

          <button onClick={fetchFeedbacks} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiRefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: "20px 25px", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
        
        {/* Search Input */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <FiSearch style={{ position: "absolute", top: "14px", left: "16px", color: "#38bdf8" }} size={18} />
          <input
            type="text"
            placeholder="Search feedback content, user names or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="custom-input"
            style={{
              width: "100%", padding: "12px 16px 12px 48px", background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid #334155", borderRadius: "12px", color: "white", fontSize: "0.95rem", transition: "all 0.3s"
            }}
          />
        </div>

        {/* Rating Filter Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FiFilter color="#38bdf8" size={18} />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="custom-input"
            style={{
              padding: "12px 18px", background: "#1e293b", border: "1px solid #334155",
              borderRadius: "12px", color: "white", fontSize: "0.95rem", cursor: "pointer"
            }}
          >
            <option value="all">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>
      </div>

      {/* Feedbacks Grid Layout */}
      {loading ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
          Loading user feedbacks...
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
          <FiMessageSquare size={40} color="#334155" style={{ marginBottom: "10px" }} />
          <p style={{ fontSize: "1.1rem", margin: 0 }}>No matching feedback entries found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {filteredFeedbacks.map((item) => {
            const userName = item.user?.name || "Anonymous User";
            const userEmail = item.user?.email || "No email provided";
            const rating = item.rating || 0;

            return (
              <div 
                key={item._id} 
                className="glass-card feedback-card" 
                style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}
              >
                <div>
                  {/* Card Top: User Meta & Rating badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #0284c7, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1rem", boxShadow: "0 4px 12px rgba(56, 189, 248, 0.3)" }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", color: "#f8fafc" }}>
                          {userName}
                        </h3>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div style={{ background: "rgba(251, 191, 36, 0.12)", border: "1px solid rgba(251, 191, 36, 0.3)", padding: "6px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", color: "#fbbf24", fontWeight: "bold", fontSize: "0.85rem" }}>
                      <FiStar fill="#fbbf24" size={14} />
                      <span>{rating}/5</span>
                    </div>
                  </div>

                  {/* Feedback Text Message */}
                  <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6", background: "rgba(15, 23, 42, 0.4)", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.03)" }}>
                    "{item.feedback}"
                  </p>
                </div>

                {/* Card Footer: Delete Action */}
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>
                  <button
                    onClick={() => deleteFeedback(item._id)}
                    className="btn-danger"
                  >
                    <FiTrash2 size={15} /> Delete Entry
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

export default AdminFeedbacks;