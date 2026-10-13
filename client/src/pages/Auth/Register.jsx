import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

import bgImage from "../../assets/images/Gemini_Generated_Image_qy1ynzqy1ynzqy1y.png";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Custom Animated Popup State: { show: boolean, type: 'success' | 'error' | 'warning', message: string }
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const triggerPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // ======================
  // Register
  // ======================
  const registerUser = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      triggerPopup("warning", "Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      triggerPopup("success", res.data.message || "Verification code sent to email!");
      setRequiresVerification(true);
    } catch (err) {
      triggerPopup("error", err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Verify Email
  // ======================
  const verifyEmail = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-email", {
        email: form.email,
        code: verificationCode,
      });

      triggerPopup("success", res.data.message || "Email Verified Successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      triggerPopup("error", err.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Resend OTP
  // ======================
  const resendOTP = async () => {
    try {
      await API.post("/auth/resend-otp", {
        email: form.email,
      });

      triggerPopup("success", "OTP Resent Successfully!");
    } catch (err) {
      triggerPopup("error", err.response?.data?.message || "Unable to resend OTP");
    }
  };

  // ======================
  // Google Login
  // ======================
  window.location.href = `${
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  }/auth/google`;
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

        .register-card {
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
        {!requiresVerification ? (
          <form
            className="register-card"
            style={styles.card}
            onSubmit={registerUser}
          >
            <div style={styles.logoBox}>
              <Zap color="#38bdf8" size={24} />
            </div>

            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join DecisionHub Today</p>

            {/* Name */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.icon} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  style={styles.input}
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  style={styles.input}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
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
                  <span style={styles.spinner}></span> Creating Account...
                </span>
              ) : (
                <>
                  Create Account{" "}
                  <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                </>
              )}
            </button>
            <p style={styles.footer}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <form
            className="register-card"
            style={styles.card}
            onSubmit={verifyEmail}
          >
            <div style={styles.logoBox}>
              <ShieldCheck color="#34d399" size={24} />
            </div>

            <h1 style={styles.title}>Verify Email</h1>
            <p style={styles.subtitle}>
              Enter the 6-digit OTP sent to <br />
              <strong style={{ color: "#38bdf8" }}>{form.email}</strong>
            </p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="input-field"
                style={{
                  ...styles.input,
                  textAlign: "center",
                  letterSpacing: "8px",
                  fontSize: "18px",
                  paddingLeft: "16px",
                }}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.loadingFlex}>
                  <span style={styles.spinner}></span> Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>

            <p style={styles.footer}>
              Didn't receive OTP?{" "}
              <span onClick={resendOTP} style={{ ...styles.link, cursor: "pointer" }}>
                Resend
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

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
    padding: "35px 40px",
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
    marginTop: "16px",
    fontSize: "26px",
    fontWeight: "800",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "24px",
    lineHeight: "1.4",
  },

  inputGroup: {
    marginBottom: "15px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
    color: "#cbd5e1",
    fontSize: "12px",
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
    padding: "12px 16px 12px 45px",
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
    padding: "13px",
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

  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: "18px 0",
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
    marginTop: "20px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  link: {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;