const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getCommunityById, leaveCommunity, getCommunities } from "../../services/communityService";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
  getLeaderboard,
  pinPost,
  makeAnnouncement,
  editPost
} from "../../services/communityPostService";
import { 
  Users, Image, FileText, Heart, Send, Search, Trash2, LogOut, 
  Pin, Megaphone, Calendar, Sparkles, Terminal, CheckCheck, Maximize2, X, 
  Paperclip, Smile, Globe2, TrendingUp, BarChart2, MoreVertical, Edit2, EyeOff, Check, X as XIcon
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const CommunityHub = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [communitiesList, setCommunitiesList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [expandedImage, setExpandedImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [hiddenForMe, setHiddenForMe] = useState(
    JSON.parse(localStorage.getItem("hiddenPosts") || "[]")
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadData = async () => {
    try {
      const communityRes = await getCommunityById(id);
      setCommunity(communityRes.data.community);

      const allCommsRes = await getCommunities();
      setCommunitiesList(allCommsRes.data.communities || []);

      const postRes = await getPosts(id);
      setPosts(postRes.data.posts);

      const leaderboardRes = await getLeaderboard(id);
      setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const handlePost = async () => {
    if (!content.trim() && !imageFile && !attachmentFile) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (attachmentFile) {
        formData.append("file", attachmentFile);
      }

      await createPost(id, formData);

      setContent("");
      setImageFile(null);
      setAttachmentFile(null);
      setShowPicker(false);
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePin = async (postId) => {
    try {
      await pinPost(postId);
      const res = await getPosts(id);
      setPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditStart = (post) => {
    setEditingId(post._id);
    setEditContent(post.content);
    setOpenMenuId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleEditSave = async (postId) => {
    if (!editContent.trim()) return;
    try {
      await editPost(postId, editContent);
      setEditingId(null);
      setEditContent("");
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForMe = (postId) => {
    const updated = [...hiddenForMe, postId];
    setHiddenForMe(updated);
    localStorage.setItem("hiddenPosts", JSON.stringify(updated));
    setOpenMenuId(null);
  };

  const handleAnnouncement = async (postId) => {
    try {
      await makeAnnouncement(postId);
      const res = await getPosts(id);
      setPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveCommunity(id);
      alert("Left Community");
      navigate("/communities");
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content?.toLowerCase().includes(search.toLowerCase()) &&
    !hiddenForMe.includes(post._id)
  );

  const filteredSidebarComms = communitiesList.filter((c) =>
    c.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  const pinnedPost = posts.find((post) => post.isPinned);
  const announcementPost = posts.find((post) => post.isAnnouncement);

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .hub-content { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .modal-zoom { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .chat-bubble-hover:hover { filter: brightness(1.02); }
        .channel-item:hover { background: rgba(59, 130, 246, 0.1) !important; }
        .wa-scroll::-webkit-scrollbar { width: 5px; }
        .wa-scroll::-webkit-scrollbar-track { background: transparent; }
        .wa-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        .wa-scroll::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
      `}</style>

      <div style={styles.outerContainer} className="hub-content">
        
        {/* WhatsApp Layout Wrapper */}
        <div style={styles.whatsappShell}>

          {/* 1. LEFT SIDEBAR (Channels & Chats) */}
          <div style={styles.leftSidebar}>
            <div style={styles.sidebarHeader}>
              <div style={styles.sidebarTitleRow}>
                <Globe2 size={20} color="#3B82F6" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#F9FAFB" }}>Communities</h3>
              </div>
              <div style={styles.sidebarSearchBox}>
                <Search size={14} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  style={styles.sidebarSearchInput}
                />
              </div>
            </div>

            <div className="wa-scroll" style={styles.channelsList}>
              <div style={styles.sectionCategoryLabel}>PINNED CHANNELS</div>
              {filteredSidebarComms.map((comm) => {
                const isActive = comm._id === id;
                return (
                  <div
                    key={comm._id}
                    onClick={() => navigate(`/communities/${comm._id}/hub`)}
                    className="channel-item"
                    style={{
                      ...styles.channelCard,
                      background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                      borderColor: isActive ? "rgba(59, 130, 246, 0.3)" : "transparent"
                    }}
                  >
                    <div style={styles.channelAvatar}>
                      {comm.name ? comm.name.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={styles.channelName}>{comm.name}</h4>
                        <span style={styles.channelTime}>Active</span>
                      </div>
                      <p style={styles.channelLastMsg}>{comm.description || "Tap to open discussion feed"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. CENTER CHAT FEED AREA */}
          <div style={styles.centerChatArea}>
            
            {/* TOP BAR */}
            <div style={styles.topBar}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={styles.topBarAvatar}>
                  {community?.name ? community.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h2 style={styles.topBarTitle}>{community?.name || "Loading..."}</h2>
                  <span style={styles.topBarSub}>
                    <span style={styles.onlineDot}></span> {community?.members?.length || 0} online members • Encrypted Feed
                  </span>
                </div>
              </div>

              <div style={styles.topBarIcons}>
                <div style={styles.topIconBtn} title="Leave Community" onClick={handleLeave}><LogOut size={16} color="#EF4444" /></div>
              </div>
            </div>

            {/* Pinned / Announcement banner inside chat */}
            {(pinnedPost || announcementPost) && (
              <div style={styles.chatPinnedBanner}>
                {pinnedPost && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#3B82F6" }}>
                    <Pin size={14} /> <strong>Pinned:</strong> {pinnedPost.content}
                  </div>
                )}
                {announcementPost && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#C084FC", marginTop: pinnedPost ? "4px" : "0" }}>
                    <Megaphone size={14} /> <strong>Announcement:</strong> {announcementPost.content}
                  </div>
                )}
              </div>
            )}

            {/* MAIN MESSAGES CONVERSATION FEED */}
            <div className="wa-scroll" style={styles.messagesContainer}>
              {filteredPosts.length === 0 ? (
                <div style={styles.emptyChatFeed}>
                  <p style={{ color: "#9CA3AF", margin: 0 }}>No messages in this secure pod yet. Start the conversation below!</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isMe = user && post.userId?._id === user._id;
                  const isAdmin = user?.role === "admin";
                  const isMod = user?.role === "moderator";
                  const isEditing = editingId === post._id;
                  const isMenuOpen = openMenuId === post._id;

                  return (
                    <div
                      key={post._id}
                      style={{
                        ...styles.messageRowWrapper,
                        justifyContent: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="chat-bubble-hover"
                        style={{
                          ...styles.whatsappBubble,
                          background: isMe 
                            ? "linear-gradient(135deg, #2563EB, #1D4ED8)" 
                            : "#111827",
                          borderBottomRightRadius: isMe ? "4px" : "16px",
                          borderBottomLeftRadius: isMe ? "16px" : "4px",
                          border: isMe ? "none" : "1px solid rgba(59, 130, 246, 0.2)"
                        }}
                      >
                        {/* Author Header + Menu Button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          {!isMe && (
                            <span style={styles.bubbleAuthor}>
                              {post.userId?.name || "Community Member"}
                            </span>
                          )}
                          <div style={{ position: "relative", marginLeft: "auto" }}>
                            <button
                              onClick={() => setOpenMenuId(isMenuOpen ? null : post._id)}
                              style={styles.menuTriggerBtn}
                            >
                              <MoreVertical size={14} color="#9CA3AF" />
                            </button>

                            {isMenuOpen && (
                              <div style={styles.dropdownMenu}>
                                {isMe && (
                                  <button onClick={() => handleEditStart(post)} style={styles.dropdownItem}>
                                    <Edit2 size={13} /> Edit
                                  </button>
                                )}
                                {(isMe || isAdmin) && (
                                  <button onClick={() => { handleDelete(post._id); setOpenMenuId(null); }} style={styles.dropdownItem}>
                                    <Trash2 size={13} /> Delete
                                  </button>
                                )}
                                <button onClick={() => handleDeleteForMe(post._id)} style={styles.dropdownItem}>
                                  <EyeOff size={13} /> Delete for me
                                </button>
                                {(isAdmin || isMod) && (
                                  <button onClick={() => { handlePin(post._id); setOpenMenuId(null); }} style={styles.dropdownItem}>
                                    <Pin size={13} /> {post.isPinned ? "Unpin" : "Pin"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Text Content — Editable or Static */}
                        {isEditing ? (
                          <div style={{ marginTop: "6px" }}>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              style={styles.editTextarea}
                              rows="2"
                              autoFocus
                            />
                            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                              <button onClick={() => handleEditSave(post._id)} style={styles.editSaveBtn}>
                                <Check size={13} /> Save
                              </button>
                              <button onClick={handleEditCancel} style={styles.editCancelBtn}>
                                <XIcon size={13} /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p style={styles.bubbleText}>
                            {post.content}
                            {post.isEdited && <span style={styles.editedTag}> (edited)</span>}
                          </p>
                        )}

                        {/* Image Attachment */}
                        {post.image && (
                          <div 
                            style={styles.bubbleImageWrapper}
                            onClick={() => setExpandedImage(`${__DECISIONHUB_API_ORIGIN__}${post.image}`)}
                          >
                            <img
                              src={`${__DECISIONHUB_API_ORIGIN__}${post.image}`}
                              alt="attachment"
                              style={styles.bubbleImageFit}
                            />
                            <div style={styles.zoomHint}>
                              <Maximize2 size={12} color="#fff" /> Expand
                            </div>
                          </div>
                        )}

                        {/* File Attachment */}
                        {post.file && (
                        <a
                        href={`${__DECISIONHUB_API_ORIGIN__}${post.file}`}
    target="_blank"
    rel="noopener noreferrer"
                        style={styles.bubbleFileLink}
                        >
                       📄 Download Attachment
                          </a>
                        )}

                        {/* Bubble Footer: Timestamp & Reactions */}
                        <div style={styles.bubbleFooter}>
                          <button
                            onClick={() => handleLike(post._id)}
                            style={styles.bubbleLikeBtn}
                          >
                            <Heart 
                              size={13} 
                              color={post.likes?.length > 0 ? "#F43F5E" : "#9CA3AF"} 
                              fill={post.likes?.length > 0 ? "#F43F5E" : "transparent"} 
                            />
                            <span>{post.likes?.length || 0}</span>
                          </button>

                          <span style={styles.bubbleTimestamp}>
                            {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck size={14} color="#93C5FD" style={{ marginLeft: "2px" }} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* BOTTOM MESSAGE INPUT (WhatsApp Style with emoji-picker-react) */}
            <div style={styles.bottomInputArea}>
              
              {/* Advanced Emoji Picker Popup Box */}
              {showPicker && (
                <div style={styles.emojiPickerWrapper}>
                  <EmojiPicker
                    onEmojiClick={(emojiData) =>
                      setContent((prev) => prev + emojiData.emoji)
                    }
                    theme="dark"
                    height={350}
                    width="100%"
                  />
                </div>
              )}

              <div style={styles.inputToolbarGroup}>
                <label style={styles.toolbarIconBtn} title="Upload Image">
                  <Image size={18} color="#9CA3AF" />
                  <input type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files[0])} />
                </label>
                <label style={styles.toolbarIconBtn} title="Upload File">
                  <Paperclip size={18} color="#9CA3AF" />
                  <input type="file" hidden onChange={(e) => setAttachmentFile(e.target.files[0])} />
                </label>
                <button
                  style={{
                    ...styles.toolbarIconBtn,
                    background: showPicker ? "rgba(59, 130, 246, 0.2)" : "transparent",
                    borderRadius: "6px"
                  }}
                  title="Emoji Picker"
                  onClick={() => setShowPicker(!showPicker)}
                >
                  <Smile size={18} color={showPicker ? "#3B82F6" : "#9CA3AF"} />
                </button>
              </div>

              {(imageFile || attachmentFile) && (
                <div style={styles.activeFileBadges}>
                  {imageFile && <span style={styles.selectedBadge}>🖼️ {imageFile.name}</span>}
                  {attachmentFile && <span style={styles.selectedBadge}>📄 {attachmentFile.name}</span>}
                </div>
              )}

              <div style={styles.mainInputRow}>
                <textarea
                  placeholder="Type a message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); }}}
                  style={styles.whatsappTextarea}
                  rows="1"
                />
                <button
                  onClick={handlePost}
                  style={styles.whatsappSendBtn}
                >
                  <Send size={16} color="#FFFFFF" />
                </button>
              </div>
            </div>

          </div>

          {/* 3. RIGHT SIDEBAR (Community Analytics & Members) */}
          <div style={styles.rightSidebar}>
            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}><Users size={15} color="#3B82F6" /> Active Members</h3>
              <div className="wa-scroll" style={styles.memberScrollArea}>
                {community?.members?.map((member) => (
                  <div key={member._id} style={styles.rightMemberRow}>
                    <div style={styles.rightMiniAvatar}>{member.name ? member.name.charAt(0).toUpperCase() : "U"}</div>
                    <span style={{ color: "#F9FAFB", fontSize: "13px", fontWeight: "600" }}>{member.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}><TrendingUp size={15} color="#3B82F6" /> Top Contributors</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {leaderboard.map((item, index) => (
                  <div key={item._id._id} style={styles.contributorRow}>
                    <span style={{ color: "#F9FAFB", fontSize: "13px", fontWeight: "600" }}>#{index + 1} {item._id.name}</span>
                    <span style={styles.contributorBadge}>{item.totalPosts} posts</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}><BarChart2 size={15} color="#3B82F6" /> Pod Statistics</h3>
              <div style={{ fontSize: "12.5px", color: "#9CA3AF", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div>Total Discussions: <strong>{posts.length}</strong></div>
                <div>Encryption: <strong>SHA-256 Active</strong></div>
                <div>Consensus Rate: <strong>94.2%</strong></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* EXPANDED IMAGE ZOOM MODAL */}
      {expandedImage && (
        <div style={styles.modalOverlay} onClick={() => setExpandedImage(null)}>
          <div style={styles.modalContent} className="modal-zoom" onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setExpandedImage(null)}>
              <X size={20} color="#fff" />
            </button>
            <img src={expandedImage} alt="Expanded preview" style={styles.expandedImageStyle} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const styles = {
  outerContainer: {
    maxWidth: "1350px",
    margin: "0 auto",
    padding: "10px",
  },
  whatsappShell: {
    display: "flex",
    height: "calc(100vh - 100px)",
    background: "#0B1120",
    borderRadius: "20px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
  },
  leftSidebar: {
    width: "280px",
    background: "#111827",
    borderRight: "1px solid rgba(59, 130, 246, 0.2)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
  },
  sidebarTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  sidebarSearchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#0B1120",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
  },
  sidebarSearchInput: {
    background: "transparent",
    border: "none",
    color: "#F9FAFB",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  },
  channelsList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sectionCategoryLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: "0.05em",
    padding: "6px 8px",
  },
  channelCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "12px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "all 0.2s ease",
  },
  channelAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  channelName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    color: "#F9FAFB",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  channelTime: {
    fontSize: "10.5px",
    color: "#34D399",
    fontWeight: "600",
  },
  channelLastMsg: {
    margin: "3px 0 0 0",
    fontSize: "12px",
    color: "#9CA3AF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  centerChatArea: {
    flex: 1,
    background: "#0B1120",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topBar: {
    background: "#111827",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    color: "#FFFFFF",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },
  topBarTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#F9FAFB",
  },
  topBarSub: {
    fontSize: "11.5px",
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  onlineDot: {
    width: "7px",
    height: "7px",
    backgroundColor: "#34D399",
    borderRadius: "50%",
    boxShadow: "0 0 8px #34D399",
  },
  topBarIcons: {
    display: "flex",
    gap: "10px",
  },
  topIconBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatPinnedBanner: {
    background: "#111827",
    padding: "8px 20px",
    borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    backgroundImage: "radial-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  },
  emptyChatFeed: {
    textAlign: "center",
    margin: "auto",
    padding: "30px",
    background: "#111827",
    borderRadius: "16px",
    border: "1px dashed rgba(59, 130, 246, 0.2)",
  },
  messageRowWrapper: {
    display: "flex",
    width: "100%",
  },
  whatsappBubble: {
    maxWidth: "65%",
    padding: "12px 16px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    position: "relative",
  },
  bubbleAuthor: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: "4px",
  },
  bubbleText: {
    color: "#F9FAFB",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  bubbleImageWrapper: {
    position: "relative",
    marginTop: "10px",
    borderRadius: "12px",
    overflow: "hidden",
    maxHeight: "300px",
    background: "#0B1120",
    border: "1px solid rgba(59, 130, 246, 0.2)",
  },
  bubbleImageFit: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
  },
  zoomHint: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "rgba(11, 17, 32, 0.8)",
    color: "#FFFFFF",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "10.5px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  bubbleFileLink: {
    display: "inline-block",
    marginTop: "10px",
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "#3B82F6",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
  bubbleModRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  miniModBtn: {
    background: "rgba(11, 17, 32, 0.5)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    color: "#9CA3AF",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    cursor: "pointer",
    fontWeight: "600",
  },
  bubbleFooter: {
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
  },
  bubbleLikeBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#9CA3AF",
    padding: "3px 8px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
  },
  bubbleTimestamp: {
    fontSize: "10.5px",
    color: "#9CA3AF",
  },
  bubbleDeleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomInputArea: {
    background: "#111827",
    padding: "12px 20px",
    borderTop: "1px solid rgba(59, 130, 246, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "relative",
  },
  emojiPickerWrapper: {
    position: "absolute",
    bottom: "75px",
    left: "20px",
    zIndex: 100,
    boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
    borderRadius: "14px",
    overflow: "hidden",
  },
  inputToolbarGroup: {
    display: "flex",
    gap: "12px",
  },
  toolbarIconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activeFileBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  selectedBadge: {
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    color: "#3B82F6",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11.5px",
  },
  mainInputRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
  },
  whatsappTextarea: {
    flex: 1,
    background: "#0B1120",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "14px",
    padding: "12px 16px",
    color: "#F9FAFB",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    maxHeight: "100px",
    boxSizing: "border-box",
  },
  whatsappSendBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
    flexShrink: 0,
  },
  rightSidebar: {
    width: "280px",
    background: "#111827",
    borderLeft: "1px solid rgba(59, 130, 246, 0.2)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flexShrink: 0,
    overflowY: "auto",
  },
  rightCard: {
    background: "#0B1120",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
  },
  rightCardTitle: {
    margin: "0 0 10px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#F9FAFB",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid rgba(59, 130, 246, 0.15)",
    paddingBottom: "8px",
  },
  memberScrollArea: {
    maxHeight: "160px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  rightMemberRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  rightMiniAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contributorRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "6px 10px",
    borderRadius: "8px",
  },
  contributorBadge: {
    fontSize: "11px",
    color: "#3B82F6",
    background: "rgba(59, 130, 246, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(11, 17, 32, 0.9)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
  modalCloseBtn: {
    position: "absolute",
    top: "-45px",
    right: "0",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  expandedImageStyle: {
    maxWidth: "90vw",
    maxHeight: "85vh",
    objectFit: "contain",
    borderRadius: "12px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  },
  menuTriggerBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: "20px",
    right: "0",
    background: "#1F2937",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    zIndex: 50,
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#F9FAFB",
    padding: "9px 12px",
    fontSize: "12.5px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  },
  editTextarea: {
    width: "100%",
    background: "#0B1120",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "8px",
    padding: "8px 10px",
    color: "#F9FAFB",
    fontSize: "13.5px",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
  },
  editSaveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    color: "#4ADE80",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11.5px",
    fontWeight: "700",
    cursor: "pointer",
  },
  editCancelBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#F87171",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11.5px",
    fontWeight: "700",
    cursor: "pointer",
  },
  editedTag: {
    fontSize: "10.5px",
    color: "#9CA3AF",
    fontStyle: "italic",
  },
};

export default CommunityHub;