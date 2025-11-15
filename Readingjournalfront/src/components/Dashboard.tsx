import { useState } from "react";
import Box from "@mui/material/Box";
import UserBooklist from "./UserBookList";
import AllBookList from "./AllBookList";
import {
  dashboardContainerSx,
  tabsContainerSx,
  tabButtonStyle,
} from "../utils/DashboardStyle";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"mine" | "all">("mine");

  return (
    <Box sx={dashboardContainerSx}>
      <Box sx={tabsContainerSx}>
        <button
          onClick={() => setActiveTab("mine")}
          style={tabButtonStyle(activeTab === "mine", "#1976d2")}
        >
          My reading entries
        </button>

        <button
          onClick={() => setActiveTab("all")}
          style={tabButtonStyle(activeTab === "all", "#9c27b0")}
        >
          All books
        </button>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {activeTab === "mine" ? <UserBooklist /> : <AllBookList />}
      </Box>
    </Box>
  );
}
