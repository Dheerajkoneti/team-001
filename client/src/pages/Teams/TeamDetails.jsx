const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Users, ShieldCheck, Send, UserPlus, Sparkles, MessageSquare, 
  Terminal, UserMinus, LogOut, Crown, CheckCheck, Smile, Paperclip, Trash2, X, Check, AlertCircle 
} from "lucide-react";
import axios from "axios";
import {
  getTeamById,
  getMessages,
  sendMessage
} from "../../services/teamService";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [team, setTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const chatEndRef = useRef(null);

  // Custom Advanced Modal State (replaces native alert/confirm)
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert", // "alert" or "confirm"
    onConfirm: null,
  });

  const showAlert = (title, message) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: "alert",
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (title, message, onConfirmCallback) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: "confirm",
      onConfirm: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        onConfirmCallback();
      },
    });
  };

  useEffect(() => {
    loadTeam();
    loadMessages();
    
    const interval = setInterval(() => {
      loadMessages();
    }, 4000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadTeam = async () => {
    try {
      const res = await getTeamById(id);
      setTeam(res.data.team || res.data);
    } catch (err) {
      console.log("Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await getMessages(id);
      const fetchedMessages = Array.isArray(res.data) ? res.data : res.data?.messages || [];
      setMessages(fetchedMessages);
    } catch (err) {
      console.log("Failed to load messages");
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      await sendMessage(id, text);
      setText("");
      loadMessages();
    } catch (err) {
      console.log("Failed to send message");
    }
  };

  const addMember = async () => {
    if (!email.trim()) return;

    try {
      await axios.post(
        `${__DECISIONHUB_API_ORIGIN__}/api/team/add-member`,
        { teamId: id, email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showAlert("Success", "Collaborator added successfully to the pod!");
      loadTeam();
      setEmail("");
    } catch (err) {
      showAlert("Error", err.response?.data?.message || "Failed to add member");
    }
  };

  const removeMember = (memberId) => {
    showConfirm(
      "Revoke Access",
      "Are you sure you want to remove this member from the team pod?",
      async () => {
        try {
          await axios.post(
            `${__DECISIONHUB_API_ORIGIN__}/api/team/remove-member`,
            { teamId: id, memberId },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          showAlert("Updated", "Member access successfully revoked.");
          loadTeam();
        } catch (err) {
          showAlert("Error", err.response?.data?.message || "Failed to remove member");
        }
      }
    );
  };

  const leaveTeam = () => {
    showConfirm(
      "Leave Workspace",
      "Are you sure you want to exit and leave this team pod?",
      async () => {
        try {
          await axios.post(
            `${__DECISIONHUB_API_ORIGIN__}/api/team/leave`,
            { teamId: id },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          showAlert("Exited", "You have successfully left the team.");
          navigate("/teams");
        } catch (err) {
          showAlert("Error", err.response?.data?.message || "Failed to leave team");
        }
      }
    );
  };

  const deleteTeam = () => {
    showConfirm(
      "Delete Pod",
      "CRITICAL: Are you sure you want to permanently delete this team workspace and all data?",
      async () => {
        try {
          await axios.delete(
            `${__DECISIONHUB_API_ORIGIN__}/api/team/${id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          showAlert("Deleted", "Team workspace wiped successfully.");
          navigate("/teams");
        } catch (err) {
          showAlert("Error", err.response?.data?.message || "Failed to delete team");
        }
      }
    );
  };

  const leaderId = team?.leader?._id || team?.leader;
  const isLeader = user && leaderId && leaderId.toString() === user._id.toString();

  if (loading) {
    return (
      <>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600" }}>Initializing secure pod...</p>
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
        .team-content { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-modal { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .wa-send-btn:hover { background: #0284c7 !important; transform: scale(1.05); box-shadow: 0 0 15px rgba(14,165,233,0.5); }
        .wa-chat-scroll::-webkit-scrollbar { width: 6px; }
        .wa-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .wa-chat-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
        .wa-chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.4); }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover { color: #38bdf8 !important; }
      `}</style>
      
      <div style={styles.container} className="team-content">
        {/* Navigation & Header Actions */}
        <div style={styles.topNavRow}>
          <button onClick={() => navigate("/teams")} style={styles.backBtn}>
            ← Back to Teams
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            {!isLeader && (
              <button onClick={leaveTeam} style={styles.leaveBtn}>
                <LogOut size={14} /> Leave Team
              </button>
            )}
            {isLeader && (
              <button onClick={deleteTeam} style={styles.deleteTeamBtn}>
                <Trash2 size={14} /> Delete Pod
              </button>
            )}
          </div>
        </div>

        {/* Main Workspace Frame */}
        <div style={styles.mainCard}>
          <div style={styles.glowOrb}></div>

          {/* Header Info */}
          <div style={styles.headerInfoSection}>
            <div style={styles.badgeRow}>
              <span style={styles.idBadge}>
                <Terminal size={14} color="#38bdf8" /> Workspace #{id.slice(-6)}
              </span>
              <span style={styles.statusLive}>
                <span style={styles.pulseDot}></span> Live Encryption Active 🚀
              </span>
            </div>

            <h2 style={styles.teamTitle}>{team?.name || "Development & Engineering Team"}</h2>
            <p style={styles.metaText}>{team?.description || "High-velocity technical decision pod and real-time sync channel."}</p>
          </div>

          {/* Navigation Tabs */}
          <div style={styles.tabsRow}>
            <button
              onClick={() => setActiveTab("chat")}
              className="tab-btn"
              style={{
                ...styles.tabItem,
                borderBottom: activeTab === "chat" ? "2px solid #38bdf8" : "2px solid transparent",
                color: activeTab === "chat" ? "#38bdf8" : "#94a3b8",
                background: activeTab === "chat" ? "rgba(56, 189, 248, 0.08)" : "transparent"
              }}
            >
              <MessageSquare size={16} /> Workspace Chat ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className="tab-btn"
              style={{
                ...styles.tabItem,
                borderBottom: activeTab === "members" ? "2px solid #38bdf8" : "2px solid transparent",
                color: activeTab === "members" ? "#38bdf8" : "#94a3b8",
                background: activeTab === "members" ? "rgba(56, 189, 248, 0.08)" : "transparent"
              }}
            >
              <Users size={16} /> Collaborators ({team?.members?.length || 0})
            </button>
          </div>

          {/* TAB 1: WHATSAPP-STYLE ADVANCED CHAT */}
          {activeTab === "chat" && (
            <div style={styles.waChatWrapper}>
              <div style={styles.waChatHeader}>
                <div style={styles.waHeaderAvatar}>
                  <Sparkles size={18} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", color: "#fff", fontWeight: "700" }}>
                    {team?.name || "Pod Secure Stream"}
                  </h4>
                  <span style={{ fontSize: "11px", color: "#34d399" }}>
                    {team?.members?.length || 1} members connected online
                  </span>
                </div>
              </div>

              <div className="wa-chat-scroll" style={styles.waMessagesBody}>
                {messages.length === 0 ? (
                  <div style={styles.emptyChat}>
                    <div style={styles.emptyIconBubble}>💬</div>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>
                      End-to-end synchronized pod feed. Send your first broadcast!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const senderId = msg.sender?._id || msg.sender;
                    const isMe = user && senderId && senderId.toString() === user._id.toString();

                    return (
                      <div
                        key={msg._id || Math.random()}
                        style={{
                          ...styles.messageRow,
                          justifyContent: isMe ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            background: isMe ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "rgba(30, 41, 59, 0.8)",
                            borderTopRightRadius: isMe ? "4px" : "16px",
                            borderTopLeftRadius: isMe ? "16px" : "4px",
                          }}
                        >
                          {!isMe && (
                            <span style={styles.msgSenderName}>
                              {msg.sender?.name || "Collaborator"}
                            </span>
                          )}
                          <p style={styles.msgText}>{msg.message}</p>
                          <div style={styles.msgFooter}>
                            <span style={styles.msgTime}>
                              {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck size={14} color="#bae6fd" style={{ marginLeft: "4px" }} />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <div style={styles.waInputFooter}>
                <button style={styles.waAttachmentBtn} title="Attach item">
                  <Paperclip size={18} color="#94a3b8" />
                </button>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a secure message..."
                  style={styles.waTextInput}
                />
                <button style={styles.waAttachmentBtn} title="Emojis">
                  <Smile size={18} color="#94a3b8" />
                </button>
                <button
                  onClick={handleSend}
                  className="wa-send-btn"
                  style={styles.waSendButton}
                >
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COLLABORATORS & MEMBER MANAGEMENT */}
          {activeTab === "members" && (
            <div style={styles.membersTabWrapper} className="team-content">
              {isLeader && (
                <div style={styles.addMemberBox}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <UserPlus size={18} color="#38bdf8" />
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#fff" }}>Enroll New Collaborator</h3>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input
                      type="email"
                      placeholder="Enter collaborator email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMember()}
                      style={styles.inputStyle}
                    />
                    <button onClick={addMember} style={styles.actionBtn}>
                      <UserPlus size={16} /> Add Member
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={styles.sectionHeader}>Authenticated Nodes</h3>
                <span style={styles.memberCountBadge}>{team?.members?.length || 0} Active</span>
              </div>

              <div style={styles.memberList}>
                {team?.members && team.members.length > 0 ? (
                  team.members.map((member) => {
                    const memberId = member._id || member;
                    const isMemberLeader = leaderId && memberId.toString() === leaderId.toString();

                    return (
                      <div key={memberId} style={styles.memberItem}>
                        <div style={styles.avatarCircle}>
                          {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: "14px", color: "#fff", fontWeight: "700" }}>
                            {member.name || "Collaborator"}
                          </h4>
                          <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                            {member.email || "node@decisionhub.internal"}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={isMemberLeader ? styles.leaderBadge : styles.roleTag}>
                            {isMemberLeader ? "👑 Leader" : "Member"}
                          </span>

                          {isLeader && !isMemberLeader && (
                            <button
                              onClick={() => removeMember(member._id)}
                              style={styles.removeBtnStyle}
                            >
                              <UserMinus size={14} /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>No members registered.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM UNIQUE POPUP MODAL (Replaces Native Browser Alert/Confirm) */}
      {modal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="custom-modal">
            <div style={styles.modalHeader}>
              <div style={styles.modalIconBox}>
                <AlertCircle size={22} color="#38bdf8" />
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
                {modal.type === "confirm" ? "Confirm" : "Got it"}
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
    maxWidth: "900px",
    margin: "0 auto",
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
  topNavRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
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
    transition: "all 0.2s ease",
  },
  leaveBtn: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#f87171",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  deleteTeamBtn: {
    background: "rgba(220, 38, 38, 0.2)",
    border: "1px solid rgba(220, 38, 38, 0.4)",
    color: "#fca5a5",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  mainCard: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "28px",
    padding: "32px",
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
  headerInfoSection: {
    position: "relative",
    zIndex: 1,
    marginBottom: "20px",
  },
  badgeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "10px",
  },
  idBadge: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  statusLive: {
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.25)",
    color: "#38bdf8",
    padding: "6px 14px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pulseDot: {
    width: "7px",
    height: "7px",
    backgroundColor: "#34d399",
    borderRadius: "50%",
    boxShadow: "0 0 10px #34d399",
  },
  teamTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 6px 0",
    letterSpacing: "-0.02em",
  },
  metaText: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
  },
  tabsRow: {
    display: "flex",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "24px",
    position: "relative",
    zIndex: 1,
  },
  tabItem: {
    padding: "12px 20px",
    background: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  // WhatsApp Chat Styling
  waChatWrapper: {
    background: "rgba(2, 6, 23, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
    position: "relative",
    zIndex: 1,
  },
  waChatHeader: {
    background: "rgba(15, 23, 42, 0.95)",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  waHeaderAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(56, 189, 248, 0.3)",
  },
  waMessagesBody: {
    height: "380px",
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  emptyChat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    gap: "8px",
  },
  emptyIconBubble: {
    fontSize: "28px",
    background: "rgba(255,255,255,0.04)",
    padding: "12px",
    borderRadius: "50%",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    position: "relative",
  },
  msgSenderName: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#38bdf8",
    marginBottom: "3px",
  },
  msgText: {
    color: "#f8fafc",
    fontSize: "13.5px",
    margin: 0,
    lineHeight: "1.45",
    wordBreak: "break-word",
  },
  msgFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "2px",
    marginTop: "4px",
  },
  msgTime: {
    fontSize: "10px",
    color: "rgba(255, 255, 255, 0.5)",
  },
  waInputFooter: {
    background: "rgba(15, 23, 42, 0.95)",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  },
  waAttachmentBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  waTextInput: {
    flex: 1,
    background: "rgba(2, 6, 23, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "10px 14px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "13.5px",
    outline: "none",
  },
  waSendButton: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#0ea5e9",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  // Members Tab Styles
  membersTabWrapper: {
    position: "relative",
    zIndex: 1,
  },
  addMemberBox: {
    marginBottom: "24px",
    background: "rgba(2, 6, 23, 0.6)",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  inputStyle: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#fff",
    fontSize: "13.5px",
    outline: "none",
  },
  actionBtn: {
    padding: "12px 18px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "13.5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  sectionHeader: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#e2e8f0",
    margin: 0,
  },
  memberCountBadge: {
    fontSize: "12px",
    background: "rgba(139, 92, 246, 0.15)",
    color: "#c084fc",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    padding: "3px 10px",
    borderRadius: "6px",
    fontWeight: "600",
  },
  memberList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  memberItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "rgba(2, 6, 23, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "12px 16px",
    borderRadius: "12px",
  },
  avatarCircle: {
    width: "38px",
    height: "38px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    color: "#fff",
    fontSize: "14px",
  },
  roleTag: {
    fontSize: "11px",
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    color: "#38bdf8",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "700",
  },
  leaderBadge: {
    fontSize: "11px",
    background: "rgba(251, 191, 36, 0.12)",
    border: "1px solid rgba(251, 191, 36, 0.25)",
    color: "#fbbf24",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "700",
  },
  removeBtnStyle: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
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
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
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

export default TeamDetails;