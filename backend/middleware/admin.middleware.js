// adminOnly — sirf admin access
export const adminOnly = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }
    next();
  } catch (error) {
    console.log("Admin only error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// adminOrPM — admin YA project_manager dono kar sakte hain
export const adminOrPM = (req, res, next) => {
  try {
    const allowed = ["admin", "project_manager"];
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        message: "Unauthorized - Admin or Project Manager access only",
      });
    }
    next();
  } catch (error) {
    console.log("AdminOrPM error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
