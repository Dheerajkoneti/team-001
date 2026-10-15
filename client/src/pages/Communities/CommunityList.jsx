import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getCommunities, 
  joinCommunity 
} from "../../services/communityService";
import { 
  Globe2, Users, PlusCircle, Sparkles, Terminal, 
  ArrowRight, UserPlus, Eye, CheckCircle2, AlertCircle 
} from "lucide-react";

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Add user variable
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  const loadCommunities = async () => {
    try {
      const res = await getCommunities();
      setCommunities(res.data.communities);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  // 2. Update join() function
  const join = async (id) => {
    try {
      await joinCommunity(id);

      navigate(`/communities/${id}/hub`);

    } catch (error) {

      if (error.response?.data?.message === "Already joined") {
        navigate(`/communities/${id}/hub`);
      } else {
        showAlert(
          "Action Failed",
          error.response?.data?.message || "Failed to join community",
          false
        );
      }
    }
  };

  if (loading) {
    return (
      <>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600" }}>Loading community hubs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .community-list-content { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-modal { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .community-card { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .community-card:hover { transform: translateY(-4px); border-color: rgba(56, 189, 248, 0.4) !important; box-shadow: 0 15px 30px -5px rgba(14, 165, 233, 0.2); background: rgba(15, 23, 42, 0.85) !important; }
        .join-btn:hover { background: #059669 !important; transform: translateY(-1px); }
        .view-btn:hover { background: #0284c7 !important; transform: translateY(-1px); }
        .create-btn:hover { background: linear-gradient(135deg, #0284c7, #7c3aed) !important; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4); }
      `}</style>

      <div style={styles.container} className="community-list-content">
        {/* Header Bar */}
        <div style={styles.headerRow}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={styles.iconBadge}>
              <Globe2 size={24} color="#38bdf8" />
            </div>
            <div>
              <h2 style={styles.title}>Communities</h2>
              <p style={styles.subtitle}>Explore decentralized hubs, join discussions, and collaborate at scale</p>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        {communities.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🌐</div>
            <h3 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: "18px" }}>No communities active</h3>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>Be the first to launch a collaborative community hub!</p>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            {communities.map((community) => {
              const isMember = community.members?.some(
                (member) => member._id === user._id
              );

              return (
                <div
                  key={community._id}
                  style={styles.card}
                  className="community-card"
                >
                  <div style={styles.cardTop}>
                    <div style={styles.cardIconSmall}>
                      <Terminal size={14} color="#38bdf8" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isMember && (
                        <span style={{
                          color: "#10b981",
                          fontSize: "12px",
                          fontWeight: "700"
                        }}>
                          ✓ Joined
                        </span>
                      )}
                      <span style={styles.memberBadge}>
                        <Users size={12} /> {community.members?.length || 0} Members
                      </span>
                    </div>
                  </div>

                  <h4 style={styles.cardTitle}>{community.name}</h4>
                  <p style={styles.cardDesc}>{community.description}</p>

                  <div style={styles.cardActionRow}>
                    {/* 3. Replace Join Button */}
                    {community.members?.some(
                      (member) => member._id === user._id
                    ) ? (

                      <button
                        onClick={() =>
                          navigate(`/communities/${community._id}/hub`)
                        }
                        className="view-btn"
                        style={{
                          ...styles.viewBtn,
                          flex: 1,
                        }}
                      >
                        <Eye size={15} />
                        Open Hub
                      </button>

                    ) : (

                      <button
                        onClick={() => join(community._id)}
                        className="join-btn"
                        style={styles.joinBtn}
                      >
                        <UserPlus size={15} />
                        Join
                      </button>

                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
              <button
                onClick={() => setModal((prev) => ({ ...prev, isOpen: false }))}
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
    maxWidth: "950px",
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "20px",
  },
  iconBadge: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.15))",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 25px rgba(56, 189, 248, 0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 4px 0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
  },
  createHubBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(14, 165, 233, 0.3)",
    transition: "all 0.2s ease",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardIconSmall: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  memberBadge: {
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
  cardTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
    letterSpacing: "-0.01em",
  },
  cardDesc: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
    flex: 1,
  },
  cardActionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },
  joinBtn: {
    flex: 1,
    padding: "10px 16px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "13.5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s ease",
  },
  viewBtn: {
    flex: 1,
    padding: "10px 16px",
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "13.5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "rgba(15, 23, 42, 0.4)",
    borderRadius: "24px",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
  },
  emptyIcon: {
    fontSize: "40px",
    marginBottom: "12px",
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

export default CommunityList;