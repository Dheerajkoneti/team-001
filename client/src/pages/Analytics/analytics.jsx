const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import socket from "../../socket";
import {
  Users,
  Building2,
  BarChart3,
  Activity,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  RefreshCw,
  Calendar,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

function Analytics() {
  const [overview, setOverview] = useState({
    users: 0,
    polls: 0,
    votes: 0,
    communities: 0,
  });

  const [voteData, setVoteData] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const [topPolls, setTopPolls] = useState([]);
  const [activities, setActivities] = useState([]);

  const [chartType, setChartType] = useState("members");
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();

    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000);

    socket.on("analyticsUpdated", () => {
      loadAnalytics();
    });

    return () => {
      clearInterval(interval);
      socket.off("analyticsUpdated");
    };
  }, []);

  const loadAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${__DECISIONHUB_API_ORIGIN__}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.overview) setOverview(res.data.overview);
      if (res.data?.voteTrend) setVoteData(res.data.voteTrend);
      if (res.data?.communities) setCommunityData(res.data.communities);
      if (res.data?.topPolls) setTopPolls(res.data.topPolls);
      if (res.data?.activities) setActivities(res.data.activities);
      
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error("Using fallback live metrics", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.heading}>
            <span style={styles.iconGradient}>📊</span> Analytics Dashboard
          </h1>
          <p style={styles.subHeading}>Real-time insights about your community activity and user engagement</p>
        </div>

        <div style={styles.headerActions}>
          <div style={styles.dateBadge}>
            <Calendar size={14} color="#38bdf8" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <div style={styles.liveBadge}>
            <span style={styles.liveDot} />
            <span>Live Data</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadAnalytics} 
            style={styles.refreshBtn}
          >
            <RefreshCw size={14} className={isRefreshing ? "spin" : ""} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div style={styles.grid}>
        <MetricCard
          icon={<Users size={24} />}
          title="Total Users"
          value={overview.users}
          trend="+16%"
          trendText="from last month"
          color="#38bdf8"
        />
        <MetricCard
          icon={<Activity size={24} />}
          title="Total Polls"
          value={overview.polls}
          trend="+25%"
          trendText="from last month"
          color="#8b5cf6"
        />
        <MetricCard
          icon={<BarChart3 size={24} />}
          title="Total Votes"
          value={overview.votes}
          trend="+40%"
          trendText="from last month"
          color="#10b981"
        />
        <MetricCard
          icon={<Building2 size={24} />}
          title="Total Communities"
          value={overview.communities}
          trend="+0%"
          trendText="from last month"
          color="#f59e0b"
        />
      </div>

      {/* Main Charts Grid */}
      <div style={styles.chartGrid}>
        <motion.div whileHover={{ y: -3 }} style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3>Voting Trend</h3>
              <p style={styles.cardSubText}>Total votes received each month</p>
            </div>
            <select style={styles.selectBox}>
              <option>Last 6 Months</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={voteData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} />
              <Line
                type="monotone"
                dataKey="votes"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: "#a855f7", r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3>Community Activity</h3>
              <p style={styles.cardSubText}>Members and engagement by community</p>
            </div>
            <div style={styles.pillTabs}>
              <span 
                style={chartType === "members" ? {...styles.pill, background: "#8b5cf6"} : styles.pillInactive}
                onClick={() => setChartType("members")}
              >
                Members
              </span>
              <span 
                style={chartType === "posts" ? {...styles.pill, background: "#8b5cf6"} : styles.pillInactive}
                onClick={() => setChartType("posts")}
              >
                Posts
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={communityData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} />
              <Bar dataKey={chartType} fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Secondary Row: Top Polls, Activity, & AI Insights */}
      <div style={styles.bottomGrid}>
        
        {/* Top Polls */}
        <div style={styles.subCard}>
          <div style={styles.cardTitleRow}>
            <Award size={18} color="#eab308" />
            <h3>Top Polls</h3>
          </div>
          <p style={styles.cardSubText}>Most voted polls in your platform</p>
          
          {topPolls.map((poll, index) => (
            <div key={poll._id || index} style={styles.pollItem}>
              <div style={styles.pollRank}>{index + 1}</div>
              <div style={styles.pollInfo}>
                <div style={styles.pollHeaderRow}>
                  <span>{poll.title}</span>
                  <span style={styles.pollVotes}>{poll.voteCount} votes</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div 
                    style={{ 
                      ...styles.progressBarFill, 
                      width: `${Math.min(poll.voteCount * 10, 100)}%`, 
                      background: "#8b5cf6" 
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={styles.subCard}>
          <div style={styles.cardTitleRow}>
            <Clock size={18} color="#38bdf8" />
            <h3>Recent Activity</h3>
          </div>
          <p style={styles.cardSubText}>Latest actions in your platform</p>

          <div style={styles.activityList}>
            {activities.map((a, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={{ ...styles.activityDot, background: "#10b981" }} />
                <div>
                  <p style={styles.activityText}>
                    <strong>{a.user}</strong> {a.action}
                  </p>
                  <span style={styles.activityTime}>
                    {new Date(a.time).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Card */}
        <div style={styles.aiCard}>
          <div style={styles.aiCardHeader}>
            <div style={styles.cardTitleRow}>
              <Sparkles size={18} color="#a855f7" />
              <h3>AI Insights</h3>
            </div>
            <span style={styles.aiBadge}>⭐ AI Powered</span>
          </div>
          <p style={styles.cardSubText}>Smart analysis of your community data</p>

          <div style={styles.insightBox}>
            <TrendingUp size={16} color="#10b981" />
            <span>Voting participation is increasing. Your community is getting more active!</span>
          </div>
          <div style={styles.insightBox}>
            <Sparkles size={16} color="#38bdf8" />
            <span>Top performing polls are driving the majority of user votes.</span>
          </div>
          <div style={styles.insightBox}>
            <Activity size={16} color="#f59e0b" />
            <span>Consider creating more interactive polls to boost engagement further.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend, trendText, color }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} style={styles.card}>
      <div style={styles.cardTopRow}>
        <div style={{ ...styles.iconBox, color: color, borderColor: `${color}40`, background: `${color}15` }}>
          {icon}
        </div>
        <span style={{ ...styles.trendBadge, color: trend.startsWith("+") ? "#10b981" : "#ef4444" }}>
          {trend}
        </span>
      </div>
      <h4 style={styles.cardTitle}>{title}</h4>
      <div style={styles.cardValueRow}>
        <h2>{value}</h2>
        <span style={styles.trendSubText}>{trendText}</span>
      </div>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    color: "#f8fafc",
    background: "#030712",
    fontFamily: "Inter, sans-serif",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  subHeading: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "4px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dateBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(30, 41, 59, 0.6)",
    padding: "8px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    fontSize: "13px",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#34d399",
  },
  liveDot: {
    width: "8px",
    height: "8px",
    background: "#10b981",
    borderRadius: "50%",
    boxShadow: "0 0 8px #10b981",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "9px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  card: {
    background: "linear-gradient(145deg, #0f172a, #090d16)",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  iconBox: {
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trendBadge: {
    fontSize: "12px",
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "500",
    marginBottom: "6px",
  },
  cardValueRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  trendSubText: {
    fontSize: "11px",
    color: "#64748b",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    background: "linear-gradient(145deg, #0f172a, #090d16)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  cardSubText: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  selectBox: {
    background: "#1e293b",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    outline: "none",
  },
  pillTabs: {
    display: "flex",
    gap: "4px",
    background: "#1e293b",
    padding: "3px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  pill: {
    padding: "4px 10px",
    fontSize: "11px",
    borderRadius: "6px",
    fontWeight: "600",
    color: "white",
  },
  pillInactive: {
    padding: "4px 10px",
    fontSize: "11px",
    borderRadius: "6px",
    color: "#94a3b8",
  },
  tooltipStyle: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  subCard: {
    background: "linear-gradient(145deg, #0f172a, #090d16)",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  aiCard: {
    background: "linear-gradient(145deg, #131127, #0b0917)",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid rgba(168, 85, 247, 0.25)",
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  aiCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aiBadge: {
    background: "rgba(168, 85, 247, 0.15)",
    color: "#c084fc",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "600",
  },
  pollItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "14px",
  },
  pollRank: {
    width: "24px",
    height: "24px",
    background: "#1e293b",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    color: "#38bdf8",
  },
  pollInfo: {
    flex: 1,
  },
  pollHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "4px",
    fontWeight: "500",
  },
  pollVotes: {
    color: "#94a3b8",
    fontSize: "11px",
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    background: "#1e293b",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "3px",
  },
  activityList: {
    marginTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  activityItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "12px",
  },
  activityDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginTop: "4px",
  },
  activityText: {
    color: "#e2e8f0",
    fontWeight: "400",
  },
  activityTime: {
    fontSize: "10px",
    color: "#64748b",
  },
  insightBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "rgba(30, 41, 59, 0.4)",
    padding: "10px 12px",
    borderRadius: "10px",
    marginTop: "12px",
    fontSize: "12px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    color: "#cbd5e1",
  },
};

export default Analytics;