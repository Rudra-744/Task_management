import nodemailer from "nodemailer";

// Create transporter once (connection pooling for faster emails)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS || "",
      },
      // Connection pooling for faster delivery
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return transporter;
};

export const sendTaskEmail = async (task, action, userEmail) => {
  try {
    const transport = getTransporter();

    const subject =
      action === "completed"
        ? `🎉 Task Completed: ${task.title}`
        : action === "assigned"
          ? `📋 New Task Assigned to You: ${task.title}`
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
        <p style="color: #888; font-size: 12px;">This is an automated email from Task Manager.</p>
      </div>
    `;

    const mailOptions = {
      from: `"DOT IT." <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html,
    };

    await transport.sendMail(mailOptions);
    console.log(`✓ Email sent to ${userEmail} for ${action}`);
  } catch (error) {
    console.log(`✗ Email failed to ${userEmail}:`, error.message);
    throw error; // Re-throw so caller knows it failed
  }
};
