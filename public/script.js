document.getElementById("loadTasksBtn").addEventListener("click", async () => {
  const tasksList = document.getElementById("tasksList");
  tasksList.innerHTML = "<li>Loading...</li>";

  // Use an assigneeId that matches what you stored in Cosmos (from your test item)
  const assigneeId = "user-001";

  try {
    const resp = await fetch(`/api/tasks?assigneeId=${encodeURIComponent(assigneeId)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const tasks = await resp.json();

    if (!tasks.length) {
      tasksList.innerHTML = "<li>No tasks found</li>";
      return;
    }

    tasksList.innerHTML = tasks
      .map(t => `<li><strong>${t.title ?? t.id}</strong> — ${t.status ?? "unknown"}</li>`)
      .join("");
  } catch (err) {
    console.error(err);
    tasksList.innerHTML = "<li>Failed to load tasks</li>";
  }
});