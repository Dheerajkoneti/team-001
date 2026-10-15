import React, { useState, useEffect } from "react";

import {
  getDashboardStats,
  getRecentDecisions,
  getDashboardAnalytics,
  getVotingParticipation,
  getVoteDistribution,
  getDecisionTrends
} from "../../services/dashboardService";
import {
  Users,
  Vote,
  BarChart3,
  Activity,
  TrendingUp,
  Sparkles,
  PlusCircle,
  Search
} from "lucide-react";


function Dashboard() {

  const [user, setUser] = useState({
    name: "User"
  });

  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    decisions: 0,
    polls: 0,
    votes: 0
  });

  const [recentDecisions, setRecentDecisions] = useState([]);

  const [analytics, setAnalytics] = useState({
    openDecisions: 0,
    closedDecisions: 0,
    activePolls: 0,
    inactivePolls: 0
  });

  const [participation, setParticipation] = useState({
    totalVotes: 0,
    uniqueVoters: 0,
    totalUsers: 0,
    participationRate: 0
  });

  const [voteDistribution, setVoteDistribution] = useState([]);
  const [decisionTrends, setDecisionTrends] = useState([]);

  useEffect(() => {

    // ================= GET LOGGED-IN USER =================

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Failed to read user data:",
          error
        );
      }
    }


    // ================= GET DASHBOARD STATISTICS =================

    getDashboardStats()
      .then((res) => {

        if (res.data.success) {
          setStats(res.data.stats);
        }

      })
      .catch((error) => {

        console.error(
          "Failed to load dashboard stats:",
          error
        );

      });


    // ================= GET RECENT DECISIONS =================

    getRecentDecisions()
      .then((res) => {

        if (res.data.success) {
          setRecentDecisions(
            res.data.decisions
          );
        }

      })
      .catch((error) => {

        console.error(
          "Failed to load recent decisions:",
          error
        );

      });


    // ================= GET DASHBOARD ANALYTICS =================

    getDashboardAnalytics()
      .then((res) => {

        if (res.data.success) {
          setAnalytics(
            res.data.analytics
          );
        }

      })
      .catch((error) => {

        console.error(
          "Failed to load dashboard analytics:",
          error
        );

      });


    // ================= GET VOTING PARTICIPATION =================

    getVotingParticipation()
      .then((res) => {

        if (res.data.success) {
          setParticipation(
            res.data.participation
          );
        }

      })
      .catch((error) => {

        console.error(
          "Failed to load voting participation:",
          error
        );

      });


    // ================= GET VOTE DISTRIBUTION =================

    getVoteDistribution()
      .then((res) => {

        if (res.data.success) {
          setVoteDistribution(
            res.data.distribution
          );
        }

      })
      .catch((error) => {

        console.error(
          "Failed to load vote distribution:",
          error
        );

      });
      getDecisionTrends()
  .then((res) => {
    setDecisionTrends(res.data.trends);
  })
  .catch((err) => {
    console.error("Failed to fetch decision trends:", err);
  });

  }, []);


  return (

    <>

      <style>{`

        @keyframes fadeIn {

          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        .dashboard-content {

          animation:
            fadeIn
            0.6s
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;

        }


        .metric-card {

          transition:
            all
            0.3s
            cubic-bezier(0.4, 0, 0.2, 1);

        }


        .metric-card:hover {

          transform: translateY(-5px);

          border-color:
            rgba(56, 189, 248, 0.4) !important;

          box-shadow:
            0 15px 30px -5px
            rgba(14, 165, 233, 0.2);

        }


        .action-btn {

          transition: all 0.2s ease;

        }


        .action-btn:hover {

          transform: translateY(-2px);

          box-shadow:
            0 0 20px
            rgba(14, 165, 233, 0.4);

        }

      `}</style>


      <div className="dashboard-content">


        {/* ================= HEADER ================= */}

        <div style={styles.topHeader}>

          <div>

            <h1 style={styles.welcomeTitle}>

              Welcome back,{" "}

              <span style={styles.gradientText}>

                {user.name || "Innovator"}

              </span>{" "}

              👋

            </h1>


            <p style={styles.welcomeSubtitle}>

              Here is what's happening across
              your team workspaces today.

            </p>

          </div>


          <div style={styles.headerActions}>

            <div style={styles.searchBox}>

              <Search
                size={16}
                color="#64748b"
              />

              <input
                type="text"
                placeholder="Search decisions..."
                style={styles.searchInput}
              />

            </div>

          </div>

        </div>



        {/* ================= MAIN STATISTICS ================= */}

        <div style={styles.gridContainer}>

          {[

            {
              label: "Total Users",
              value: stats.users,
              icon: <Users size={20} />,
              color: "#38bdf8",
              bg: "rgba(56,189,248,0.12)",
              trend: "Registered users"
            },

            {
              label: "Total Teams",
              value: stats.teams,
              icon: <Users size={20} />,
              color: "#c084fc",
              bg: "rgba(139,92,246,0.12)",
              trend: "Active teams"
            },

            {
              label: "Total Decisions",
              value: stats.decisions,
              icon: <BarChart3 size={20} />,
              color: "#34d399",
              bg: "rgba(16,185,129,0.12)",
              trend: "Created decisions"
            },

            {
              label: "Total Polls",
              value: stats.polls,
              icon: <Vote size={20} />,
              color: "#fb7185",
              bg: "rgba(244,63,94,0.12)",
              trend: "Available polls"
            },

            {
              label: "Total Votes",
              value: stats.votes,
              icon: <Activity size={20} />,
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.12)",
              trend: "Votes submitted"
            }

          ].map((card) => (

            <div
              key={card.label}
              style={styles.metricCard}
              className="metric-card"
            >

              <div style={styles.cardHeaderRow}>

                <span style={styles.cardLabel}>
                  {card.label}
                </span>


                <div
                  style={{
                    ...styles.iconBadge,
                    background: card.bg,
                    color: card.color
                  }}
                >

                  {card.icon}

                </div>

              </div>


              <h2 style={styles.cardValue}>
                {card.value}
              </h2>


              <div style={styles.cardFooter}>

                <span style={styles.trendUp}>

                  <TrendingUp size={14} />

                  {card.trend}

                </span>

              </div>

            </div>

          ))}

        </div>



        {/* ================= DECISION & POLL ANALYTICS ================= */}

        <div style={styles.analyticsGrid}>

          <div style={styles.analyticsCard}>

            <span style={styles.analyticsLabel}>
              Open Decisions
            </span>

            <h3 style={styles.analyticsValue}>
              {analytics.openDecisions}
            </h3>

          </div>


          <div style={styles.analyticsCard}>

            <span style={styles.analyticsLabel}>
              Closed Decisions
            </span>

            <h3 style={styles.analyticsValue}>
              {analytics.closedDecisions}
            </h3>

          </div>


          <div style={styles.analyticsCard}>

            <span style={styles.analyticsLabel}>
              Active Polls
            </span>

            <h3 style={styles.analyticsValue}>
              {analytics.activePolls}
            </h3>

          </div>


          <div style={styles.analyticsCard}>

            <span style={styles.analyticsLabel}>
              Inactive Polls
            </span>

            <h3 style={styles.analyticsValue}>
              {analytics.inactivePolls}
            </h3>

          </div>

        </div>



        {/* ================= VOTING PARTICIPATION ================= */}

        <div style={styles.participationCard}>

          <div>

            <span style={styles.participationLabel}>
              Voting Participation
            </span>


            <h2 style={styles.participationValue}>
              {participation.participationRate}%
            </h2>


            <p style={styles.participationText}>

              {participation.uniqueVoters} out of{" "}

              {participation.totalUsers}

              {" "}users participated in voting.

            </p>

          </div>


          <div style={styles.participationStats}>

            <div>

              <span style={styles.smallLabel}>
                Total Votes
              </span>

              <strong style={styles.smallValue}>
                {participation.totalVotes}
              </strong>

            </div>


            <div>

              <span style={styles.smallLabel}>
                Unique Voters
              </span>

              <strong style={styles.smallValue}>
                {participation.uniqueVoters}
              </strong>

            </div>

          </div>

        </div>



        {/* ================= VOTE DISTRIBUTION ================= */}

        <div style={styles.voteDistributionCard}>

          <div style={styles.panelHeader}>

            <h3 style={{ margin: 0 }}>
              Vote Distribution
            </h3>


            <span style={styles.viewAll}>
              Voting Analytics
            </span>

          </div>


          {voteDistribution.length === 0 ? (

            <div style={styles.emptyDistribution}>

              No voting data available.

            </div>

          ) : (

            <div style={styles.distributionList}>

              {voteDistribution.map((poll) => (

                <div
                  key={poll.pollId}
                  style={styles.pollDistribution}
                >

                  <h4 style={styles.pollTitle}>
                    {poll.pollTitle}
                  </h4>


                  {poll.options.map((option) => {

                    const totalPollVotes =
                      poll.options.reduce(
                        (total, currentOption) =>
                          total + currentOption.votes,
                        0
                      );


                    const percentage =
                      totalPollVotes > 0
                        ? (
                            (option.votes /
                              totalPollVotes) *
                            100
                          ).toFixed(1)
                        : 0;


                    return (

                      <div
                        key={option.optionId}
                        style={styles.optionRow}
                      >

                        <div style={styles.optionInfo}>

                          <span>
                            {option.text}
                          </span>


                          <span>
                            {option.votes} votes
                          </span>

                        </div>


                        <div
                          style={
                            styles.progressBackground
                          }
                        >

                          <div
                            style={{
                              ...styles.progressBar,
                              width: `${percentage}%`
                            }}
                          />

                        </div>


                        <span
                          style={styles.percentageText}
                        >
                          {percentage}%
                        </span>

                      </div>

                    );

                  })}

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ================= DECISION TRENDS ================= */}

        <div style={styles.decisionTrendsCard}>

          <div style={styles.panelHeader}>

            <h3 style={{ margin: 0 }}>
              Decision Trends
            </h3>

            <span style={styles.viewAll}>
              Decisions Created
            </span>

          </div>

          {decisionTrends.length === 0 ? (

            <div style={styles.emptyDistribution}>
              No decision trend data available.
            </div>

          ) : (

            <div style={styles.trendsList}>

              {decisionTrends.map((trend) => {

                const monthName = new Date(
                  trend._id.year,
                  trend._id.month - 1
                ).toLocaleString("default", {
                  month: "short"
                });

                return (

                  <div
                    key={`${trend._id.year}-${trend._id.month}`}
                    style={styles.trendRow}
                  >

                    <div style={styles.trendInfo}>

                      <span>
                        {monthName} {trend._id.year}
                      </span>

                      <span>
                        {trend.count} decision
                        {trend.count !== 1 ? "s" : ""}
                      </span>

                    </div>

                    <div style={styles.progressBackground}>

                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${Math.min(
                            trend.count * 20,
                            100
                          )}%`
                        }}
                      />

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>



        {/* ================= RECENT DECISIONS + AI ================= */}
        <div style={styles.splitGrid}>


          {/* RECENT DECISIONS */}

          <div style={styles.panelCard}>

            <div style={styles.panelHeader}>

              <h3 style={{ margin: 0 }}>
                Recent Team Decisions
              </h3>


              <span style={styles.viewAll}>
                View All
              </span>

            </div>


            <div style={styles.activityList}>


              {recentDecisions.length === 0 ? (

                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#94a3b8"
                  }}
                >

                  No decisions available.

                </div>

              ) : (

                recentDecisions.map((item) => (

                  <div
                    key={item._id}
                    style={styles.activityItem}
                  >

                    <div>

                      <h4
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          color: "#fff"
                        }}
                      >

                        {item.title}

                      </h4>


                      <span
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8"
                        }}
                      >

                        {item.team?.name || "No Team"}

                        {" • "}

                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "Date unavailable"}

                      </span>

                    </div>


                    <span style={styles.statusBadge}>

                      {item.status || "Open"}

                    </span>

                  </div>

                ))

              )}

            </div>

          </div>



          {/* ================= AI INSIGHTS ================= */}

          <div style={styles.aiPanelCard}>


            <div style={styles.aiHeader}>

              <Sparkles
                size={20}
                color="#38bdf8"
              />

              <h3 style={{ margin: 0 }}>
                AI Workspace Insights
              </h3>

            </div>


            <p style={styles.aiText}>

              "Your engineering pod shows a{" "}

              <strong>
                92% consensus velocity
              </strong>

              {" "}this week. Decision resolution
              time has decreased by 40% since
              implementing asynchronous voting
              ballots."

            </p>


            <div style={styles.aiMetricBox}>


              <div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px"
                  }}
                >
                  Consensus Score
                </span>


                <h4
                  style={{
                    color: "#34d399",
                    fontSize: "20px",
                    margin: "4px 0 0 0"
                  }}
                >
                  94.2%
                </h4>

              </div>


              <div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px"
                  }}
                >
                  Time Saved
                </span>


                <h4
                  style={{
                    color: "#38bdf8",
                    fontSize: "20px",
                    margin: "4px 0 0 0"
                  }}
                >
                  14.5 hrs
                </h4>

              </div>


            </div>

          </div>


        </div>


      </div>

    </>

  );

}



/* ================= STYLES ================= */

const styles = {

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    flexWrap: "wrap",
    gap: "20px"
  },


  welcomeTitle: {
    fontSize: "30px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.02em"
  },


  gradientText: {
    background:
      "linear-gradient(135deg, #38bdf8, #8b5cf6)",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },


  welcomeSubtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "6px"
  },


  headerActions: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },


  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background:
      "rgba(15,23,42,0.7)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    padding: "10px 16px",
    borderRadius: "12px",
    backdropFilter: "blur(12px)"
  },


  searchInput: {
    background: "transparent",
    border: "none",
    color: "#fff",
    outline: "none",
    fontSize: "14px"
  },


  primaryActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background:
      "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow:
      "0 4px 20px rgba(14,165,233,0.3)"
  },


  gridContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },


  metricCard: {
    background:
      "rgba(15,23,42,0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.4)"
  },


  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },


  cardLabel: {
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600"
  },


  iconBadge: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },


  cardValue: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 10px 0",
    letterSpacing: "-0.02em"
  },


  cardFooter: {
    fontSize: "12px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },


  trendUp: {
    color: "#34d399",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },


  /* ================= ANALYTICS ================= */

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },


  analyticsCard: {
    background:
      "rgba(15,23,42,0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px"
  },


  analyticsLabel: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600"
  },


  analyticsValue: {
    color: "#fff",
    fontSize: "28px",
    margin: "8px 0 0 0"
  },


  /* ================= PARTICIPATION ================= */

  participationCard: {
    background:
      "rgba(15,23,42,0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(56,189,248,0.15)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    flexWrap: "wrap",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.3)"
  },


  participationLabel: {
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600"
  },


  participationValue: {
    fontSize: "38px",
    fontWeight: "800",
    margin: "8px 0",
    color: "#38bdf8"
  },


  participationText: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: 0
  },


  participationStats: {
    display: "flex",
    gap: "40px"
  },


  smallLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "5px"
  },


  smallValue: {
    color: "#fff",
    fontSize: "22px"
  },


  /* ================= VOTE DISTRIBUTION ================= */

  voteDistributionCard: {
    background:
      "rgba(15,23,42,0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.4)"
  },


  emptyDistribution: {
    textAlign: "center",
    padding: "30px",
    color: "#94a3b8",
    fontSize: "14px"
  },


  distributionList: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },


  pollDistribution: {
    background:
      "rgba(255,255,255,0.02)",
    border:
      "1px solid rgba(255,255,255,0.05)",
    borderRadius: "14px",
    padding: "18px"
  },


  pollTitle: {
    color: "#fff",
    fontSize: "15px",
    margin: "0 0 18px 0"
  },


  optionRow: {
    marginBottom: "14px"
  },


  optionInfo: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5e1",
    fontSize: "13px",
    marginBottom: "7px"
  },


  progressBackground: {
    width: "100%",
    height: "8px",
    background:
      "rgba(255,255,255,0.08)",
    borderRadius: "10px",
    overflow: "hidden"
  },


  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #38bdf8, #8b5cf6)",
    borderRadius: "10px",
    transition:
      "width 0.5s ease"
  },


  percentageText: {
    display: "block",
    textAlign: "right",
    color: "#38bdf8",
    fontSize: "11px",
    marginTop: "4px"
  },


  /* ================= DECISION TRENDS ================= */

  decisionTrendsCard: {
    background:
      "rgba(15,23,42,0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.4)"
  },

  trendsList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginTop: "20px"
  },

  trendRow: {
    width: "100%"
  },

  trendInfo: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5e1",
    fontSize: "13px",
    marginBottom: "7px"
  },


  /* ================= RECENT DECISIONS ================= */

  splitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },


  panelCard: {
    background:
      "rgba(15,23,42,0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.4)"
  },


  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },


  viewAll: {
    color: "#38bdf8",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },


  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },


  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background:
      "rgba(255,255,255,0.02)",
    border:
      "1px solid rgba(255,255,255,0.05)",
    padding: "14px 18px",
    borderRadius: "14px"
  },


  statusBadge: {
    fontSize: "12px",
    background:
      "rgba(56,189,248,0.1)",
    color: "#38bdf8",
    padding: "5px 10px",
    borderRadius: "8px",
    border:
      "1px solid rgba(56,189,248,0.2)",
    fontWeight: "600"
  },


  /* ================= AI ================= */

  aiPanelCard: {
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(49,46,129,0.4))",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(139,92,246,0.3)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },


  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px"
  },


  aiText: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.6",
    fontStyle: "italic",
    marginBottom: "20px"
  },


  aiMetricBox: {
    display: "flex",
    justifyContent: "space-between",
    background:
      "rgba(2,6,23,0.5)",
    padding: "15px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.06)"
  }

};


export default Dashboard;