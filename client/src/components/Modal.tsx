import React from "react";

interface ModalProps {
  isOpen: boolean;
  header: React.JSX.Element;
  content: React.JSX.Element;
  bottom: React.JSX.Element;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  header,
  content,
  bottom,
}) => {
  return isOpen === true ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex px-[12px] py-[9px]">{header}</div>
        <div className="px-[12px] py-[12px]">{content}</div>
        <div className="flex px-[12px] py-[9px]">{bottom}</div>
      </div>
    </div>
  ) : (
    <></>
  );
};
