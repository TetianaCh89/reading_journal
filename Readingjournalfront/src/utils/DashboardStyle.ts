export const dashboardContainerSx = {
  width: "100vw",
  height: "calc(100vh - 64px)",
  display: "flex",
  flexDirection: "column",
  bgcolor: "#f5f5f5",
};

export const tabsContainerSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  p: 1.5,
  backgroundColor: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  gap: 1.5,
};

export const tabButtonStyle = (isActive: boolean, color: string) => ({
  padding: "8px 14px",
  borderRadius: 6,
  border: `1px solid ${color}`,
  background: isActive ? color : "#fff",
  color: isActive ? "#fff" : color,
  cursor: "pointer",
});
