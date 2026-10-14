const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import { useState, useRef } from "react";
import axios from "axios";
import { FiStar, FiSend, FiCheckCircle, FiAlertCircle, FiHeart, FiRotateCcw } from "react-icons/fi";

function Feedback() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      showToast("Please share a few words before submitting! ⚠️", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${__DECISIONHUB_API_ORIGIN__}/api/feedback`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmitted(true);
      showToast("Feedback Submitted Successfully! ✨", "success");
    } catch (err) {
      console.error(err);
      showToast(
        err?.response?.data?.message || "Failed to submit feedback ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRating(5);
    setFeedback("");
    setSubmitted(false);
  };

  const getRatingText = (val) => {
    switch (val) {
      case 5: return "⭐⭐⭐⭐⭐ Excellent Experience!";
      case 4: return "⭐⭐⭐⭐ Very Good";
      case 3: return "⭐⭐⭐ Average";
      case 2: return "⭐⭐ Needs Improvement";
      case 1: return "⭐ Very Poor";
      default: return "";
    }
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)", color: "white", display: "flex", justifyContent: "center", alignItems: "center", padding: "30px", boxSizing: "border-box", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>
      <style>
        {`
          * { box-sizing: border-box; }
          /* This prevents browser history back swipe gesture on touchpads/mobile */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overscroll-behavior-x: none;
          }
          .glass-card { background: rgba(30, 41, 59, 0.55); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 45px rgba(0,0,0,0.5); border-radius: 24px; }
          .btn-primary { background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: white; border: none; padding: 14px 20px; border-radius: 14px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(14, 165, 233, 0.35); display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-size: 1rem; }
          .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(14, 165, 233, 0.5); }
          .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
          .custom-input:focus { border-color: #38bdf8 !important; outline: none; box-shadow: 0 0 15px rgba(56, 189, 248, 0.25); }
          .star-btn { background: transparent; border: none; cursor: pointer; transition: transform 0.2s ease; padding: 4px; }
          .star-btn:hover { transform: scale(1.2); }
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .animate-fade { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
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

      <div className="glass-card animate-fade" style={{ width: "100%", maxWidth: "650px", padding: "40px" }}>
        
        {!submitted ? (
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ width: "60px", height: "60px", margin: "0 auto 15px auto", background: "rgba(56, 189, 248, 0.15)", borderRadius: "20px", border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiHeart size={28} color="#38bdf8" />
              </div>
              <h1 style={{ color: "#38bdf8", margin: "0 0 10px 0", fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
                Feedback Center
              </h1>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem", lineHeight: "1.5" }}>
                Help us shape the future of DecisionHub. Share your honest thoughts and experience with us!
              </p>
            </div>

            {/* Clickable Star Rating */}
            <div style={{ background: "rgba(15, 23, 42, 0.5)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "25px", textAlign: "center" }}>
              <label style={{ color: "#e2e8f0", display: "block", marginBottom: "12px", fontWeight: "600", fontSize: "0.95rem" }}>
                Select Rating
              </label>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FiStar
                      size={34}
                      fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"}
                      color={(hoverRating || rating) >= star ? "#fbbf24" : "#64748b"}
                    />
                  </button>
                ))}
              </div>
              
              <span style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "bold" }}>
                {getRatingText(hoverRating || rating)}
              </span>
            </div>

            {/* Feedback Text Area */}
            <div style={{ marginBottom: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ color: "#e2e8f0", fontWeight: "600", fontSize: "0.95rem" }}>
                  Your Feedback
                </label>
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{feedback.length} chars</span>
              </div>

              <textarea
                rows="5"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
                className="custom-input"
                style={{
                  width: "100%", padding: "16px", borderRadius: "14px",
                  background: "rgba(15, 23, 42, 0.6)", border: "1px solid #334155",
                  color: "white", resize: "none", fontSize: "0.95rem", lineHeight: "1.6",
                  transition: "all 0.3s ease"
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <FiSend size={18} /> Submit Feedback
                </>
              )}
            </button>
          </div>
        ) : (
          /* Thank You Screen State */
          <div className="animate-fade" style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{ width: "80px", height: "80px", margin: "0 auto 20px auto", background: "rgba(16, 185, 129, 0.15)", borderRadius: "50%", border: "2px solid rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)" }}>
              <FiCheckCircle size={40} color="#34d399" />
            </div>

            <h2 style={{ color: "#f8fafc", fontSize: "2rem", fontWeight: "800", margin: "0 0 10px 0" }}>
              Thank You! 🎉
            </h2>
            
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: "1.6", maxWidth: "420px", margin: "0 auto 30px auto" }}>
              Thank you for giving your feedback! Your review helps us improve DecisionHub.
            </p>

            <div style={{ background: "rgba(15, 23, 42, 0.5)", padding: "15px 20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", display: "inline-block", marginBottom: "30px" }}>
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "4px" }}>Submitted Rating</div>
              <div style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "1.1rem" }}>
                {"⭐".repeat(rating)} ({rating}/5 Stars)
              </div>
            </div>

            <div>
              <button
                onClick={handleReset}
                className="btn-primary"
                style={{ background: "linear-gradient(135deg, #334155, #1e293b)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <FiRotateCcw size={16} /> Submit Another Response
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Feedback;