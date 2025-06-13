import React from "react";

type ButtonType = "fill" | "outline" | "icon";
type ButtonColor = "primary" | "secondary" | "danger";

type ButtonProps = {
  text?: string;
  icon?: React.JSX.Element;
  onClick?: () => void;
  type?: ButtonType;
  color?: ButtonColor;
  disabled?: boolean;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  text = "Apply",
  icon,
  type = "fill",
  color = "primary",
  disabled = false,
  loading = false,
  onClick,
}) => {
  const baseStyles = getBaseButtonStyle(type);
  const bgStyle = getBgColor(color, type, disabled, loading);
  const bgHoverStyle = getBgHoverStyle(color, type, disabled, loading);
  const borderStyle = getBorderStyle(color, type, disabled, loading);
  const textStyle = getTextStyle(color, type, disabled);
  const cursorStyle = getCursorStyle(disabled, loading);
  const spinnerBaseStyles =
    "animate-spin flex size-6 border-[3px] border-current border-t-transparent rounded-full";
  const spinnerColor = getSpinnerColor(color);
  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${bgStyle} ${bgHoverStyle} ${borderStyle} ${textStyle} ${cursorStyle}`}
      onClick={onClick}
    >
      {loading === true ? (
        <div className={`${spinnerBaseStyles} ${spinnerColor}`}></div>
      ) : type === "icon" ? (
        <div className='size-6'>{icon}</div>
      ) : (
        text
      )}
    </button>
  );
};

function getBaseButtonStyle(type: ButtonType): string {
  const baseStyles = "flex justify-center rounded-[6px]";
  if (type === "icon") {
    return `${baseStyles} p-[5px]`;
  } else {
    return `${baseStyles} px-[16px] py-[8px] w-full`;
  }
}

function getBgColor(
  color: ButtonColor,
  type: ButtonType,
  disabled: boolean,
  loading: boolean
): string {
  if (type === "fill" && disabled === false && loading === false) {
    switch (color) {
      case "primary":
        return "bg-blue-700";
      case "secondary":
        return "bg-slate-500";
      case "danger":
        return "bg-red-600";
    }
  } else if (type === "fill" && (disabled === true || loading === true)) {
    switch (color) {
      case "primary":
        return "bg-blue-700/30";
      case "secondary":
        return "bg-slate-500/30";
      case "danger":
        return "bg-red-600/30";
    }
  } else {
    return "bg-none";
  }
}

function getBgHoverStyle(
  color: ButtonColor,
  type: ButtonType,
  disabled: boolean,
  loading: boolean
): string {
  if (disabled === false && loading === false) {
    switch (type) {
      case "fill": {
        switch (color) {
          case "primary":
            return "hover:bg-blue-800";
          case "secondary":
            return "hover:bg-slate-600";
          case "danger":
            return "hover:bg-red-700";
        }
      }

      case "outline":
      case "icon": {
        switch (color) {
          case "primary":
            return "hover:bg-blue-700 hover:text-white";
          case "secondary":
            return "hover:bg-slate-500 hover:text-white";
          case "danger":
            return "hover:bg-red-600 hover:text-white";
        }
      }
    }
  } else {
    return "";
  }
}

function getBorderStyle(
  color: ButtonColor,
  type: ButtonType,
  disabled: boolean,
  loading: boolean
): string {
  if (disabled === false && loading === false) {
    switch (type) {
      case "outline":
      case "icon": {
        switch (color) {
          case "primary":
            return "border border-blue-700";
          case "secondary":
            return "border border-slate-500";
          case "danger":
            return "border border-red-600";
        }
      }
    }
  } else {
    switch (type) {
      case "outline":
      case "icon": {
        switch (color) {
          case "primary":
            return "border border-blue-700/30";
          case "secondary":
            return "border border-slate-500/30";
          case "danger":
            return "border border-red-600/30";
        }
      }
    }
  }
  return "";
}

function getTextStyle(
  color: ButtonColor,
  type: ButtonType,
  disabled: boolean
): string {
  if (disabled === false) {
    switch (type) {
      case "fill":
        return "text-white";

      case "outline":
      case "icon": {
        switch (color) {
          case "primary":
            return "text-blue-700";
          case "secondary":
            return "text-slate-500";
          case "danger":
            return "text-red-600";
        }
      }
    }
  } else {
    switch (type) {
      case "fill":
        return "text-white/30";

      case "outline":
      case "icon": {
        switch (color) {
          case "primary":
            return "text-blue-700/30";
          case "secondary":
            return "text-slate-500/30";
          case "danger":
            return "text-red-600/30";
        }
      }
    }
  }
}

function getCursorStyle(disabled: boolean, loading: boolean): string {
  if (disabled === true || loading === true) {
    return "cursor-default";
  } else {
    return "cursor-pointer";
  }
}

function getSpinnerColor(color: ButtonColor): string {
  if (color === "primary") {
    return "text-blue-600";
  }

  if (color === "danger") {
    return "text-red-600";
  }

  if (color === "secondary") {
    return "text-slate-500";
  }

  return "";
}
