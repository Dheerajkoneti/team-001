const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import {
  getPollById,
  castVote,
  getPollResults,
  deletePoll,
  verifyPollAccess,
  removeVote
} from "../../services/pollService";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment
} from "../../services/commentService";

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState([]);
  const [rating, setRating] = useState(null);
  const [voted, setVoted] = useState(false);
  const [voteId, setVoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [checkingAccess, setCheckingAccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadComments();
  }, [id]);

  const loadComments = async () => {
    try {
      const res = await getComments(id);
      const fetchedComments = Array.isArray(res.data) 
        ? res.data 
        : res.data?.comments || [];
      setComments(fetchedComments);
    } catch (err) {
      console.log(err);
      setComments([]);
    }
  };

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const pollRes = await getPollById(id);
        setPoll(pollRes.data);

        const resultsRes = await getPollResults(id);
        setResults(resultsRes.data);

        if (pollRes.data.visibility === "public") {
          setAccessGranted(true);
        }

      } catch (err) {
        setError("Failed to load poll.");
      } finally {
        setLoading(false);
      }
    };

    loadPoll();
  }, [id]);

  useEffect(() => {
    const checkUserVote = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) return;

        const res = await fetch(
          `${__DECISIONHUB_API_ORIGIN__}/api/polls/${id}/user/${user._id}/voted`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (data.voted) {
          setVoted(true);
          setVoteId(data.voteId);
        }
      } catch (error) {
        console.log("Vote check failed");
      }
    };

    checkUserVote();
  }, [id]);

  const handleVerifyAccess = async () => {
    setAccessError("");
    setCheckingAccess(true);
    try {
      await verifyPollAccess(id, accessCode);
      setAccessGranted(true);
      const res = await getPollResults(id);
      setResults(res.data);
    } catch (err) {
      setAccessError(err.response?.data?.message || "Invalid access code.");
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this poll?")) return;
    try {
      await deletePoll(id);
      navigate("/polls");
    } catch {
      setError("Failed to delete poll.");
    }
  };

  const toggleOption = (optionId) => {
    if (poll.pollType === "single") {
      setSelected([optionId]);
    } else {
      setSelected((prev) =>
        prev.includes(optionId) ? prev.filter((o) => o !== optionId) : [...prev, optionId]
      );
    }
  };

  const handleVote = async () => {
    setError("");
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await castVote({
        pollId: id,
        user: user?._id,
        selectedOptions: selected,
        rating
      });

      setVoteId(res.data.vote._id);
      const resultsRes = await getPollResults(id);
      setResults(resultsRes.data);
      setVoted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to submit vote."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveVote = async () => {
    setError("");
    try {
      await removeVote(voteId);
      const res = await getPollResults(id);
      setResults(res.data);
      setVoted(false);
      setVoteId(null);
      setSelected([]);
      setRating(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove vote.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        pollId: id,
        userId: user._id,
        text: newComment
      });

      setNewComment("");
      loadComments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await updateComment(commentId, editText);
      setEditingId(null);
      setEditText("");
      loadComments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      loadComments();
    } catch (err) {
      console.log(err);
    }
  };

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("DECISIONHUB", 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Executive Poll Report | Generated: ${timestamp}`, 15, 28);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Poll Question:", 15, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(poll.question, 15, 63, { maxWidth: 180 });

    let yPos = 75;
    if (poll.description) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Description: ${poll.description}`, 15, yPos, { maxWidth: 180 });
      yPos += 15;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Type: ${poll.pollType.toUpperCase()}   |   Visibility: ${poll.visibility.toUpperCase()}   |   Total Votes: ${results?.totalVotes || 0}`, 15, yPos);
    yPos += 15;

    doc.setFillColor(241, 245, 249);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("OPTIONS BREAKDOWN", 18, yPos + 6);
    yPos += 15;

    poll.options.forEach((option, index) => {
      const votes = getVotes(option._id);
      const pct = getPercent(option._id);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${option.text}`, 18, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.text(`Votes: ${votes} (${pct})`, 140, yPos);
      yPos += 10;
    });

    yPos += 10;

    doc.setFillColor(241, 245, 249);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`COMMUNITY DISCUSSION (${comments.length} Comments)`, 18, yPos + 6);
    yPos += 15;

    if (comments.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("No comments recorded for this poll.", 18, yPos);
    } else {
      comments.forEach((comment) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(14, 165, 233);
        doc.text(`${comment.user?.name || "Anonymous User"}:`, 18, yPos);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        doc.text(`"${comment.text}"`, 18, yPos + 6, { maxWidth: 175 });
        yPos += 16;
      });
    }

    doc.save(`Poll_Report_${id.slice(-6)}.pdf`);
  };

  const getPercent = (optionId) => {
    if (!results || results.totalVotes === 0) return "0%";
    const opt = results.optionResults.find((o) => o.optionId === optionId);
    return opt ? `${Math.round((opt.votes / results.totalVotes) * 100)}%` : "0%";
  };

  const getVotes = (optionId) => {
    if (!results) return 0;
    const opt = results.optionResults.find((o) => o.optionId === optionId);
    return opt ? opt.votes : 0;
  };

  if (loading) return <DashboardLayout><p style={{ color: "#94a3b8", padding: "40px" }}>Loading poll...</p></DashboardLayout>;
  if (error && !poll) return <DashboardLayout><p style={{ color: "#f87171", padding: "40px" }}>{error}</p></DashboardLayout>;

  if (poll && poll.visibility === "private" && !accessGranted) {
    return (
      <>
        <div style={{ maxWidth: "440px", margin: "80px auto" }}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 8px 0" }}>Private Poll</h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Enter the access code to view and vote on this poll.</p>
            </div>
            {accessError && <p style={{ color: "#f87171", marginBottom: "12px", fontSize: "14px" }}>{accessError}</p>}
            <input
              style={{ ...styles.input, marginBottom: "12px" }}
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyAccess()}
            />
            <button onClick={handleVerifyAccess} disabled={checkingAccess || !accessCode.trim()} style={styles.voteBtn}>
              {checkingAccess ? "Verifying..." : "Unlock Poll"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .option-btn:hover { background: rgba(56, 189, 248, 0.15) !important; border-color: rgba(56, 189, 248, 0.5) !important; transform: translateY(-2px); }
        .back-btn:hover { color: #38bdf8 !important; }
        .report-btn:hover { background: linear-gradient(135deg, #7c3aed, #6d28d9) !important; transform: translateY(-1px); box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3); }
        .post-btn:hover { background: #0284c7 !important; transform: translateY(-1px); }
        .comments-toggle-bar:hover { background: rgba(30, 41, 59, 0.8) !important; border-color: rgba(56, 189, 248, 0.3) !important; }
        .comment-action-btn:hover { transform: scale(1.15); filter: brightness(1.2); }
      `}</style>
      <div style={styles.container}>
        <button onClick={() => navigate("/polls")} style={styles.backBtn} className="back-btn">← Back to Polls</button>
        {user &&
        (
          user.role === "admin" ||
          poll?.createdBy === user._id
        ) && (
          <button
            onClick={handleDelete}
            style={styles.deleteBtn}
          >
            🗑 Delete Poll
          </button>
        )}
        <div style={styles.card}>
          <div style={styles.badgeRow}>
            <span style={styles.idBadge}>{poll.pollType} poll</span>
            <span style={poll.isActive ? styles.statusLive : styles.statusClosed}>
              {poll.isActive ? "Live ⚡" : "Closed ✅"}
            </span>
          </div>

          <h2 style={styles.questionTitle}>{poll.question}</h2>
          <p style={styles.metaText}>{poll.description || "Cast your vote below."}</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ ...styles.infoBadge, background: poll.visibility === "private" ? "rgba(139,92,246,0.1)" : "rgba(56,189,248,0.1)", color: poll.visibility === "private" ? "#c084fc" : "#38bdf8", border: poll.visibility === "private" ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(56,189,248,0.2)" }}>
              {poll.visibility === "private" ? "🔒 Private" : "🌐 Public"}
            </span>
            {poll.anonymous && (
              <span style={{ ...styles.infoBadge, background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
                👤 Anonymous
              </span>
            )}
          </div>

          {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

          {poll.pollType === "rating" ? (
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} style={{ ...styles.starBtn, background: rating >= star ? "rgba(56, 189, 248, 0.2)" : "rgba(2, 6, 23, 0.5)", borderColor: rating >= star ? "#38bdf8" : "rgba(255,255,255,0.1)" }}>
                  {star} ★
                </button>
              ))}
            </div>
          ) : (
            <div style={styles.optionsGrid}>
              {poll.options.map((opt) => {
                const isSelected = selected.includes(opt._id);
                const pct = getPercent(opt._id);
                return (
                  <div key={opt._id} onClick={() => !voted && toggleOption(opt._id)} style={{ ...styles.optionBox, borderColor: isSelected ? "#38bdf8" : "rgba(255,255,255,0.08)", background: isSelected ? "rgba(56, 189, 248, 0.1)" : "rgba(2, 6, 23, 0.5)", cursor: voted ? "default" : "pointer" }} className={voted ? "" : "option-btn"}>
                    <div style={styles.optionTop}>
                      <span style={styles.optionName}>{opt.text}</span>
                      {isSelected && <CheckCircle2 size={18} color="#38bdf8" />}
                    </div>
                    <div style={styles.barTrack}>
                      <div style={{ ...styles.barFill, width: pct }}></div>
                    </div>
                    <div style={styles.optionFooter}>
                      <span>{getVotes(opt._id)} Votes</span>
                      <span>{pct}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {poll.pollType === "rating" && results?.averageRating != null && (
            <p style={{ color: "#38bdf8", fontWeight: "700", marginTop: "12px" }}>
              Average Rating: {results.averageRating.toFixed(1)} / 5 ({results.totalVotes} votes)
            </p>
          )}

          {!voted && poll.isActive && (
            <button onClick={handleVote} disabled={submitting || (poll.pollType !== "rating" && selected.length === 0) || (poll.pollType === "rating" && !rating)} style={styles.voteBtn}>
              {submitting ? "Submitting..." : "Submit Vote"}
            </button>
          )}

          {voted && (
            <div style={styles.successBanner}>
              <CheckCircle2 size={20} color="#34d399" />
              <span style={{ flex: 1 }}>Your vote has been recorded!</span>
              <button onClick={handleRemoveVote} style={styles.removeVoteBtn}>Remove Vote</button>
            </div>
          )}

          {/* Attractive PDF Report Download Button */}
          <button
            onClick={downloadPDFReport}
            className="report-btn"
            style={{
              marginTop: "24px",
              width: "100%",
              padding: "14px 20px",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.2)",
              transition: "all 0.2s ease"
            }}>
            <span>📄</span> Download PDF Executive Report
          </button>

          {/* Separator Toggle Bar for Comments */}
          <div
            onClick={() => setShowCommentsSection(!showCommentsSection)}
            className="comments-toggle-bar"
            style={{
              marginTop: "30px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "16px 20px",
              borderRadius: "14px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>💬</span>
              <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>
                Discussion & Comments ({comments.length})
              </span>
            </div>
            <span style={{ color: "#38bdf8", fontWeight: "600", fontSize: "14px" }}>
              {showCommentsSection ? "Hide Comments ▲" : "Show Comments ▼"}
            </span>
          </div>

          {/* Expandable Comments Drawer Section */}
          {showCommentsSection && (
            <div
              style={{
                marginTop: "15px",
                background: "rgba(2, 6, 23, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "16px",
                padding: "24px",
                animation: "fadeIn 0.3s ease"
              }}>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "24px"
                }}
              >
                <input
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(e.target.value)
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  placeholder="Share your thoughts on this poll..."
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(15, 23, 42, 0.8)",
                    color: "#fff",
                    fontSize: "15px",
                    outline: "none"
                  }}
                />

                <button
                  onClick={handleCommentSubmit}
                  className="post-btn"
                  style={{
                    padding: "14px 24px",
                    background: "#0ea5e9",
                    border: "none",
                    color: "#fff",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "15px",
                    transition: "all 0.2s ease"
                  }}
                >
                  Post
                </button>
              </div>

              {comments?.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", background: "rgba(15, 23, 42, 0.3)", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.08)" }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                    No comments yet. Be the first to join the conversation!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments?.map((comment) => {
                    const isCommentOwner =
                      user &&
                      (
                        user.role === "admin" ||
                        comment.user?._id === user._id ||
                        comment.userId === user._id
                      );
                    const isPollOwner =
                      poll?.createdBy === user?._id;
                    const canDelete =
                      isCommentOwner || isPollOwner;

                    return (
                      <div
                        key={comment._id}
                        style={{
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          padding: "16px 18px",
                          borderRadius: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "12px"
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: "6px" }}>
                            <strong
                              style={{
                                color: "#38bdf8",
                                fontSize: "14px",
                                fontWeight: "600"
                              }}
                            >
                              {comment.user?.name || "User"}
                            </strong>
                          </div>

                          {editingId === comment._id ? (
                            <div>
                              <input
                                value={editText}
                                onChange={(e) =>
                                  setEditText(e.target.value)
                                }
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: "1px solid #334155",
                                  background: "#0f172a",
                                  color: "#fff",
                                  outline: "none"
                                }}
                              />

                              <div
                                style={{
                                  marginTop: "8px",
                                  display: "flex",
                                  gap: "8px"
                                }}
                              >
                                <button
                                  onClick={() =>
                                    handleEditComment(comment._id)
                                  }
                                  style={{
                                    padding: "6px 12px",
                                    background: "#22c55e",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                  }}
                                >
                                  Save
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditText("");
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#64748b",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p
                              style={{
                                color: "#e2e8f0",
                                margin: 0,
                                fontSize: "14px",
                                lineHeight: "1.5",
                                wordBreak: "break-word"
                              }}
                            >
                              {comment.text}
                            </p>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center"
                          }}>
                          {isCommentOwner && (
                            <button
                              onClick={() => {
                                setEditingId(comment._id);
                                setEditText(comment.text);
                              }}
                              className="comment-action-btn"
                              title="Edit comment"
                              style={{
                                background: "rgba(56, 189, 248, 0.1)",
                                border: "1px solid rgba(56, 189, 248, 0.2)",
                                color: "#38bdf8",
                                cursor: "pointer",
                                padding: "8px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease"
                              }}
                            >
                              ✏️
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() =>
                                handleDeleteComment(comment._id)
                              }
                              className="comment-action-btn"
                              title="Delete comment"
                              style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                color: "#f87171",
                                cursor: "pointer",
                                padding: "8px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease"
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column" },
  backBtn: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "20px", display: "inline-flex", alignItems: "center", alignSelf: "flex-start" },
  deleteBtn: { alignSelf: "flex-end", marginBottom: "20px", marginTop: "-48px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", padding: "8px 16px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
  card: { background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "24px", padding: "40px", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" },
  badgeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  idBadge: { color: "#94a3b8", fontSize: "13px", fontWeight: "600", textTransform: "capitalize" },
  statusLive: { background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" },
  statusClosed: { background: "rgba(100, 116, 139, 0.15)", color: "#94a3b8", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" },
  questionTitle: { fontSize: "26px", fontWeight: "800", color: "#fff", margin: "0 0 8px 0", letterSpacing: "-0.02em" },
  metaText: { color: "#94a3b8", fontSize: "14px", marginBottom: "30px" },
  optionsGrid: { display: "flex", flexDirection: "column", gap: "15px" },
  optionBox: { border: "1px solid", borderRadius: "14px", padding: "20px", transition: "all 0.2s ease" },
  optionTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  optionName: { fontSize: "16px", fontWeight: "700", color: "#fff" },
  barTrack: { width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" },
  barFill: { height: "100%", background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)", borderRadius: "4px", transition: "width 0.4s ease" },
  optionFooter: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", fontWeight: "600" },
  starBtn: { padding: "10px 16px", border: "1px solid", borderRadius: "10px", color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "16px" },
  voteBtn: { marginTop: "25px", width: "100%", padding: "14px", background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  successBanner: { marginTop: "25px", background: "rgba(6, 78, 59, 0.5)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "14px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", color: "#34d399", fontSize: "14px", fontWeight: "600" },
  removeVoteBtn: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "6px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "12px", cursor: "pointer" },
  infoBadge: { fontSize: "12px", padding: "4px 10px", borderRadius: "8px", fontWeight: "600" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2, 6, 23, 0.5)", color: "#fff", fontSize: "15px", boxSizing: "border-box" },
};

export default PollDetails;