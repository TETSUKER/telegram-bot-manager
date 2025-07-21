import React from "react";
import { Spinner } from "./Spinner";

interface ModalProps {
  isOpen: boolean;
  header: React.JSX.Element;
  content: React.JSX.Element;
  bottom: React.JSX.Element;
  isLoading: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  header,
  content,
  bottom,
  isLoading = false,
}) => {
  return isOpen === true ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-auto max-h-full flex flex-col">
        {isLoading ? (
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center">
            <div className="size-10">
              <Spinner />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="flex px-[12px] py-[9px]">{header}</div>
        <div className="px-[12px] py-[12px] overflow-auto">{content}</div>
        <div className="flex px-[12px] py-[9px]">{bottom}</div>
      </div>
    </div>
  ) : (
    <></>
  );
};
