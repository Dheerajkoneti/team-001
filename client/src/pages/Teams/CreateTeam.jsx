const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import axios from "axios";

function CreateTeam() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createTeam = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${__DECISIONHUB_API_ORIGIN__}/api/team/create`,
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Team Created Successfully");

      navigate("/teams");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create team"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconBadge}>
            <UserPlus size={22} color="#38bdf8" />
          </div>

          <div>
            <h1 style={styles.title}>
              Create New Team
            </h1>

            <p style={styles.subtitle}>
              Setup a dedicated workspace for your
              team
            </p>
          </div>
        </div>

        <form
          onSubmit={createTeam}
          style={styles.form}
        >
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Team Name
            </label>

            <input
              type="text"
              placeholder="e.g. Smart India Hackathon"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Description
            </label>

            <textarea
              placeholder="Describe your team..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={styles.textarea}
            />
          </div>

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Initialize Team Workspace"}
          </button>
        </form>
      </div>
    </>
  );
}

const styles = {
  card: {
    maxWidth: "650px",
    margin: "40px auto",
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(20px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow:
      "0 25px 50px rgba(0,0,0,0.5)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  },

  iconBadge: {
    width: "45px",
    height: "45px",
    background:
      "rgba(56,189,248,0.12)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(56,189,248,0.3)",
  },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    margin: 0,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "4px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#cbd5e1",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.1)",
    background: "rgba(2,6,23,0.5)",
    color: "#fff",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "14px 16px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.1)",
    background: "rgba(2,6,23,0.5)",
    color: "#fff",
    fontSize: "15px",
    resize: "vertical",
  },

  submitBtn: {
    width: "100%",
    padding: "14px",
    background:
      "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default CreateTeam;