import React from "react";
import {
  PaperAirplaneIcon,
  AnnotationIcon,
  DocumentTextIcon,
  SpeakerphoneIcon,
} from "@heroicons/react/outline";
import { NavButton } from "./Buttons";

export const Sidenav: React.FC = () => {
  const [activeNav, setActiveNav] = React.useState("Bots");

  return (
    <div className="h-full w-80 flex flex-col items-start border-r border-slate-800">
      <div className="w-full flex gap-x-[10px] px-[20px] py-[10px] items-center border-b border-slate-700">
        <PaperAirplaneIcon className="size-6 text-blue-500" />
        <span className="text-white text-xl font-medium">Telegram Manager</span>
      </div>

      <div className="w-full flex flex-col px-[10px] py-[20px] gap-y-[5px]">
        <NavButton
          onClick={() => setActiveNav("Logs")}
          text="Logs"
          icon={
            <DocumentTextIcon className="size-6 text-white"></DocumentTextIcon>
          }
          active={activeNav === "Logs"}
        ></NavButton>
        <NavButton
          onClick={() => setActiveNav("Bots")}
          text="Bots"
          icon="🤖"
          active={activeNav === "Bots"}
        ></NavButton>
        <NavButton
          onClick={() => setActiveNav("Chats")}
          text="Chats"
          icon={
            <SpeakerphoneIcon className="size-6 text-white"></SpeakerphoneIcon>
          }
          active={activeNav === "Chats"}
        ></NavButton>
        <NavButton
          onClick={() => setActiveNav("Rules")}
          text="Rules"
          icon={<AnnotationIcon className="size-6 text-white"></AnnotationIcon>}
          active={activeNav === "Rules"}
        ></NavButton>
        <NavButton
          onClick={() => setActiveNav("Jokes")}
          text="Jokes"
          icon="😂"
          active={activeNav === "Jokes"}
        ></NavButton>
      </div>
    </div>
  );
};
