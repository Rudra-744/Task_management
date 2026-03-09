import nodemailer from "nodemailer";

// Create transporter once (connection pooling for faster emails)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    console.log("📧 Creating email transporter...");
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("📧 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("📧 EMAIL_PASS length:", process.env.EMAIL_PASS?.length || 0);
    
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
    
    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.log("❌ Email transporter verification failed:", error.message);
      } else {
        console.log("✅ Email transporter ready to send!");
      }
    });
  }
  return transporter;
};

export const sendTaskEmail = async (task, action, userEmail) => {
  console.log("=== EMAIL SEND ATTEMPT ===");
  console.log("📧 To:", userEmail);
  console.log("📧 Action:", action);
  console.log("📧 Task:", task.title);
  
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

    console.log("📧 Sending email...");
    const result = await transport.sendMail(mailOptions);
    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("📧 Message ID:", result.messageId);
    console.log("📧 Response:", result.response);
    return result;
  } catch (error) {
    console.log("❌ EMAIL SEND FAILED!");
    console.log("❌ Error name:", error.name);
    console.log("❌ Error message:", error.message);
    console.log("❌ Error code:", error.code);
    console.log("❌ Full error:", error);
    throw error;
  }
};
