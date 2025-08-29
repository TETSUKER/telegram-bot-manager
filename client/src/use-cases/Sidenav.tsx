import React from "react";
import {
  PaperAirplaneIcon,
  AnnotationIcon,
  DocumentTextIcon,
  SpeakerphoneIcon,
} from "@heroicons/react/outline";
import { NavButton } from "../components/Button";
import { Link } from "react-router-dom";

enum NavLink {
  logs = "logs",
  bots = "bots",
  chats = "chats",
  rules = "rules",
  jokes = "jokes",
}

export const Sidenav: React.FC = () => {
  const [activeNav, setActiveNav] = React.useState<NavLink>();

  React.useEffect(() => {
    const urlLink = window.location.pathname.slice(1) as NavLink;

    if (urlLink) {
      setActiveNav(NavLink[urlLink]);
    } else {
      setActiveNav(Object.keys(NavLink)[0] as NavLink);
    }
  }, []);

  return (
    <div className="h-full w-80 flex flex-col items-start border-r border-slate-800">
      <div className="w-full flex gap-x-[5px] px-[10px] py-[10px] items-center border-b border-slate-700">
        <PaperAirplaneIcon className="size-6 text-blue-500" />
        <span className="text-white text-xl font-medium whitespace-nowrap">Telegram Bot Manager</span>
      </div>

      <div className="w-full flex flex-col px-[10px] py-[20px] gap-y-[5px]">
        <Link to="/logs">
          <NavButton
            onClick={() => setActiveNav(NavLink.logs)}
            text="Action logs"
            icon={
              <DocumentTextIcon className="size-6 text-white"></DocumentTextIcon>
            }
            active={activeNav === NavLink.logs}
          ></NavButton>
        </Link>

        <Link to="/bots">
          <NavButton
            onClick={() => setActiveNav(NavLink.bots)}
            text="Bots"
            icon="🤖"
            active={activeNav === NavLink.bots}
          ></NavButton>
        </Link>

        <Link to="/chats">
          <NavButton
            onClick={() => setActiveNav(NavLink.chats)}
            text="Chats"
            icon={
              <SpeakerphoneIcon className="size-6 text-white"></SpeakerphoneIcon>
            }
            active={activeNav === NavLink.chats}
          ></NavButton>
        </Link>

        <Link to="/rules">
          <NavButton
            onClick={() => setActiveNav(NavLink.rules)}
            text="Rules"
            icon={
              <AnnotationIcon className="size-6 text-white"></AnnotationIcon>
            }
            active={activeNav === NavLink.rules}
          ></NavButton>
        </Link>

        <Link to="/jokes">
          <NavButton
            onClick={() => setActiveNav(NavLink.jokes)}
            text="Jokes"
            icon="😂"
            active={activeNav === NavLink.jokes}
          ></NavButton>
        </Link>
      </div>
    </div>
  );
};
