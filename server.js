require("dotenv").config(); // loads .env locally; in Azure it just uses real env vars

const express = require("express");
const path = require("path");
const { tasksContainer } = require("./cosmosClient");

const app = express();
app.use(express.json());

// Serve static files (index.html, script.js, style.css) from /public
app.use(express.static(path.join(__dirname, "public")));

/**
 * GET /api/tasks?assigneeId=user-001
 * Returns all tasks for a given assigneeId.
 */
app.get("/api/tasks", async (req, res) => {
  try {
    const assigneeId = req.query.assigneeId;
    if (!assigneeId) {
      return res.status(400).json({ error: "assigneeId query param is required" });
    }

    // Partition key design: /assigneeId (recommended for tasks by user).
    // Query by assigneeId is a typical access pattern. [6](https://github.com/Microsoft/sarif-vscode-extension/releases)[7](https://deepwiki.com/microsoft/sarif-visualstudio-extension/4.1-github-advanced-security-integration)
    const querySpec = {
      query: "SELECT * FROM c WHERE c.assigneeId = @assigneeId",
      parameters: [{ name: "@assigneeId", value: assigneeId }],
    };

    const { resources } = await tasksContainer.items.query(querySpec).fetchAll();
    return res.json(resources);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});