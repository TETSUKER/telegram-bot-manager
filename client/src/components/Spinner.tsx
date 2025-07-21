import React from "react";

enum SpinnerColor {
  primary = "primary",
  secondary = "secondary",
  danger = "danger",
}

interface SpinnerProps {
  color?: SpinnerColor;
}

export const Spinner: React.FC<SpinnerProps> = ({ color = SpinnerColor.primary }) => {
  const colorStyle = getSpinnerColorStyle(color);
  return (
    <div className={`animate-spin flex size-full border-[3px] border-current border-t-transparent rounded-full ${colorStyle}`}></div>
  );
};

function getSpinnerColorStyle(color: SpinnerColor): string {
  if (color === SpinnerColor.danger) {
    return "text-red-600";
  }
  
  if (color === SpinnerColor.secondary) {
    return "text-slate-500";
  }

  if (color === SpinnerColor.primary) {
    return "text-blue-700";
  }

  return "";
}