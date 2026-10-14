const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeamList() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${__DECISIONHUB_API_ORIGIN__}/api/team`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeams(res.data.teams || []);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <DashboardLayout>
      <style>{`
        .team-card {
          transition: all 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 189, 248, 0.4) !important;
          box-shadow: 0 10px 30px rgba(14, 165, 233, 0.15);
        }
      `}</style>

      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.mainTitle}>
            Organization Teams
          </h1>

          <p style={styles.mainSubtitle}>
            Manage specialized pods and collaborative workspaces.
          </p>
        </div>
      </div>

      {loading ? (
        <h3 style={{ color: "#94a3b8" }}>
          Loading Teams...
        </h3>
      ) : teams.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3>No Teams Found</h3>
          <p>Create your first team.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {teams.map((team) => (
            <div
              key={team._id}
              onClick={() =>
                navigate(`/teams/${team._id}`)
              }
              style={styles.teamCard}
              className="team-card"
            >
              <div style={styles.teamTop}>
                <div style={styles.teamIconBox}>
                  <Users
                    size={22}
                    color="#38bdf8"
                  />
                </div>

                <span style={styles.membersBadge}>
                  {team.members?.length || 0} Members
                </span>
              </div>

              <h3 style={styles.teamName}>
                {team.name}
              </h3>

              <p style={styles.leadText}>
                Lead:
                <strong
                  style={{
                    color: "#fff",
                    marginLeft: "5px",
                  }}
                >
                  {team.leader?.name || "Unknown"}
                </strong>
              </p>

              {team.description && (
                <p style={styles.description}>
                  {team.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    flexWrap: "wrap",
    gap: "20px",
  },

  mainTitle: {
    fontSize: "30px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.02em",
  },

  mainSubtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "6px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  teamCard: {
    background:
      "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    cursor: "pointer",
  },

  teamTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  teamIconBox: {
    width: "44px",
    height: "44px",
    background:
      "rgba(56, 189, 248, 0.12)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(56, 189, 248, 0.3)",
  },

  membersBadge: {
    fontSize: "12px",
    background:
      "rgba(139, 92, 246, 0.12)",
    color: "#c084fc",
    padding: "4px 10px",
    borderRadius: "8px",
    fontWeight: "600",
  },

  teamName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
  },

  leadText: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  description: {
    color: "#cbd5e1",
    fontSize: "13px",
    marginTop: "12px",
    lineHeight: "20px",
  },

  emptyCard: {
    textAlign: "center",
    padding: "50px",
    background:
      "rgba(15, 23, 42, 0.75)",
    borderRadius: "20px",
  },
};

export default TeamList;