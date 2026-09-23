"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";

const reportTypes = [
  "Landslide",
  "Crack / Ground Movement",
  "Rockfall",
  "Road Blockage",
  "Heavy Rainfall",
  "Flooding",
  "Other",
];

export default function ReportsPage() {
  const [form, setForm] = useState({
    type: "",
    location: "",
    severity: "",
    description: "",
    name: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitReport = (e) => {
    e.preventDefault();

    const generatedId =
      "HD-" +
      Math.floor(100000 + Math.random() * 900000);

    setReportId(generatedId);
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({
      type: "",
      location: "",
      severity: "",
      description: "",
      name: "",
      phone: "",
    });

    setReportId("");
    setSubmitted(false);
  };

  return (
    <>
      <Sidebar />

      <main className="reports-page">

        {/* HEADER */}
        <header className="reports-header">

          <div>
            <span className="page-eyebrow">
              CITIZEN MONITORING
            </span>

            <h1>Reports</h1>

            <p>
              Report landslides, ground movement and other hazards in your area.
            </p>
          </div>

          <div className="reports-status">
            <span></span>
            Citizen Reporting Active
          </div>

        </header>

        {!submitted ? (
          <>

            {/* INTRO */}
            <section className="report-intro">

              <div className="report-intro-icon">
                ⚠
              </div>

              <div>
                <h2>Report a Hazard</h2>

                <p>
                  Your report can help authorities identify hazards
                  that may not yet be detected by monitoring systems.
                </p>
              </div>

            </section>

            {/* FORM */}
            <form
              className="report-form"
              onSubmit={submitReport}
            >

              {/* BASIC INFORMATION */}
              <section className="report-card">

                <div className="report-card-header">
                  <div>
                    <span>STEP 01</span>
                    <h2>Incident Information</h2>
                  </div>
                </div>

                <div className="report-form-grid">

                  <div className="report-field">

                    <label>
                      Incident Type
                    </label>

                    <select
                      required
                      value={form.type}
                      onChange={(e) =>
                        updateForm("type", e.target.value)
                      }
                    >
                      <option value="">
                        Select incident type
                      </option>

                      {reportTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="report-field">

                    <label>
                      Location
                    </label>

                    <input
                      required
                      value={form.location}
                      onChange={(e) =>
                        updateForm(
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="Enter village, town or district"
                    />

                  </div>

                  <div className="report-field full-width">

                    <label>
                      Severity
                    </label>

                    <div className="severity-options">

                      {["Low", "Moderate", "High", "Critical"].map(
                        (severity) => (
                          <label
                            key={severity}
                            className={`severity-option ${severity.toLowerCase()} ${
                              form.severity === severity
                                ? "selected"
                                : ""
                            }`}
                          >

                            <input
                              type="radio"
                              name="severity"
                              value={severity}
                              checked={
                                form.severity === severity
                              }
                              onChange={(e) =>
                                updateForm(
                                  "severity",
                                  e.target.value
                                )
                              }
                              required
                            />

                            <span></span>

                            {severity}

                          </label>
                        )
                      )}

                    </div>

                  </div>

                  <div className="report-field full-width">

                    <label>
                      Description
                    </label>

                    <textarea
                      required
                      value={form.description}
                      onChange={(e) =>
                        updateForm(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe what you observed..."
                      rows={5}
                    />

                    <small>
                      Include useful details such as road condition,
                      approximate size, rainfall or visible cracks.
                    </small>

                  </div>

                </div>

              </section>

              {/* EVIDENCE */}
              <section className="report-card">

                <div className="report-card-header">

                  <div>
                    <span>STEP 02</span>
                    <h2>Evidence</h2>
                  </div>

                  <span className="optional-label">
                    OPTIONAL
                  </span>

                </div>

                <div className="upload-box">

                  <div className="upload-icon">
                    ↑
                  </div>

                  <strong>
                    Add Photos or Evidence
                  </strong>

                  <p>
                    Upload images of the incident or affected area.
                  </p>

                  <label className="upload-button">
                    Choose Files

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                    />
                  </label>

                </div>

              </section>

              {/* CONTACT */}
              <section className="report-card">

                <div className="report-card-header">

                  <div>
                    <span>STEP 03</span>
                    <h2>Reporter Information</h2>
                  </div>

                  <span className="optional-label">
                    OPTIONAL
                  </span>

                </div>

                <div className="report-form-grid">

                  <div className="report-field">

                    <label>
                      Name
                    </label>

                    <input
                      value={form.name}
                      onChange={(e) =>
                        updateForm(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Your name"
                    />

                  </div>

                  <div className="report-field">

                    <label>
                      Phone Number
                    </label>

                    <input
                      value={form.phone}
                      onChange={(e) =>
                        updateForm(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="Your phone number"
                    />

                  </div>

                </div>

              </section>

              {/* SUBMIT */}
              <div className="report-submit-area">

                <div>
                  <span>Before submitting</span>

                  <p>
                    Please make sure the location and incident
                    details are accurate.
                  </p>
                </div>

                <button
                  type="submit"
                  className="submit-report-button"
                >
                  Submit Report →
                </button>

              </div>

            </form>

          </>
        ) : (
          /* SUCCESS */
          <section className="report-success">

            <div className="success-icon">
              ✓
            </div>

            <span className="success-label">
              REPORT SUBMITTED
            </span>

            <h2>
              Thank you for helping HimDrishti.
            </h2>

            <p>
              Your report has been recorded and is waiting
              for verification by the monitoring team.
            </p>

            <div className="report-id-box">

              <span>REPORT ID</span>

              <strong>{reportId}</strong>

              <small>
                Keep this ID for future reference.
              </small>

            </div>

            <div className="success-status">

              <div className="status-step active">
                <span>1</span>
                <div>
                  <strong>Submitted</strong>
                  <small>Report received</small>
                </div>
              </div>

              <div className="status-line"></div>

              <div className="status-step">
                <span>2</span>
                <div>
                  <strong>Verification</strong>
                  <small>Pending review</small>
                </div>
              </div>

              <div className="status-line"></div>

              <div className="status-step">
                <span>3</span>
                <div>
                  <strong>Action</strong>
                  <small>Authority response</small>
                </div>
              </div>

            </div>

            <button
              className="new-report-button"
              onClick={resetForm}
            >
              Submit Another Report
            </button>

          </section>
        )}

      </main>

      <MobileNav />
    </>
  );
}