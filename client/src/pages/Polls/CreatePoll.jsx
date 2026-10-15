import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { createPoll } from "../../services/pollService";

function CreatePoll() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", question: "", pollType: "single", visibility: "public", anonymous: false, accessCode: "" });
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const filteredOptions = options.filter((o) => o.trim());
    if (form.pollType !== "rating" && filteredOptions.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }
    setLoading(true);
    try {
      await createPoll({
        ...form,
        options: filteredOptions.map((text) => ({ text })),
      });
      navigate("/polls");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .input-field:focus { border-color: #38bdf8 !important; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); outline: none; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 0 20px rgba(14, 165, 233, 0.4); }
      `}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconBadge}><PlusCircle size={22} color="#38bdf8" /></div>
          <div>
            <h1 style={styles.title}>Create Team Poll</h1>
            <p style={styles.subtitle}>Setup real-time voting options for your squad</p>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Poll Title</label>
            <input className="input-field" style={styles.input} placeholder="e.g. Q4 Tech Stack Decision" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Poll Question</label>
            <input className="input-field" style={styles.input} placeholder="e.g. Which framework should we adopt?" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Poll Type</label>
            <select className="input-field" style={styles.input} value={form.pollType} onChange={(e) => setForm({ ...form, pollType: e.target.value })}>
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
              <option value="rating">Rating (1–5)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Visibility</label>
            <select className="input-field" style={styles.input} value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
              <option value="public">🌐 Public — Anyone can see and vote</option>
              <option value="private">🔒 Private — Restricted access</option>
            </select>
          </div>

          {form.visibility === "private" && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Access Code</label>
              <input className="input-field" style={styles.input} placeholder="e.g. TEAM2024" value={form.accessCode} onChange={(e) => setForm({ ...form, accessCode: e.target.value })} required />
              <p style={{ color: "#64748b", fontSize: "12px", margin: "4px 0 0 0" }}>Share this code with people you want to allow access</p>
            </div>
          )}

          <div style={styles.toggleRow}>
            <div>
              <p style={styles.label}>Anonymous Voting</p>
              <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>Voter identities will be hidden</p>
            </div>
            <div onClick={() => setForm({ ...form, anonymous: !form.anonymous })} style={{ ...styles.toggle, background: form.anonymous ? "#0ea5e9" : "rgba(255,255,255,0.1)" }}>
              <div style={{ ...styles.toggleThumb, transform: form.anonymous ? "translateX(20px)" : "translateX(2px)" }} />
            </div>
          </div>

          {form.pollType !== "rating" && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Voting Options</label>
              {options.map((opt, idx) => (
                <input key={idx} className="input-field" style={{ ...styles.input, marginBottom: "10px" }} placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} />
              ))}
              <button type="button" onClick={() => setOptions([...options, ""])} style={styles.addOptionBtn}>
                + Add Another Option
              </button>
            </div>
          )}

          <button type="submit" className="action-btn" style={styles.submitBtn} disabled={loading}>
            {loading ? "Creating..." : "Launch Poll Now"}
          </button>
        </form>
      </div>
    </>
  );
}

const styles = {
  card: { maxWidth: "700px", margin: "40px auto", background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "40px", borderRadius: "20px", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" },
  header: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" },
  iconBadge: { width: "45px", height: "45px", background: "rgba(56, 189, 248, 0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(56, 189, 248, 0.3)" },
  title: { fontSize: "24px", fontWeight: "800", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { color: "#94a3b8", fontSize: "14px", marginTop: "4px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#cbd5e1" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(2, 6, 23, 0.5)", color: "#fff", fontSize: "15px" },
  addOptionBtn: { background: "transparent", border: "1px dashed rgba(56, 189, 248, 0.4)", color: "#38bdf8", padding: "10px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", marginTop: "4px" },
  toggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(2, 6, 23, 0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px 16px" },
  toggle: { width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer", position: "relative", transition: "background 0.2s ease", flexShrink: 0 },
  toggleThumb: { position: "absolute", top: "2px", width: "20px", height: "20px", background: "#fff", borderRadius: "50%", transition: "transform 0.2s ease" },
  submitBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 20px rgba(14, 165, 233, 0.3)" },
};

export default CreatePoll;
