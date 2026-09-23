"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Navbar() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef(null);

  // ================================
  // LOAD ALERTS
  // ================================

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoadingNotifications(true);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/alerts`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const data = await response.json();

        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load HimDrishti notifications:",
          error
        );

        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    }

    loadNotifications();
  }, []);

  // ================================
  // CLOSE NOTIFICATION ON OUTSIDE CLICK
  // ================================

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ================================
  // NOTIFICATION DATA HELPERS
  // ================================

  function getLevel(notification) {
    return (
      notification.risk_level ||
      notification.level ||
      "MODERATE"
    ).toUpperCase();
  }

  function getLocation(notification) {
    return (
      notification.location_name ||
      notification.location ||
      notification.name ||
      notification.district ||
      "Risk Zone"
    );
  }

  function getMessage(notification) {
    return (
      notification.message ||
      notification.description ||
      "Increased landslide risk detected."
    );
  }

  function getTime(notification) {
    return (
      notification.time ||
      notification.created_at ||
      "Now"
    );
  }

  return (
    <header className="top">

      {/* ================================
          LEFT / GREETING
      ================================= */}

      <div className="greeting">

        <h2>
          A Safer Northeast 🌿
        </h2>

        <p>
          Real-time information. Early warnings. Stronger communities.
        </p>

      </div>


      {/* ================================
          RIGHT SIDE
      ================================= */}

      <div className="top-right">

        {/* SEARCH - ORIGINAL PRESERVED */}

        <input
          className="search"
          placeholder="⌕ Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        {/* ================================
            NOTIFICATIONS
        ================================= */}

        <div
          ref={notificationRef}
          className="notification-wrapper"
        >

          <button
            type="button"
            className="notification-button"
            onClick={() =>
              setShowNotifications(
                (previous) => !previous
              )
            }
            aria-label="Open notifications"
          >

            <div className="notification">

              🔔

              {notifications.length > 0 && (
                <sup>
                  {notifications.length}
                </sup>
              )}

            </div>

          </button>


          {/* ================================
              NOTIFICATION DROPDOWN
          ================================= */}

          {showNotifications && (

            <div className="notification-panel">

              {/* Header */}

              <div className="notification-header">

                <div>

                  <h3>
                    🔔 Notifications
                  </h3>

                  <p>
                    Latest risk alerts
                  </p>

                </div>


                {notifications.length > 0 && (

                  <span className="notification-count">
                    {notifications.length}
                  </span>

                )}

              </div>


              {/* Body */}

              <div className="notification-list">

                {loadingNotifications && (

                  <div className="notification-empty">

                    Loading alerts...

                  </div>

                )}


                {!loadingNotifications &&
                  notifications.length === 0 && (

                    <div className="notification-empty">

                      <div className="empty-icon">
                        ✓
                      </div>

                      <div>

                        <strong>
                          No active alerts
                        </strong>

                        <small>
                          Everything looks normal right now.
                        </small>

                      </div>

                    </div>

                )}


                {!loadingNotifications &&
                  notifications.map(
                    (notification, index) => {

                      const level =
                        getLevel(notification);

                      const location =
                        getLocation(notification);

                      const message =
                        getMessage(notification);

                      const time =
                        getTime(notification);

                      const levelClass =
                        level.toLowerCase();

                      return (

                        <button
                          type="button"
                          className={`notification-item ${levelClass}`}
                          key={
                            notification.id ||
                            `${location}-${index}`
                          }
                          onClick={() => {
                            setShowNotifications(false);
                            router.push("/alerts");
                          }}
                        >

                          <div className="notification-item-top">

                            <span
                              className={`notification-dot ${levelClass}`}
                            />

                            <span
                              className={`notification-level ${levelClass}`}
                            >
                              {level}
                            </span>

                            <span className="notification-time">
                              {time}
                            </span>

                          </div>


                          <h4>
                            {location}
                          </h4>


                          <p>
                            {message}
                          </p>


                          <span className="notification-view">
                            View details →
                          </span>

                        </button>

                      );
                    }
                  )}

              </div>


              {/* Footer */}

              {notifications.length > 0 && (

                <button
                  type="button"
                  className="notification-footer"
                  onClick={() => {
                    setShowNotifications(false);
                    router.push("/alerts");
                  }}
                >
                  View all alerts →
                </button>

              )}

            </div>

          )}

        </div>


        {/* ================================
            PROFILE - ORIGINAL PRESERVED
        ================================= */}

        <div className="profile">

          <div className="avatar">
            👤
          </div>

          <span>
            Team SIH
          </span>

        </div>

      </div>

    </header>
  );
}