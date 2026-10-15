import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

import bgImage from "../../assets/images/Gemini_Generated_Image_qy1ynzqy1ynzqy1y.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom Animated Popup State: { show: boolean, type: 'success' | 'error' | 'warning', message: string }
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const triggerPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      if (!res.data?.token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      triggerPopup("success", "Welcome back! Login Successful.");

      const requestedPath = location.state?.from?.pathname;
      const redirectPath =
        requestedPath && requestedPath !== "/login"
          ? requestedPath
          : "/dashboard";

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Invalid credentials. Please try again.";

      triggerPopup("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_ORIGIN}/api/auth/google`;
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
            transform: translate(-50, -30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50, 0) scale(1);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .login-card {
          animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.5);
        }

        .google-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .google-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: 0.5s;
        }
        .google-btn:hover::after {
          left: 100%;
        }
        .google-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(56, 189, 248, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
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
          className="login-card"
          style={styles.card}
          onSubmit={loginUser}
        >
          <div style={styles.logoBox}>
            <Zap color="#38bdf8" size={24} />
          </div>

          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to DecisionHub workspace</p>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                className="input-field"
                placeholder="name@company.com"
                style={styles.input}
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                style={styles.input}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
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

          <div style={styles.forgotContainer}>
            <span
              onClick={() => navigate("/forgot-password")}
              style={styles.forgot}
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="btn"
            style={styles.loginBtn}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingFlex}>
                <span style={styles.spinner}></span> Signing In...
              </span>
            ) : (
              <>
                Sign In{" "}
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or continue with</span>
            <span style={styles.dividerLine}></span>
          </div>

          {/* Super Enhanced Ultra-Attractive Google Button */}
          <button
            type="button"
            className="google-btn"
            style={styles.googleBtn}
            onClick={handleGoogleLogin}
          >
            <div style={styles.googleIconBg}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15C3.5 18.8 7.4 23 12 23z"
                />
              </svg>
            </div>
            <span style={styles.googleBtnText}>Continue with Google</span>
          </button>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    minHeight: "100dvh",
    overflowX: "hidden",
    overflowY: "auto",
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
    width: "100%",
    minHeight: "100vh",
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px 20px",
  },


  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "clamp(22px, 5vw, 40px)",
    borderRadius: "24px",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#fff",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
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
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "28px",
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
    padding: "13px 16px 13px 45px",
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

  forgotContainer: {
    textAlign: "right",
    marginBottom: "22px",
  },

  forgot: {
    color: "#38bdf8",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  loginBtn: {
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

  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: "20px 0",
  },

  dividerLine: {
    flex: 1,
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },

  dividerText: {
    padding: "0 12px",
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  googleBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  googleIconBg: {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    borderRadius: "50%",
    padding: "2px",
  },

  footer: {
    textAlign: "center",
    marginTop: "24px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  link: {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
