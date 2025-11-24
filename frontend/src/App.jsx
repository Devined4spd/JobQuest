import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_BASE = "http://localhost:4000"; // backend URL

const STATUS_COLORS = {
  Applied: "#3b82f6",
  Interview: "#f97316",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

function App() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    status: "Applied",
  });

  const [jobs, setJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statuses = ["Applied", "Interview", "Offer", "Rejected"];

  // ----- Load jobs from backend -----
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) {
      alert("Please fill at least Company and Role");
      return;
    }

    try {
      setError("");
      await axios.post(`${API_BASE}/api/jobs`, form);
      await loadJobs();
      setForm({
        company: "",
        role: "",
        location: "",
        status: "Applied",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add job");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      setError("");
      await axios.delete(`${API_BASE}/api/jobs/${id}`);
      await loadJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to delete job");
    }
  };

  // ----- Stats -----
  const totalApplications = jobs.length;
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = jobs.filter((job) => job.status === status).length;
    return acc;
  }, {});

  // Pie chart data
  const statusChartData = statuses.map((status) => ({
    name: status,
    value: statusCounts[status] || 0,
  }));

  // Monthly bar chart data
  const monthlyMap = {};
  jobs.forEach((job) => {
    const d = new Date(job.createdAt);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });

  const monthlyChartData = Object.entries(monthlyMap)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, count]) => {
      const [year, month] = key.split("-");
      const label = `${month}/${year.slice(-2)}`; // e.g. 11/25
      return { month: label, count };
    });

  // Filtered table data
  const filteredJobs =
    filterStatus === "All"
      ? jobs
      : jobs.filter((job) => job.status === filterStatus);

  return (
      <div
  style={{
    padding: "32px",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: "100vw",          // use full viewport width
    maxWidth: "100vw",       // no extra limit
    margin: 0,               // no centering box
    color: "#f9fafb",
    backgroundColor: "#020617",
    minHeight: "100vh",
    boxSizing: "border-box",
  }}
>
      <h1 style={{ marginBottom: "8px", fontSize: "32px" }}>
        JobQuest – Job Application Tracker
      </h1>
      <p style={{ marginTop: 0, marginBottom: "20px", color: "#9ca3af" }}>
        Track all your job and internship applications in one place.
      </p>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#7f1d1d",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      {/* DASHBOARD SECTION */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
          width: "100%",
        }}
      >
        {/* Overview card */}
        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: "12px",
            padding: "16px",
            background:
              "radial-gradient(circle at top left, #0f172a, #020617 60%)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Overview</h2>
          <p style={{ margin: "4px 0 12px", color: "#9ca3af" }}>
            Quick summary of your applications.
          </p>
          <p style={{ margin: "4px 0", fontSize: "24px", fontWeight: "600" }}>
            {totalApplications}
            <span style={{ fontSize: "14px", marginLeft: "6px", color: "#9ca3af" }}>
              total applications
            </span>
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {statuses.map((status) => (
              <div
                key={status}
                style={{
                  borderRadius: "999px",
                  padding: "4px 10px",
                  fontSize: "13px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #1f2937",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: STATUS_COLORS[status],
                    marginRight: "6px",
                  }}
                />
                <strong>{status}:</strong> {statusCounts[status] || 0}
              </div>
            ))}
          </div>
        </div>

        {/* Charts card */}
        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "18px", marginBottom: "8px" }}>
            Dashboard
          </h2>
          <p style={{ marginTop: 0, marginBottom: "12px", color: "#9ca3af" }}>
            Visual view of your job search.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: "8px",
              height: "260px",
            }}
          >
            {/* Pie Chart */}
            <div>
              <h3
                style={{
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: "#e5e7eb",
                }}
              >
                By Status
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    label
                  >
                    {statusChartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#e5e7eb",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div>
              <h3
                style={{
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: "#e5e7eb",
                }}
              >
                Applications per Month
              </h3>
              {monthlyChartData.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Add a few applications to see this chart.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis allowDecimals={false} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#e5e7eb",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section
        style={{
          border: "1px solid #1f2937",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
          backgroundColor: "#020617",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add New Application</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 16px",
          }}
        >
          <div style={{ gridColumn: "1 / 2" }}>
            <label>
              Company <span style={{ color: "#f97316" }}>*</span>
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#f9fafb",
              }}
            />
          </div>

          <div style={{ gridColumn: "2 / 3" }}>
            <label>
              Role <span style={{ color: "#f97316" }}>*</span>
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. SDE Intern"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#f9fafb",
              }}
            />
          </div>

          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Remote / Noida"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#f9fafb",
              }}
            />
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#f9fafb",
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / 3", textAlign: "right" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Saving..." : "Add Application"}
            </button>
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <section
        style={{
          border: "1px solid #1f2937",
          borderRadius: "12px",
          padding: "16px",
          backgroundColor: "#020617",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <h2 style={{ margin: 0 }}>My Applications</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #374151",
              backgroundColor: "#020617",
              color: "#f9fafb",
            }}
          >
            <option value="All">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && jobs.length === 0 ? (
          <p>Loading applications...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No applications yet for this filter.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "8px",
              }}
            >
              <thead>
                <tr>
                  {["Company", "Role", "Location", "Status", "Created At", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          borderBottom: "1px solid #1f2937",
                          padding: "8px",
                          textAlign: "left",
                          fontWeight: "500",
                          fontSize: "13px",
                          color: "#9ca3af",
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td
                      style={{
                        borderBottom: "1px solid #1f2937",
                        padding: "8px",
                      }}
                    >
                      {job.company}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #1f2937",
                        padding: "8px",
                      }}
                    >
                      {job.role}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #1f2937",
                        padding: "8px",
                      }}
                    >
                      {job.location || "-"}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #1f2937",
                        padding: "8px",
                      }}
                    >
                      {job.status}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #1f2937",
                        padding: "8px",
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #1f2937",
                        padding: "8px",
                      }}
                    >
                      <button
                        onClick={() => handleDelete(job._id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor: "#ef4444",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
