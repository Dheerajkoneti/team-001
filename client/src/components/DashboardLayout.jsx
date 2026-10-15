
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function DashboardLayout() {
  return (
    <div style={styles.layout}>
      <Navbar />

      <main style={styles.mainContent}>
        <div style={styles.innerWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    background: "#030712",
    fontFamily: "'Inter', sans-serif",
    color: "#f8fafc",
    overflowX: "clip",
  },

  mainContent: {
    flex: 1,
    minWidth: 0,
    minHeight: "100vh",
    overflowX: "clip",
  },

  innerWrapper: {
    width: "100%",
    maxWidth: "1400px",
    boxSizing: "border-box",
    padding: "40px",
    paddingBottom: "60px",
    margin: "0 auto",
  },
};

export default DashboardLayout;
