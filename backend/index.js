require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// MONGO CONNECT
const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI from .env:", MONGO_URI ? "LOADED" : "NOT LOADED");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // START EXPRESS SERVER (THIS IS WHAT YOU'RE MISSING!)
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// JOB MODEL
const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: String,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

// ROUTES
app.get("/", (req, res) => {
  res.send("JobQuest backend is running 🚀");
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const { company, role, location, status } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: "Company and Role are required" });
    }

    const job = new Job({ company, role, location, status });
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to add job" });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});
