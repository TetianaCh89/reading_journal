import type { CSSProperties } from "react";

export type OpinionVariant = "form" | "table";

export const getOpinionStyle = (
  hasOpinion: boolean,
  variant: OpinionVariant = "table"
): CSSProperties => {
  if (variant === "form") {
    return {
      cursor: "pointer",
      whiteSpace: "pre-wrap",
      backgroundColor: hasOpinion ? "#fffbe6" : "#f9f9f9",
      border: hasOpinion ? "1px solid #ccc" : "1px dashed #aaa",
      padding: "8px 10px",
      borderRadius: "8px",
      color: hasOpinion ? "#333" : "#999",
      fontStyle: hasOpinion ? "normal" : "italic",
      display: "inline-block",
      minWidth: "200px",
      transition: "all 0.2s ease",
    };
  }

  return {
    cursor: "pointer",
    whiteSpace: "pre-wrap",
    color: hasOpinion ? "#333" : "#999",
    fontStyle: hasOpinion ? "normal" : "italic",
  };
};
