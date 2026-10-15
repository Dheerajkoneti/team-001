import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getCommunityById, 
  leaveCommunity, 
  deleteCommunity 
} from "../../services/communityService";
import { 
  Globe2, Users, ShieldCheck, Trash2, LogOut, Terminal, 
  Sparkles, AlertCircle, CheckCircle2 
} from "lucide-react";

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom modal state replacing browser alert/confirm
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert", // "alert" or "confirm"
    onConfirm: null,
    isSuccess: false,
  });

  const showAlert = (title, message, isSuccess = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: "alert",
      isSuccess,
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (title, message, onConfirmCallback) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: "confirm",
      isSuccess: false,
      onConfirm: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        onConfirmCallback();
      },
    });
  };

  const loadCommunity = async () => {
    try {
      const res = await getCommunityById(id);
      setCommunity(res.data.community);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunity();
  }, [id]);

  const leave = () => {
    showConfirm(
      "Leave Community",
      "Are you sure you want to leave this community hub?",
      async () => {
        try {
          await leaveCommunity(id);
          showAlert("Exited", "Successfully left the community.", true);
        } catch (error) {
          showAlert("Error", error.response?.data?.message || "Failed to leave community", false);
        }
      }
    );
  };

  const removeCommunity = () => {
    showConfirm(
      "Delete Community",
      "CRITICAL: Are you sure you want to permanently delete this community workspace?",
      async () => {
        try {
          await deleteCommunity(id);
          showAlert("Deleted", "Community deleted successfully.", true);
        } catch (error) {
          showAlert("Error", error.response?.data?.message || "Failed to delete community", false);
        }
      }
    );
  };

  if (loading || !community) {
    return (
      <>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600" }}>Loading decentralized node...</p>
        </div>
      </>
    );
  }

  const isOwner = community.createdBy?._id === user?._id;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .community-content { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-modal { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .back-link:hover { color: #38bdf8 !important; transform: translateX(-4px); }
        .leave-btn:hover { background: rgba(239, 68, 68, 0.2) !important; border-color: rgba(239, 68, 68, 0.5) !important; }
        .delete-btn:hover { background: rgba(220, 38, 38, 0.3) !important; }
        .member-card:hover { transform: translateY(-2px); border-color: rgba(56, 189, 248, 0.3) !important; background: rgba(15, 23, 42, 0.8) !important; }
      `}</style>

      <div style={styles.container} className="community-content">
        <button onClick={() => navigate("/communities")} style={styles.backBtn} className="back-link">
          ← Back to Communities
        </button>

        <div style={styles.card}>
          <div style={styles.glowOrb}></div>

          {/* Header Section */}
          <div style={styles.headerSection}>
            <div style={styles.iconBadge}>
              <Globe2 size={26} color="#38bdf8" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.badgeRow}>
                <span style={styles.idBadge}>
                  <Terminal size={12} color="#38bdf8" /> Node ID: #{id.slice(-6)}
                </span>
                <span style={styles.memberCountBadge}>
                  <Users size={12} /> {community.members?.length || 0} Members
                </span>
              </div>
              <h2 style={styles.title}>{community.name}</h2>
              <p style={styles.subtitle}>{community.description}</p>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Members List Section */}
          <div style={styles.sectionHeaderRow}>
            <h3 style={styles.sectionHeader}>Active Hub Collaborators</h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Verified Network</span>
          </div>

          <div style={styles.memberList}>
            {community.members?.map((member) => {
              const isCreator = community.createdBy?._id === member._id;

              return (
                <div key={member._id} style={styles.memberItem} className="member-card">
                  <div style={styles.avatarCircle}>
                    {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#fff", fontWeight: "700" }}>
                      {member.name}
                    </h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                      {member.email}
                    </p>
                  </div>
                  <span style={isCreator ? styles.ownerBadge : styles.roleTag}>
                    {isCreator ? "👑 Creator" : "Member"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={styles.actionRow}>
            <button
              onClick={leave}
              className="leave-btn"
              style={styles.leaveBtn}
            >
              <LogOut size={16} /> Leave Community
            </button>

            {(isOwner || user?.role === "admin") && (
              <button
                onClick={removeCommunity}
                className="delete-btn"
                style={styles.deleteBtn}
              >
                <Trash2 size={16} /> Delete Community
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM POPUP MODAL */}
      {modal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="custom-modal">
            <div style={styles.modalHeader}>
              <div style={{
                ...styles.modalIconBox,
                background: modal.isSuccess ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                borderColor: modal.isSuccess ? "rgba(16, 185, 129, 0.3)" : "rgba(56, 189, 248, 0.3)"
              }}>
                {modal.isSuccess ? <CheckCircle2 size={22} color="#34d399" /> : <AlertCircle size={22} color="#38bdf8" />}
              </div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: "800" }}>
                {modal.title}
              </h3>
            </div>
            <p style={styles.modalMessage}>{modal.message}</p>
            <div style={styles.modalActions}>
              {modal.type === "confirm" && (
                <button
                  onClick={() => setModal((prev) => ({ ...prev, isOpen: false }))}
                  style={styles.modalCancelBtn}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={modal.onConfirm}
                style={styles.modalConfirmBtn}
              >
                {modal.type === "confirm" ? "Proceed" : "Acknowledge"}
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
    maxWidth: "850px",
    margin: "10px auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 0",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(56, 189, 248, 0.1)",
    borderTop: "3px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
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
    gap: "20px",
    position: "relative",
    zIndex: 1,
  },
  iconBadge: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.15))",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 25px rgba(56, 189, 248, 0.2)",
    flexShrink: 0,
  },
  badgeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "10px",
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
  },
  memberCountBadge: {
    fontSize: "12px",
    background: "rgba(139, 92, 246, 0.15)",
    color: "#c084fc",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    padding: "4px 10px",
    borderRadius: "8px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.6",
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    margin: "32px 0",
    position: "relative",
    zIndex: 1,
  },
  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    position: "relative",
    zIndex: 1,
  },
  sectionHeader: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#e2e8f0",
    margin: 0,
  },
  memberList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "relative",
    zIndex: 1,
  },
  memberItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "rgba(2, 6, 23, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "14px 18px",
    borderRadius: "14px",
    transition: "all 0.25s ease",
  },
  avatarCircle: {
    width: "42px",
    height: "42px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    color: "#fff",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.25)",
  },
  roleTag: {
    fontSize: "11px",
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    color: "#38bdf8",
    padding: "5px 12px",
    borderRadius: "8px",
    fontWeight: "700",
  },
  ownerBadge: {
    fontSize: "11px",
    background: "rgba(251, 191, 36, 0.15)",
    border: "1px solid rgba(251, 191, 36, 0.3)",
    color: "#fbbf24",
    padding: "5px 12px",
    borderRadius: "8px",
    fontWeight: "700",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    marginTop: "35px",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap",
  },
  leaveBtn: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#f87171",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },
  deleteBtn: {
    background: "rgba(220, 38, 38, 0.25)",
    border: "1px solid rgba(220, 38, 38, 0.4)",
    color: "#fca5a5",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },
  // Modal Styles
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
    gap: "10px",
  },
  modalCancelBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#cbd5e1",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalConfirmBtn: {
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    border: "none",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(14, 165, 233, 0.3)",
  },
};

export default CommunityDetails;