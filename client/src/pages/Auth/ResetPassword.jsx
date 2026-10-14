const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";

import bgImage from "../../assets/images/Gemini_Generated_Image_qy1ynzqy1ynzqy1y.png";

const API = `${__DECISIONHUB_API_ORIGIN__}/api/auth`;

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  // Custom Animated Popup State: { show: boolean, type: 'success' | 'error' | 'warning', message: string }
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const triggerPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      triggerPopup("warning", "Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      triggerPopup("warning", "Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/reset-password`, {
        email,
        otp,
        newPassword: password,
      });

      triggerPopup("success", "Password updated successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      triggerPopup(
        "error",
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        .reset-card {
          animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.5);
        }

        .input-field:focus {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.35);
          outline: none;
          background: rgba(255, 255, 255, 0.08) !important;
        }

        .custom-popup {
          animation: slideInDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* Modern Animated Floating Popup Notification */}
      {popup.show && (
        <div
          className="custom-popup"
          style={{
            ...styles.popupBox,
            borderColor:
              popup.type === "success"
                ? "rgba(16, 185, 129, 0.4)"
                : popup.type === "warning"
                ? "rgba(245, 158, 11, 0.4)"
                : "rgba(244, 63, 94, 0.4)",
            background:
              popup.type === "success"
                ? "rgba(6, 78, 59, 0.85)"
                : popup.type === "warning"
                ? "rgba(120, 53, 15, 0.85)"
                : "rgba(159, 18, 57, 0.85)",
          }}
        >
          {popup.type === "success" && <CheckCircle2 size={22} color="#34d399" />}
          {popup.type === "warning" && <AlertTriangle size={22} color="#fbbf24" />}
          {popup.type === "error" && <XCircle size={22} color="#fb7185" />}
          <span style={styles.popupText}>{popup.message}</span>
        </div>
      )}

      <div
        style={{
          ...styles.background,
          backgroundImage: `url(${bgImage})`,
        }}
      />

      <div style={styles.overlay}></div>

      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      <div style={styles.container}>
        <form
          className="reset-card"
          style={styles.card}
          onSubmit={updatePassword}
        >
          <div style={styles.logoBox}>
            <ShieldAlert color="#38bdf8" size={24} />
          </div>

          <h1 style={styles.title}>New Password</h1>
          <p style={styles.subtitle}>
            Please choose a secure new password for your account
          </p>

          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn"
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingFlex}>
                <span style={styles.spinner}></span> Updating Password...
              </span>
            ) : (
              <>
                Update Password{" "}
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  },

  popupBox: {
    position: "fixed",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 24px",
    borderRadius: "14px",
    backdropFilter: "blur(16px)",
    border: "1px solid",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  },

  popupText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.01em",
  },

  background: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: "scale(1.05)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(3,7,18,0.85), rgba(15,23,42,0.9))",
    backdropFilter: "blur(6px)",
  },

  orb1: {
    position: "absolute",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background: "rgba(14, 165, 233, 0.18)",
    filter: "blur(140px)",
    top: "-100px",
    left: "-100px",
  },

  orb2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(139, 92, 246, 0.18)",
    filter: "blur(150px)",
    bottom: "-120px",
    right: "-120px",
  },

  container: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "430px",
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#fff",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.7)",
  },

  logoBox: {
    width: "52px",
    height: "52px",
    margin: "0 auto",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
  },

  title: {
    textAlign: "center",
    marginTop: "18px",
    fontSize: "26px",
    fontWeight: "800",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "28px",
    lineHeight: "1.4",
  },

  inputGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  icon: {
    position: "absolute",
    left: "14px",
    color: "#64748b",
  },

  input: {
    width: "100%",
    padding: "13px 45px 13px 45px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(2, 6, 23, 0.5)",
    color: "#fff",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  eyeBtn: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    boxShadow: "0 4px 20px rgba(14, 165, 233, 0.35)",
    marginTop: "10px",
  },

  loadingFlex: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default ResetPassword;