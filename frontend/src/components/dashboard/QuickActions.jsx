"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

const contacts = [
  {
    number: "112",
    title: "National Emergency",
    description: "Police, fire & medical emergency",
  },
  {
    number: "108",
    title: "Ambulance",
    description: "Emergency medical assistance",
  },
  {
    number: "101",
    title: "Fire & Rescue",
    description: "Fire and rescue services",
  },
  {
    number: "100",
    title: "Police",
    description: "Police emergency assistance",
  },
  {
    number: "1070",
    title: "Disaster Management",
    description: "State disaster management helpline",
  },
];

const websites = [
  {
    name: "National Disaster Management Authority",
    description: "Government disaster management portal",
    url: "https://ndma.gov.in/",
  },
  {
    name: "National Disaster Response Force",
    description: "Disaster response and rescue services",
    url: "https://ndrf.gov.in/",
  },
];

export default function QuickActions() {
  const router = useRouter();
  const [showEmergency, setShowEmergency] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showEmergency) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowEmergency(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Prevent dashboard from scrolling behind popup
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showEmergency]);

  const emergencyModal =
    showEmergency && mounted
      ? createPortal(
          <div
            style={styles.overlay}
            onClick={() => setShowEmergency(false)}
          >
            <div
              style={styles.modal}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setShowEmergency(false)}
                style={styles.closeButton}
                aria-label="Close emergency contacts"
              >
                ×
              </button>

              {/* Header */}
              <div style={styles.header}>
                <div style={styles.headerIcon}>🚨</div>

                <div>
                  <h2 style={styles.title}>
                    Emergency Contacts
                  </h2>

                  <p style={styles.subtitle}>
                    Important helpline numbers for immediate assistance.
                  </p>
                </div>
              </div>

              {/* Helplines */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  📞 Helpline Numbers
                </div>

                <div style={styles.contactList}>
                  {contacts.map((contact) => (
                    <div
                      key={contact.number}
                      style={styles.contact}
                    >
                      <div style={styles.contactLeft}>
                        <div style={styles.number}>
                          {contact.number}
                        </div>

                        <div>
                          <div style={styles.contactTitle}>
                            {contact.title}
                          </div>

                          <div style={styles.description}>
                            {contact.description}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`tel:${contact.number}`}
                        style={styles.callButton}
                      >
                        📞 CALL
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Websites */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  🌐 Official Websites
                </div>

                <div style={styles.websiteList}>
                  {websites.map((website) => (
                    <a
                      key={website.name}
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.website}
                    >
                      <div>
                        <div style={styles.websiteTitle}>
                          {website.name}
                        </div>

                        <div style={styles.description}>
                          {website.description}
                        </div>
                      </div>

                      <span style={styles.arrow}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h3>📌 Quick Actions</h3>
        </div>

        <div className="actions">

          <button
            className="action a-blue"
            onClick={() => router.push("/check-location")}
          >
            🔎 Check Location Risk
            <br />
            <small>Search an area and view risk</small>
          </button>

          <button
            className="action a-green"
            onClick={() => router.push("/risk-map")}
          >
            🗺️ View Full Map
            <br />
            <small>Explore risk zones</small>
          </button>

          <button
            className="action a-red"
            onClick={() => setShowEmergency(true)}
          >
            ☎️ Emergency Contacts
            <br />
            <small>Get help and helpline numbers</small>
          </button>

        </div>
      </div>

      {emergencyModal}
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 999999,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "24px",

    background: "rgba(10, 20, 15, 0.48)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  modal: {
    position: "relative",

    width: "min(620px, 100%)",
    maxHeight: "88vh",

    overflowY: "auto",

    padding: "28px",

    borderRadius: "24px",

    background:
      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(244,250,247,0.91))",

    border: "1px solid rgba(255,255,255,0.85)",

    boxShadow:
      "0 30px 80px rgba(20, 40, 30, 0.28), inset 0 1px 0 rgba(255,255,255,0.9)",

    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },

  closeButton: {
    position: "absolute",
    top: "18px",
    right: "18px",

    width: "36px",
    height: "36px",

    border: "1px solid rgba(23,32,51,0.08)",
    borderRadius: "50%",

    background: "rgba(255,255,255,0.7)",
    color: "#687386",

    fontSize: "24px",
    lineHeight: "30px",

    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",

    paddingRight: "45px",
    marginBottom: "25px",
  },

  headerIcon: {
    width: "54px",
    height: "54px",

    flexShrink: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "16px",

    background: "rgba(239,68,68,0.10)",

    fontSize: "25px",
  },

  title: {
    margin: 0,

    color: "#172033",

    fontSize: "22px",
    fontWeight: 750,
  },

  subtitle: {
    margin: "5px 0 0",

    color: "#687386",

    fontSize: "13px",
  },

  section: {
    marginTop: "20px",
  },

  sectionTitle: {
    marginBottom: "11px",

    color: "#172033",

    fontSize: "14px",
    fontWeight: 750,
  },

  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  contact: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    gap: "15px",

    padding: "12px 13px",

    borderRadius: "15px",

    background: "rgba(255,255,255,0.66)",

    border: "1px solid rgba(230,236,232,0.95)",

    boxShadow: "0 4px 14px rgba(23,32,51,0.035)",
  },

  contactLeft: {
    display: "flex",
    alignItems: "center",

    gap: "13px",

    minWidth: 0,
  },

  number: {
    minWidth: "58px",

    color: "#159b5b",

    fontSize: "19px",
    fontWeight: 800,
  },

  contactTitle: {
    color: "#172033",

    fontSize: "13px",
    fontWeight: 700,
  },

  description: {
    marginTop: "3px",

    color: "#687386",

    fontSize: "11px",
  },

  callButton: {
    flexShrink: 0,

    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "9px 14px",

    borderRadius: "10px",

    background: "#159b5b",
    color: "#ffffff",

    fontSize: "11px",
    fontWeight: 750,

    textDecoration: "none",

    boxShadow: "0 5px 12px rgba(21,155,91,0.18)",
  },

  websiteList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  website: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    gap: "15px",

    padding: "13px 14px",

    borderRadius: "14px",

    background: "rgba(255,255,255,0.58)",

    border: "1px solid rgba(230,236,232,0.95)",

    color: "#172033",
    textDecoration: "none",
  },

  websiteTitle: {
    fontSize: "13px",
    fontWeight: 700,
  },

  arrow: {
    color: "#159b5b",

    fontSize: "19px",
    fontWeight: 700,
  },
};