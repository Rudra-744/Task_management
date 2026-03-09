import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTaskEmail = async (task, action, userEmail) => {
  console.log("=== EMAIL SEND ATTEMPT (Resend) ===");
  console.log("📧 To:", userEmail);
  console.log("📧 Action:", action);
  console.log("📧 Task:", task.title);
  console.log("📧 API Key exists:", !!process.env.RESEND_API_KEY);

  try {
    const subject =
      action === "completed"
        ? `🎉 Task Completed: ${task.title}`
        : action === "assigned"
          ? `📋 New Task Assigned: ${task.title}`
          : `✅ New Task Created: ${task.title}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #ff0000;">Task ${action === "completed" ? "Completed 🎉" : action === "assigned" ? "Assigned to You 📋" : "Created ✅"}</h2>
        <hr/>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || "No description"}</p>
        <p><strong>Status:</strong> ${task.completed ? "✅ Completed" : "⏳ Pending"}</p>
        <p><strong>Time:</strong> ${new Date(task.createdAt || Date.now()).toLocaleString()}</p>
        <hr/>
        <p style="color: #888; font-size: 12px;">This is an automated email from DOT IT Task Manager.</p>
      </div>
    `;

    console.log("📧 Sending via Resend...");
    
    const { data, error } = await resend.emails.send({
      from: "DOT IT <onboarding@resend.dev>", // Free tier uses this
      to: userEmail,
      subject: subject,
      html: html,
    });

    if (error) {
      console.log("❌ Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("📧 Email ID:", data.id);
    return data;
  } catch (error) {
    console.log("❌ EMAIL SEND FAILED!");
    console.log("❌ Error:", error.message);
    throw error;
  }
};
