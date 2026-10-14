const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {
  Users,
  Vote,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  XCircle,
  Check,
  ChevronDown,
  Layers,
  MessageSquare,
  Activity,
  Cpu,
  Lock,
  Globe,
  Code2,
  Share2,
  TrendingUp,
  Award,
  FileText,
  Clock,
  Bell,
  Play,
  Shield,
  Key,
  Database,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Import local video file matching your project structure: client/src/assets/animations/Ultra_modern_SaaS_product_comm.mp4
import demoVideoAsset from "../../assets/animations/Ultra_modern_SaaS_product_comm.mp4";

const LandingPage = () => {
  const navigate = useNavigate();

  const [activeFaq, setActiveFaq] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Public, database-backed figures returned by the Express API.
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalDecisions: 0,
    totalPolls: 0,
    totalVotes: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPublicStats = async () => {
      try {
        const baseUrl = (
          import.meta.env.VITE_API_BASE_URL || `${__DECISIONHUB_API_ORIGIN__}/api`
        ).replace(/\/$/, "");
        const response = await API.get("/public/stats", {
          signal: controller.signal,
        });
        
        const payload = response.data;
        if (!payload.success || !payload.stats) {
          throw new Error("The statistics API returned an unexpected response.");
        }

        setStats((current) => ({ ...current, ...payload.stats }));
        setStatsError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load DecisionHub public statistics:", error);
          setStatsError("Live statistics are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) setStatsLoading(false);
      }
    };

    fetchPublicStats();
    return () => controller.abort();
  }, []);

  const formatCount = (value) =>
    Number.isFinite(Number(value))
      ? new Intl.NumberFormat().format(Number(value))
      : "—";

  // Interactive AI Decision Simulator state
  const [simQuestion, setSimQuestion] = useState("Should our team use React or Angular?");
  const [simResult, setSimResult] = useState({
    pros: ["React has larger ecosystem", "Faster development velocity"],
    cons: ["Angular has steeper learning curve"],
    recommendation: "React (89% confidence)"
  });

  const handleSimulate = (e) => {
    e.preventDefault();
    if (!simQuestion.trim()) return;
    if (simQuestion.toLowerCase().includes("next") || simQuestion.toLowerCase().includes("vite")) {
      setSimResult({
        pros: ["Server-side rendering support", "Exceptional out-of-the-box routing"],
        cons: ["Slightly stricter configuration boundaries"],
        recommendation: "Next.js (92% confidence)"
      });
    } else {
      setSimResult({
        pros: ["Large active community", "Extensive component library availability"],
        cons: ["Requires extra boilerplate state tooling"],
        recommendation: "React Ecosystem (89% confidence)"
      });
    }
  };

  // This is an interactive front-end demonstration, not a persisted poll.
  const handleVote = () => {
    if (hasVoted) return;
    setHasVoted(true);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={styles.page}>
      {/* Global CSS Keyframes & Interactions */}
      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        .interactive-card {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s, box-shadow 0.3s !important;
        }
        .interactive-card:hover {
          transform: translateY(-6px) scale(1.01);
          border-color: rgba(14, 165, 233, 0.5) !important;
          box-shadow: 0 15px 35px -5px rgba(14, 165, 233, 0.15) !important;
        }
        .animated-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
        }
        .animated-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(14, 165, 233, 0.5) !important;
        }
        .animated-btn:active {
          transform: translateY(1px);
        }
        .vote-action-btn {
          transition: all 0.2s ease !important;
        }
        .vote-action-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #0ea5e9, #6366f1) !important;
          transform: scale(1.05);
        }
        .faq-card {
          transition: background 0.2s ease, border-color 0.2s ease !important;
        }
        .faq-card:hover {
          border-color: rgba(99, 102, 241, 0.4) !important;
          background: rgba(15, 23, 42, 0.8) !important;
        }
      `}</style>

      {/* Cinematic Glowing Background Orbs */}
      <div style={styles.glowOrb1}></div>
      <div style={styles.glowOrb2}></div>
      <div style={styles.glowOrb3}></div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBadge}>
            <Zap size={18} color="#38bdf8" />
          </div>
          <h1 style={styles.logo}>DecisionHub</h1>
        </div>

        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#workflow" style={styles.navLink}>Workflow</a>
          <a href="#demo" style={styles.navLink}>Demo</a>
          <a href="#ai" style={styles.navLink}>AI Engine</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
        </div>

        <div style={styles.navActions}>
          <button
            style={styles.loginBtn}
            className="animated-btn"
            onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            style={styles.getStartedBtn}
            className="animated-btn"
            onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <Sparkles size={14} color="#38bdf8" style={{ marginRight: "6px" }} />
            Next-Gen Collaborative Decision Intelligence
          </div>

          <h1 style={styles.heroTitle}>
            Turn Discussions Into <br />
            <span style={styles.gradientText}>Data-Driven Decisions.</span>
          </h1>

          <p style={styles.heroText}>
            One Platform. Every Discussion. Every Vote. Every Decision. Accelerate organizational alignment with AI intelligence.
          </p>

          <div style={styles.heroButtons}>
            <button
              style={styles.primaryBtn}
              className="animated-btn"
              onClick={() => navigate("/register")}>
              Get Started Free <ArrowRight size={18} style={{ marginLeft: "8px" }} />
            </button>
            <button
              style={styles.secondaryBtn}
              className="animated-btn"
              onClick={() =>
                document.getElementById("demo")?.scrollIntoView({
                  behavior: "smooth",
                })
              }>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Active AI Decision Simulator */}
      <section style={styles.simulatorSection}>
        <div style={styles.simulatorWrapper} className="interactive-card">
          <div style={styles.simHeader}>
            <span style={styles.aiBadge}><Cpu size={14} style={{marginRight: '6px'}} /> Live Interactive AI Simulator</span>
            <h2 style={{fontSize: '28px', margin: '15px 0 10px 0'}}>Test Our Decision Engine Right Now</h2>
            <p style={{color: '#94a3b8', fontSize: '15px'}}>Type any complex team question below and watch AI synthesize pros, cons, and confidence scores instantly.</p>
          </div>

          <form onSubmit={handleSimulate} style={styles.simForm}>
            <input
              type="text"
              value={simQuestion}
              onChange={(e) => setSimQuestion(e.target.value)}
              placeholder="e.g. Should we migrate our backend to Go or Node.js?"
              style={styles.simInput}
            />
            <button type="submit" style={styles.simButton} className="animated-btn">
              Simulate AI <Sparkles size={16} style={{marginLeft: '6px'}} />
            </button>
          </form>

          <div style={styles.simResultContainer}>
            <div style={styles.simResultGrid}>
              <div style={styles.simBox}>
                <h4 style={{color: '#38bdf8', marginBottom: '10px'}}>Key Pros</h4>
                <ul style={styles.simList}>
                  {simResult.pros.map((pro, idx) => (
                    <li key={idx}><Check size={14} color="#10b981" style={{marginRight: '6px'}} /> {pro}</li>
                  ))}
                </ul>
              </div>
              <div style={styles.simBox}>
                <h4 style={{color: '#f43f5e', marginBottom: '10px'}}>Key Cons / Risks</h4>
                <ul style={styles.simList}>
                  {simResult.cons.map((con, idx) => (
                    <li key={idx}><XCircle size={14} color="#f43f5e" style={{marginRight: '6px'}} /> {con}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={styles.simRecommendation}>
              <span>AI Recommendation:</span>
              <strong style={{color: '#34d399', fontSize: '18px', marginLeft: '10px'}}>{simResult.recommendation}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section / Social Proof */}
      <section style={styles.trustSection}>
        <p style={styles.trustTitle}>TRUSTED BY HIGH-VELOCITY ENGINEERING & PRODUCT TEAMS</p>
        <div style={styles.trustGrid}>
          <div style={styles.trustItem}>🚀 Fast-Growing Startups</div>
          <div style={styles.trustItem}>🎓 University Student Clubs</div>
          <div style={styles.trustItem}>🌐 Open Source Communities</div>
          <div style={styles.trustItem}>💻 Product & Engineering Squads</div>
        </div>
      </section>

      {/* Embedded Video Section (Automatically Playing local video asset) */}
      <section style={styles.videoSection}>
        <div style={styles.videoWrapper} className="interactive-card">
          <video
            src={demoVideoAsset}
            autoPlay
            loop
            muted
            playsInline
            style={styles.videoPlayer}
          />
          <div style={styles.videoCaptionBadge}>
            <Play size={14} color="#38bdf8" style={{ marginRight: "6px" }} />
            DecisionHub in Action — 90s Product Walkthrough
          </div>
        </div>
      </section>

      {/* Live Statistics: values are fetched from MongoDB through the API. */}
      <section style={styles.stats} aria-live="polite">
        <div style={styles.statCard} className="interactive-card">
          <h2 style={styles.statNumber}>{statsLoading ? "..." : formatCount(stats.totalDecisions)}</h2>
          <p style={styles.statText}>Decisions Created</p>
        </div>
        <div style={styles.statCard} className="interactive-card">
          <h2 style={styles.statNumber}>{statsLoading ? "..." : formatCount(stats.totalTeams)}</h2>
          <p style={styles.statText}>Teams Created</p>
        </div>
        <div style={styles.statCard} className="interactive-card">
          <h2 style={styles.statNumber}>{statsLoading ? "..." : stats.totalVotes == null ? "—" : formatCount(stats.totalVotes)}</h2>
          <p style={styles.statText}>Votes Submitted</p>
        </div>
        <div style={styles.statCard} className="interactive-card">
          <h2 style={styles.statNumber}>{statsLoading ? "..." : formatCount(stats.totalUsers)}</h2>
          <p style={styles.statText}>Registered Users</p>
        </div>
        {statsError && <p style={{ ...styles.statText, gridColumn: "1 / -1" }}>{statsError}</p>}
      </section>

      {/* Problem vs Solution */}
      <section style={styles.pvpSection}>
        <h2 style={styles.sectionTitle}>The Traditional Way vs <span style={styles.gradientText}>DecisionHub</span></h2>
        <div style={styles.pvpGrid}>
          <div style={styles.badCard} className="interactive-card">
            <h3 style={{color: '#f43f5e', marginBottom: '20px'}}>Before DecisionHub</h3>
            <ul style={styles.pvpList}>
              <li><XCircle size={18} color="#f43f5e" /> Endless unmanaged meetings</li>
              <li><XCircle size={18} color="#f43f5e" /> Unclear final decisions & ownership</li>
              <li><XCircle size={18} color="#f43f5e" /> Lost context across chat threads</li>
              <li><XCircle size={18} color="#f43f5e" /> No transparent voting mechanism</li>
            </ul>
          </div>
          <div style={styles.goodCard} className="interactive-card">
            <h3 style={{color: '#10b981', marginBottom: '20px'}}>With DecisionHub</h3>
            <ul style={styles.pvpList}>
              <li><Check size={18} color="#10b981" /> Structured asynchronous discussions</li>
              <li><Check size={18} color="#10b981" /> Transparent, auditable voting systems</li>
              <li><Check size={18} color="#10b981" /> Real-time team collaboration hubs</li>
              <li><Check size={18} color="#10b981" /> Analytics-driven consensus tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Decision Workflow Visualization */}
      <section id="workflow" style={styles.workflowSection}>
        <h2 style={styles.sectionTitle}>Decision Lifecycle Workflow</h2>
        <p style={styles.sectionSubtitle}>A foolproof step-by-step framework from raw spark to execution.</p>
        <div style={styles.workflowFlow}>
          <div style={styles.workflowNode}>Idea</div>
          <div style={styles.workflowArrow}>↓</div>
          <div style={styles.workflowNode}>Discussion</div>
          <div style={styles.workflowArrow}>↓</div>
          <div style={styles.workflowNode}>Voting</div>
          <div style={styles.workflowArrow}>↓</div>
          <div style={styles.workflowNode}>AI Analysis</div>
          <div style={styles.workflowArrow}>↓</div>
          <div style={styles.workflowNodeActive}>Decision ✅</div>
          <div style={styles.workflowArrow}>↓</div>
          <div style={styles.workflowNode}>Execution</div>
          <div style={styles.workflowArrow}>↓</div>
          <div style={styles.workflowNode}>Tracking</div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" style={styles.features}>
        <h2 style={styles.sectionTitle}>Engineered for High-Velocity Teams</h2>
        <p style={styles.sectionSubtitle}>Everything you need to transform how your organization evaluates options and aligns.</p>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><Users size={24} color="#38bdf8" /></div>
            <h3>Team Management</h3>
            <p>Create and segment members into custom organizational pods and workspaces.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><FileText size={24} color="#818cf8" /></div>
            <h3>Decision Creation</h3>
            <p>Draft deep proposals with background documents, attachments, and milestones.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><Vote size={24} color="#38bdf8" /></div>
            <h3>Smart Voting</h3>
            <p>Choose between confidential anonymous ballots or open transparent polling.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><Activity size={24} color="#ec4899" /></div>
            <h3>Real-Time Results</h3>
            <p>Watch ballots tally live with instantaneous websocket synchronization.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><BarChart3 size={24} color="#3b82f6" /></div>
            <h3>Analytics Dashboard</h3>
            <p>Track team participation rates, consensus scores, and historical velocity.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><Bell size={24} color="#10b981" /></div>
            <h3>Instant Notifications</h3>
            <p>Receive updates about activity and voting events in your workspace.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><ShieldCheck size={24} color="#f59e0b" /></div>
            <h3>Role Management</h3>
            <p>Manage access according to the roles and permissions configured in your application.</p>
          </div>
          <div style={styles.featureCard} className="interactive-card">
            <div style={styles.iconWrapper}><Clock size={24} color="#38bdf8" /></div>
            <h3>History Tracking</h3>
            <p>Audit and access past institutional decisions and archives anytime.</p>
          </div>
        </div>
      </section>

      {/* Decision Templates Section */}
      <section style={styles.templatesSection}>
        <h2 style={styles.sectionTitle}>Ready-Made Decision Templates</h2>
        <p style={styles.sectionSubtitle}>Jumpstart your team governance in 1 click with pre-structured proposal layouts.</p>
        <div style={styles.templateGrid}>
          {["Product Launch Decision", "Hiring Decision", "Budget Approval", "Feature Prioritization", "Team Voting Poll", "Sprint Planning"].map((tmpl, idx) => (
            <div key={idx} style={styles.templateCard} className="interactive-card">
              <FileText size={22} color="#38bdf8" style={{marginBottom: '10px'}} />
              <h4 style={{fontSize: '16px', fontWeight: '600'}}>{tmpl}</h4>
              <p style={{fontSize: '13px', color: '#94a3b8', marginTop: '6px'}}>Pre-configured framework with voting milestones and scoring rubrics.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Voting Demo */}
      <section id="demo" style={styles.liveDemo}>
        <h2 style={styles.sectionTitle}>Interactive Live Voting Demo</h2>
        <p style={styles.sectionSubtitle}>Preview the interface only. These demo buttons do not save votes to your database.</p>
        
        <div style={styles.demoCard} className="interactive-card">
          <h3 style={{marginBottom: '15px'}}>Which Frontend Framework should we adopt for the core dashboard?</h3>
          <div style={styles.demoOptions}>
            <div style={styles.demoOptionRow}>
              <span>React ecosystem</span>
              <div style={styles.demoButtonRow}>
                <span style={{fontWeight: 'bold', color: '#38bdf8'}}>Demo option</span>
                <button style={styles.voteBtn} className="vote-action-btn" onClick={handleVote} disabled={hasVoted}>Vote React</button>
              </div>
            </div>
            <div style={styles.demoOptionRow}>
              <span>Next.js fullstack architecture</span>
              <div style={styles.demoButtonRow}>
                <span style={{fontWeight: 'bold', color: '#818cf8'}}>Demo option</span>
                <button style={styles.voteBtn} className="vote-action-btn" onClick={handleVote} disabled={hasVoted}>Vote Next.js</button>
              </div>
            </div>
          </div>
          <div style={styles.demoStatusBox}>
            <span>Status: <strong style={{color: '#10b981'}}>Approved ✅</strong></span>
            {hasVoted && <span style={{fontSize: '13px', color: '#38bdf8'}}>Demo selection recorded in this page only.</span>}
          </div>
        </div>
      </section>

      {/* Team Consensus Meter Section */}
      <section style={styles.consensusSection}>
        <div style={styles.consensusContainer} className="interactive-card">
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <span style={styles.aiBadge}>UI Preview</span>
            <h2 style={{fontSize: '32px', margin: '15px 0 10px 0'}}>Team Consensus Meter</h2>
            <p style={{color: '#94a3b8'}}>Illustrative layout only. Connect this component to vote-level analytics before displaying real consensus scores.</p>
          </div>

          <div style={styles.consensusGrid}>
            <div style={styles.consensusCardItem}>
              <h4>Marketing Pod</h4>
              <div style={styles.consensusBarBg}><div style={{...styles.consensusBarFill, width: '92%', background: '#38bdf8'}}></div></div>
              <span>92% Aligned</span>
            </div>
            <div style={styles.consensusCardItem}>
              <h4>Development Squad</h4>
              <div style={styles.consensusBarBg}><div style={{...styles.consensusBarFill, width: '81%', background: '#10b981'}}></div></div>
              <span>81% Aligned</span>
            </div>
            <div style={styles.consensusCardItem}>
              <h4>Management Group</h4>
              <div style={styles.consensusBarBg}><div style={{...styles.consensusBarFill, width: '88%', background: '#8b5cf6'}}></div></div>
              <span>88% Aligned</span>
            </div>
          </div>

          <div style={styles.overallConsensusBox}>
            <div>
              <h3 style={{fontSize: '20px'}}>Overall Organization Consensus Score</h3>
              <p style={{color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0'}}>Calculated dynamically using weighted cross-departmental polling weights.</p>
            </div>
            <div style={styles.consensusBigCircle}>Demo</div>
          </div>
        </div>
      </section>

      {/* AI Feature Section & Meeting Summarizer */}
      <section id="ai" style={styles.aiSection}>
        <div style={styles.aiContainer} className="interactive-card">
          <div style={styles.aiHeader}>
            <span style={styles.aiBadge}><Cpu size={14} style={{marginRight: '6px'}} /> Powered by AI</span>
            <h2 style={{fontSize: '32px', margin: '15px 0 10px 0'}}>AI Decision Assistant & Coach</h2>
            <p style={{color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>Let state-of-the-art models streamline your organizational alignment.</p>
          </div>

          <div style={styles.aiGrid}>
            <div style={styles.aiCard}>
              <Sparkles size={20} color="#38bdf8" style={{marginBottom: '10px'}} />
              <h4>AI Meeting Summary</h4>
              <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '10px'}}>128 comments analyzed by LLM pipeline.</p>
              <ul style={{fontSize: '13px', color: '#cbd5e1', paddingLeft: '15px', margin: 0}}>
                <li>Team strongly prefers React</li>
                <li>Budget remains within limits</li>
                <li>Q4 release target confirmed</li>
              </ul>
            </div>
            <div style={styles.aiCard}>
              <Zap size={20} color="#818cf8" style={{marginBottom: '10px'}} />
              <h4>AI Decision Coach</h4>
              <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '10px'}}>Proactive risk assessment checks:</p>
              <ul style={{fontSize: '13px', color: '#cbd5e1', paddingLeft: '15px', margin: 0}}>
                <li>Budget Overrun Risk: <strong style={{color: '#f59e0b'}}>Medium</strong></li>
                <li>Stakeholder Conflict: <strong style={{color: '#10b981'}}>Low</strong></li>
                <li>Implementation Complexity: <strong style={{color: '#f43f5e'}}>High</strong></li>
              </ul>
            </div>
            <div style={styles.aiCard}>
              <ShieldCheck size={20} color="#ec4899" style={{marginBottom: '10px'}} />
              <h4>Highlights Pros & Cons</h4>
              <p>Automatically surfaces architectural risks, legal trade-offs, and downstream tech debt impacts.</p>
            </div>
            <div style={styles.aiCard}>
              <TrendingUp size={20} color="#10b981" style={{marginBottom: '10px'}} />
              <h4>Predicts Outcomes</h4>
              <p>Forecasts team agreement probability prior to formal ballot closing dates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Decision Predictor */}
      <section style={styles.predictorSection}>
        <div style={styles.predictorBox} className="interactive-card">
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
            <div style={styles.badgePulse}></div>
            <span style={{color: '#38bdf8', fontWeight: '700', fontSize: '14px'}}>WOW FEATURE: AI DECISION PREDICTOR</span>
          </div>
          <h3 style={{fontSize: '26px', marginBottom: '15px'}}>Predicting outcome before voting closes...</h3>
          <p style={{color: '#94a3b8', fontSize: '15px', marginBottom: '25px'}}>Our proprietary simulation engine models live participation trends to forecast final consensus.</p>
          
          <div style={styles.predictorStatsGrid}>
            <div style={styles.predictorStatItem}>
              <span>Predicted Winner</span>
              <strong style={{color: '#34d399', fontSize: '20px'}}>React (87% Win Probability)</strong>
            </div>
            <div style={styles.predictorStatItem}>
              <span>Expected Final Tally</span>
              <div style={{fontSize: '14px', color: '#cbd5e1', marginTop: '5px'}}>React: 68% | Next.js: 32%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Preview: actual totals, not fabricated percentages. */}
      <section style={styles.analyticsSection}>
        <h2 style={styles.sectionTitle}>DecisionHub at a Glance</h2>
        <p style={styles.sectionSubtitle}>Live totals loaded from the DecisionHub backend.</p>
        <div style={styles.analyticsGrid}>
          <div style={styles.analyticsCard} className="interactive-card">
            <p style={styles.analyticsLabel}>Registered Users</p>
            <h3 style={styles.analyticsVal}>{statsLoading ? "..." : formatCount(stats.totalUsers)}</h3>
          </div>
          <div style={styles.analyticsCard} className="interactive-card">
            <p style={styles.analyticsLabel}>Total Polls</p>
            <h3 style={styles.analyticsVal}>{statsLoading ? "..." : formatCount(stats.totalPolls)}</h3>
          </div>
          <div style={styles.analyticsCard} className="interactive-card">
            <p style={styles.analyticsLabel}>Total Teams</p>
            <h3 style={styles.analyticsVal}>{statsLoading ? "..." : formatCount(stats.totalTeams)}</h3>
          </div>
          <div style={styles.analyticsCard} className="interactive-card">
            <p style={styles.analyticsLabel}>Total Votes</p>
            <h3 style={styles.analyticsVal}>{statsLoading ? "..." : stats.totalVotes == null ? "—" : formatCount(stats.totalVotes)}</h3>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section style={styles.integrationsSection}>
        <h2 style={styles.sectionTitle}>Seamless Integrations</h2>
        <p style={styles.sectionSubtitle}>Connect DecisionHub directly into your organization's daily communication workflow.</p>
        <div style={styles.integrationGrid}>
          {["Slack", "Microsoft Teams", "Discord", "Google Workspace", "Notion", "GitHub", "Jira", "Trello"].map((tool, idx) => (
            <div key={idx} style={styles.integrationBadge} className="interactive-card">
              <Globe size={18} color="#38bdf8" />
              <span style={{fontWeight: '600', fontSize: '14px'}}>{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section style={styles.securitySection}>
        <h2 style={styles.sectionTitle}>Enterprise-Grade Security</h2>
        <p style={styles.sectionSubtitle}>Built from the ground up for strict corporate compliance and data privacy.</p>
        <div style={styles.securityGrid}>
          {[
            { title: "End-to-End Encryption", desc: "All ballots and sensitive votes are encrypted at rest and in transit.", icon: <Lock size={22} color="#38bdf8" /> },
            { title: "Role Based Access", desc: "Fine-grained permissions for Admins, Team Leads, and Contributors.", icon: <Shield size={22} color="#10b981" /> },
            { title: "Multi Team Workspaces", desc: "Isolate departments securely into separate administrative boundaries.", icon: <Users size={22} color="#8b5cf6" /> },
            { title: "Audit Logs", desc: "Immutable chronological logs tracking every single proposal and vote.", icon: <FileText size={22} color="#f59e0b" /> },
            { title: "Cloud Backup", desc: "Automated redundant snapshots ensuring zero data loss.", icon: <Database size={22} color="#ec4899" /> },
            { title: "OAuth Authentication", desc: "Secure SSO integration with Google, GitHub, and enterprise providers.", icon: <Key size={22} color="#38bdf8" /> }
          ].map((sec, idx) => (
            <div key={idx} style={styles.securityCard} className="interactive-card">
              <div style={{marginBottom: '12px'}}>{sec.icon}</div>
              <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '6px'}}>{sec.title}</h4>
              <p style={{fontSize: '13px', color: '#94a3b8', lineHeight: '1.4'}}>{sec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section style={styles.comparisonSection}>
        <h2 style={styles.sectionTitle}>How We Compare</h2>
        <p style={styles.sectionSubtitle}>Why top engineering teams choose DecisionHub over legacy tools.</p>
        
        <div style={styles.tableWrapper}>
          <table style={styles.compTable}>
            <thead>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <th style={{textAlign: 'left', padding: '15px'}}>Feature</th>
                <th style={{padding: '15px', color: '#38bdf8'}}>DecisionHub</th>
                <th style={{padding: '15px', color: '#94a3b8'}}>Google Forms</th>
                <th style={{padding: '15px', color: '#94a3b8'}}>WhatsApp</th>
                <th style={{padding: '15px', color: '#94a3b8'}}>Excel</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding: '15px', fontWeight: '500'}}>Voting System</td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
              </tr>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding: '15px', fontWeight: '500'}}>AI Insights</td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
              </tr>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding: '15px', fontWeight: '500'}}>Team Discussions</td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
              </tr>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding: '15px', fontWeight: '500'}}>Consensus Score</td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
              </tr>
              <tr>
                <td style={{padding: '15px', fontWeight: '500'}}>Analytics Dashboard</td>
                <td style={{textAlign: 'center', padding: '15px'}}><Check color="#10b981" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px', color: '#f59e0b', fontSize: '13px'}}>Limited</td>
                <td style={{textAlign: 'center', padding: '15px'}}><XCircle color="#f43f5e" size={18} /></td>
                <td style={{textAlign: 'center', padding: '15px', color: '#f59e0b', fontSize: '13px'}}>Limited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Sample testimonials: replace with real, permissioned customer feedback before launch. */}
      <section style={styles.testimonials}>
        <h2 style={styles.sectionTitle}>Example User Feedback</h2>
        <p style={styles.sectionSubtitle}>Sample copy for the design preview; not verified customer testimonials.</p>
        <div style={styles.testiGrid}>
          <div style={styles.testiCard} className="interactive-card">
            <p style={styles.testiText}>"DecisionHub reduced our weekly sync meeting time by 40%. The voting workflows are an absolute game changer."</p>
            <div style={styles.testiAuthor}>
              <strong>Sarah Jenkins</strong>
              <span>Product Manager, TechCorp</span>
            </div>
          </div>
          <div style={styles.testiCard} className="interactive-card">
            <p style={styles.testiText}>"Now every single team member has an equal voice, regardless of seniority. Complete transparency."</p>
            <div style={styles.testiAuthor}>
              <strong>Marcus Vance</strong>
              <span>Engineering Lead, Nexus Labs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricingSection}>
        <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
        <div style={styles.pricingGrid}>
          <div style={styles.pricingCard} className="interactive-card">
            <h3>Free</h3>
            <div style={styles.priceTag}>$0 <span style={{fontSize: '14px', color: '#94a3b8'}}>/forever</span></div>
            <ul style={styles.priceList}>
              <li><Check size={16} color="#10b981" /> 5 Teams Included</li>
              <li><Check size={16} color="#10b981" /> Up to 50 Decisions</li>
              <li><Check size={16} color="#10b981" /> Basic Voting Polls</li>
            </ul>
            <button
              style={styles.secondaryBtnWide}
              className="animated-btn"
              onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>

          <div style={styles.pricingCardPro} className="interactive-card">
            <div style={styles.proBadge}>Most Popular</div>
            <h3>Pro</h3>
            <div style={styles.priceTag}>$19 <span style={{fontSize: '14px', color: '#94a3b8'}}>/month</span></div>
            <ul style={styles.priceList}>
              <li><Check size={16} color="#38bdf8" /> Unlimited Teams</li>
              <li><Check size={16} color="#38bdf8" /> AI Decision Insights & Summaries</li>
              <li><Check size={16} color="#38bdf8" /> Advanced Analytics & Reports</li>
              <li><Check size={16} color="#38bdf8" /> Priority Support</li>
            </ul>
            <button
              style={styles.primaryBtnWide}
              className="animated-btn"
              onClick={() => navigate("/register")}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqContainer}>
          {[
            { q: "Is DecisionHub free to use?", a: "Yes, our core tier is completely free for individual teams and small startups." },
            { q: "Can I create multiple teams?", a: "Yes, you can create and manage multiple specialized pods and workspaces." },
            { q: "Are votes confidential?", a: "You can configure each decision poll to be either completely anonymous or transparent." },
            { q: "Can I export voting results?", a: "Yes, reports can be exported instantly into PDF or CSV formats." }
          ].map((item, idx) => (
            <div key={idx} style={styles.faqItem} className="faq-card" onClick={() => toggleFaq(idx)}>
              <div style={styles.faqQuestion}>
                <span>{item.q}</span>
                <ChevronDown size={18} style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </div>
              {activeFaq === idx && <div style={styles.faqAnswer}>{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCta}>
        <div style={styles.finalCtaBox} className="interactive-card">
          <h2>Ready to Make Better Decisions?</h2>
          <p style={{color: '#94a3b8', margin: '15px 0 25px 0'}}>Join innovative teams accelerating alignment today.</p>
          <button
            style={styles.primaryBtn}
            className="animated-btn"
            onClick={() => navigate("/register")}>
            Start Building Teams <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </section>

      {/* Modern Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <h4 style={{color: '#fff', marginBottom: '15px'}}>DecisionHub</h4>
            <p style={{color: '#64748b', fontSize: '14px', lineHeight: '1.5'}}>Empowering modern engineering and product teams to reach consensus smoothly.</p>
          </div>
          <div>
            <h5 style={styles.footerHeading}>Product</h5>
            <ul style={styles.footerList}>
              <li><a href="#features" style={styles.footerLink}>Features</a></li>
              <li><a href="#pricing" style={styles.footerLink}>Pricing</a></li>
              <li><a href="#demo" style={styles.footerLink}>Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h5 style={styles.footerHeading}>Resources</h5>
            <ul style={styles.footerList}>
              <li><a href="#faq" style={styles.footerLink}>Documentation</a></li>
              <li><a href="#api" style={styles.footerLink}>API Reference</a></li>
            </ul>
          </div>
          <div>
            <h5 style={styles.footerHeading}>Company</h5>
            <ul style={styles.footerList}>
              <li><a href="#about" style={styles.footerLink}>About</a></li>
              <li><a href="#contact" style={styles.footerLink}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 style={styles.footerHeading}>Social</h5>
            <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
              <Code2 size={20} color="#94a3b8" style={{cursor: 'pointer'}} title="GitHub" />
              <Share2 size={20} color="#94a3b8" style={{cursor: 'pointer'}} title="Socials" />
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 DecisionHub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Styles Object with Electric Cyan & Violet Theme + Video styling
const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    background: "#030712",
    color: "#f8fafc",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },
  glowOrb1: {
    position: "absolute",
    top: "-150px",
    left: "10%",
    width: "450px",
    height: "450px",
    background: "rgba(14, 165, 233, 0.14)",
    filter: "blur(140px)",
    borderRadius: "50%",
    zIndex: 0,
    pointerEvents: "none",
  },
  glowOrb2: {
    position: "absolute",
    top: "350px",
    right: "8%",
    width: "550px",
    height: "550px",
    background: "rgba(139, 92, 246, 0.12)",
    filter: "blur(160px)",
    borderRadius: "50%",
    zIndex: 0,
    pointerEvents: "none",
  },
  glowOrb3: {
    position: "absolute",
    top: "1400px",
    left: "15%",
    width: "500px",
    height: "500px",
    background: "rgba(16, 185, 129, 0.1)",
    filter: "blur(150px)",
    borderRadius: "50%",
    zIndex: 0,
    pointerEvents: "none",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 60px",
    background: "rgba(3, 7, 18, 0.8)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoBadge: {
    width: "32px",
    height: "32px",
    background: "rgba(56, 189, 248, 0.1)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(56, 189, 248, 0.3)",
  },
  logo: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navLinks: {
    display: "flex",
    gap: "30px",
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  navActions: {
    display: "flex",
    gap: "12px",
  },
  loginBtn: {
    padding: "8px 18px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "transparent",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },
  getStartedBtn: {
    padding: "8px 18px",
    border: "none",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)",
  },
  hero: {
    textAlign: "center",
    padding: "80px 20px 30px 20px",
    position: "relative",
    zIndex: 1,
  },
  heroContent: {
    maxWidth: "850px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    color: "#38bdf8",
    marginBottom: "20px",
    fontWeight: "500",
  },
  heroTitle: {
    fontSize: "58px",
    fontWeight: "800",
    lineHeight: "1.1",
    marginBottom: "20px",
    letterSpacing: "-0.03em",
  },
  gradientText: {
    background: "linear-gradient(135deg, #38bdf8 15%, #8b5cf6 60%, #ec4899 90%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroText: {
    color: "#94a3b8",
    fontSize: "19px",
    lineHeight: "1.6",
    maxWidth: "680px",
    margin: "0 auto 35px auto",
  },
  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "14px 28px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)",
  },
  secondaryBtn: {
    padding: "14px 28px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  simulatorSection: {
    padding: "40px 20px 60px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  simulatorWrapper: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(14, 165, 233, 0.35)",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 0 40px rgba(14, 165, 233, 0.15)",
  },
  simHeader: {
    textAlign: "center",
    marginBottom: "25px",
  },
  aiBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.4)",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#c084fc",
    fontWeight: "600",
  },
  simForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },
  simInput: {
    flex: 1,
    background: "rgba(2, 6, 23, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    padding: "12px 16px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  simButton: {
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    border: "none",
    padding: "0 20px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  simResultContainer: {
    background: "rgba(2, 6, 23, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "20px",
  },
  simResultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  simBox: {
    background: "rgba(255, 255, 255, 0.02)",
    padding: "15px",
    borderRadius: "10px",
  },
  simList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "14px",
    color: "#cbd5e1",
  },
  simRecommendation: {
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trustSection: {
    textAlign: "center",
    padding: "40px 20px",
    position: "relative",
    zIndex: 1,
  },
  trustTitle: {
    fontSize: "12px",
    letterSpacing: "0.1em",
    color: "#64748b",
    fontWeight: "700",
    marginBottom: "20px",
  },
  trustGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "600",
  },
  trustItem: {
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "10px 20px",
    borderRadius: "10px",
  },
  videoSection: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    height: "450px",
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(14, 165, 233, 0.4)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  videoCaptionBadge: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    background: "rgba(3, 7, 18, 0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(14, 165, 233, 0.3)",
    padding: "8px 16px",
    borderRadius: "30px",
    fontSize: "13px",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "60px auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 1,
  },
  statCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    textAlign: "center",
    padding: "30px",
    borderRadius: "16px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "5px",
  },
  statText: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
  },
  pvpSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "38px",
    fontWeight: "800",
    marginBottom: "15px",
    letterSpacing: "-0.02em",
  },
  sectionSubtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "16px",
    marginBottom: "50px",
  },
  pvpGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  badCard: {
    background: "rgba(244, 63, 94, 0.03)",
    border: "1px solid rgba(244, 63, 94, 0.2)",
    borderRadius: "16px",
    padding: "35px",
  },
  goodCard: {
    background: "rgba(16, 185, 129, 0.04)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    borderRadius: "16px",
    padding: "35px",
  },
  pvpList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    color: "#cbd5e1",
    fontSize: "15px",
  },
  workflowSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  workflowFlow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  workflowNode: {
    width: "100%",
    background: "rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "14px",
    borderRadius: "10px",
    fontWeight: "600",
    color: "#cbd5e1",
  },
  workflowNodeActive: {
    width: "100%",
    background: "rgba(14, 165, 233, 0.15)",
    border: "1px solid rgba(14, 165, 233, 0.4)",
    padding: "14px",
    borderRadius: "10px",
    fontWeight: "700",
    color: "#38bdf8",
  },
  workflowArrow: {
    color: "#64748b",
    fontSize: "18px",
  },
  features: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  featureCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "30px 24px",
    borderRadius: "16px",
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "18px",
  },
  templatesSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  templateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  templateCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "25px",
    borderRadius: "16px",
  },
  liveDemo: {
    padding: "80px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  demoCard: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(14, 165, 233, 0.3)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "left",
    boxShadow: "0 0 40px rgba(14, 165, 233, 0.15)",
  },
  demoOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    margin: "25px 0",
  },
  demoOptionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "15px 20px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  demoButtonRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  voteBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  demoStatusBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: "15px",
    marginTop: "20px",
  },
  consensusSection: {
    padding: "80px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  consensusContainer: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(139, 92, 246, 0.35)",
    padding: "50px 40px",
    borderRadius: "24px",
    boxShadow: "0 0 50px rgba(139, 92, 246, 0.15)",
  },
  consensusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  consensusCardItem: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "20px",
    borderRadius: "12px",
  },
  consensusBarBg: {
    width: "100%",
    height: "8px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "4px",
    margin: "12px 0 8px 0",
    overflow: "hidden",
  },
  consensusBarFill: {
    height: "100%",
    borderRadius: "4px",
  },
  overallConsensusBox: {
    background: "rgba(2, 6, 23, 0.6)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    padding: "20px 25px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consensusBigCircle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#c084fc",
  },
  aiSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  aiContainer: {
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(49, 46, 129, 0.4))",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(139, 92, 246, 0.35)",
    padding: "50px 40px",
    borderRadius: "24px",
    boxShadow: "0 0 50px rgba(139, 92, 246, 0.15)",
  },
  aiHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  aiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  aiCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "24px",
    borderRadius: "14px",
  },
  predictorSection: {
    padding: "60px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  predictorBox: {
    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1))",
    border: "1px solid rgba(14, 165, 233, 0.4)",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 0 40px rgba(14, 165, 233, 0.15)",
  },
  badgePulse: {
    width: "10px",
    height: "10px",
    background: "#38bdf8",
    borderRadius: "50%",
    boxShadow: "0 0 10px #38bdf8",
  },
  predictorStatsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },
  predictorStatItem: {
    background: "rgba(2, 6, 23, 0.5)",
    padding: "15px 20px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  analyticsSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  analyticsCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
  },
  analyticsLabel: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "10px",
  },
  analyticsVal: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#38bdf8",
    margin: 0,
  },
  integrationsSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  integrationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "40px",
  },
  integrationBadge: {
    background: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "18px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  securitySection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  securityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  securityCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "30px",
    borderRadius: "16px",
  },
  comparisonSection: {
    padding: "80px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  tableWrapper: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "40px",
  },
  compTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    textAlign: "left",
  },
  testimonials: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  testiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  testiCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "35px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  testiText: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#cbd5e1",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  testiAuthor: {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
  },
  pricingSection: {
    padding: "80px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  pricingCard: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "40px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
  },
  pricingCardPro: {
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(49, 46, 129, 0.5))",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(14, 165, 233, 0.4)",
    padding: "40px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    boxShadow: "0 0 35px rgba(14, 165, 233, 0.15)",
  },
  proBadge: {
    position: "absolute",
    top: "-12px",
    right: "30px",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "10px",
  },
  priceTag: {
    fontSize: "36px",
    fontWeight: "800",
    margin: "15px 0 25px 0",
  },
  priceList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 30px 0",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    color: "#cbd5e1",
    fontSize: "14px",
    flex: 1,
  },
  secondaryBtnWide: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "transparent",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  primaryBtnWide: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)",
  },
  faqSection: {
    padding: "80px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  faqContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  faqItem: {
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
  },
  faqQuestion: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    fontSize: "16px",
  },
  faqAnswer: {
    marginTop: "12px",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.5",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    paddingTop: "12px",
  },
  finalCta: {
    padding: "100px 20px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  finalCtaBox: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(49, 46, 129, 0.7))",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(14, 165, 233, 0.35)",
    padding: "60px 40px",
    borderRadius: "24px",
    boxShadow: "0 0 50px rgba(14, 165, 233, 0.2)",
  },
  footer: {
    background: "#030712",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "60px 60px 30px 60px",
    position: "relative",
    zIndex: 1,
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    gap: "40px",
    maxWidth: "1100px",
    margin: "0 auto 40px auto",
  },
  footerHeading: {
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "15px",
  },
  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "14px",
  },
  footerBottom: {
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "25px",
    color: "#64748b",
    fontSize: "14px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
};

export default LandingPage;
