const { JiraDashboard } = require("../models/Jira");
exports.getDashboardContent = async (req, res) => {
  try {
    const dashboardDetails = await JiraDashboard.find();
    res.status(200).json({ message: "Dashboard Details", dashboardDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
