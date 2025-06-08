import React from "react";

export function NavButton({ text, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={
        (active ? "bg-slate-900 " : "") +
        "flex gap-x-[10px] w-full px-[10px] py-[8px] rounded hover:bg-slate-900 cursor-pointer"
      }
    >
      {icon}
      <span className=" text-white text-base">{text}</span>
    </div>
  );
}
