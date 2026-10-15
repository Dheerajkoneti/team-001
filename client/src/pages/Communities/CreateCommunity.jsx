import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCommunity } from "../../services/communityService";
import { Globe2, Sparkles, Terminal, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

const CreateCommunity = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  // Custom modal state replacing browser alert
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const showAlert = (title, message, isSuccess = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      isSuccess,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      showAlert("Validation Error", "Please fill in all required fields.", false);
      return;
    }

    setLoading(true);
    try {
      await createCommunity(form);
      showAlert("Success!", "Community created successfully. Initializing node...", true);
    } catch (err) {
      showAlert("Deployment Failed", err.response?.data?.message || "Failed to create community", false);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .create-content { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-modal { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .input-box:focus { border-color: rgba(56, 189, 248, 0.6) !important; box-shadow: 0 0 20px rgba(56, 189, 248, 0.25); outline: none; background: rgba(15, 23, 42, 0.95) !important; }
        .submit-btn:hover { background: linear-gradient(135deg, #0284c7, #7c3aed) !important; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4); }
        .back-link:hover { color: #38bdf8 !important; transform: translateX(-4px); }
      `}</style>

      <div style={styles.container} className="create-content">
        <button onClick={() => navigate("/communities")} style={styles.backBtn} className="back-link">
          ← Back to Communities
        </button>

        <div style={styles.card}>
          <div style={styles.glowOrb}></div>

          <div style={styles.headerSection}>
            <div style={styles.iconBadge}>
              <Globe2 size={24} color="#38bdf8" />
            </div>
            <div>
              <span style={styles.idBadge}>
                <Terminal size={12} color="#38bdf8" /> Decentralized Workspace
              </span>
              <h2 style={styles.title}>Initialize Community</h2>
              <p style={styles.subtitle}>Deploy a new collaborative hub for large-scale decision making and collective voting.</p>
            </div>
          </div>

          <form onSubmit={submitHandler} style={styles.formStyle}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Community Identifier / Name</label>
              <input
                type="text"
                placeholder="e.g. Web3 Ecosystem Foundation"
                className="input-box"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                style={styles.textInput}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Workspace Mission & Description</label>
              <textarea
                placeholder="Describe the primary objectives, governance structure, and focus areas..."
                className="input-box"
                rows="5"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                style={styles.textAreaInput}
              />
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={styles.buttonSpinner}></div> Deploying Node...
                </div>
              ) : (
                <>
                  <Sparkles size={18} /> Launch Community Hub <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* CUSTOM UNIQUE POPUP MODAL */}
      {modal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="custom-modal">
            <div style={styles.modalHeader}>
              <div style={{
                ...styles.modalIconBox,
                background: modal.isSuccess ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                borderColor: modal.isSuccess ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"
              }}>
                {modal.isSuccess ? <CheckCircle2 size={22} color="#34d399" /> : <AlertCircle size={22} color="#f87171" />}
              </div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: "800" }}>
                {modal.title}
              </h3>
            </div>
            <p style={styles.modalMessage}>{modal.message}</p>
            <div style={styles.modalActions}>
              <button
                onClick={() => {
                  setModal((prev) => ({ ...prev, isOpen: false }));
                  if (modal.isSuccess) navigate("/communities");
                }}
                style={styles.modalConfirmBtn}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    maxWidth: "750px",
    margin: "20px auto",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "20px",
    transition: "all 0.2s ease",
  },
  card: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "28px",
    padding: "40px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
    position: "relative",
    overflow: "hidden",
  },
  glowOrb: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(139, 92, 246, 0.05) 70%, transparent 100%)",
    borderRadius: "50%",
    zIndex: 0,
    pointerEvents: "none",
  },
  headerSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
    marginBottom: "32px",
    position: "relative",
    zIndex: 1,
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
    flexShrink: 0,
  },
  idBadge: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "8px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 6px 0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
  },
  formStyle: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "relative",
    zIndex: 1,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.01em",
  },
  textInput: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(2, 6, 23, 0.8)",
    color: "#fff",
    fontSize: "15px",
    transition: "all 0.2s ease",
  },
  textAreaInput: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(2, 6, 23, 0.8)",
    color: "#fff",
    fontSize: "15px",
    resize: "vertical",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 6px 20px rgba(14, 165, 233, 0.35)",
    transition: "all 0.25s ease",
  },
  buttonSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  // Custom Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(2, 6, 23, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalCard: {
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    borderRadius: "22px",
    padding: "28px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  modalIconBox: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalMessage: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0 0 24px 0",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  modalConfirmBtn: {
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    border: "none",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(14, 165, 233, 0.3)",
  },
};

export default CreateCommunity;