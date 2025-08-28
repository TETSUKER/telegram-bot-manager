import { Sidenav } from "./use-cases";
import { Routes, Route, Navigate } from "react-router-dom";
import { Bots, Chats, Rules, Jokes, ActionLogs } from './pages';

function App() {
  return (
    <div className="w-full h-screen flex bg-slate-950">
      <Sidenav></Sidenav>
      <div className="flex flex-col w-full px-[25px] overflow-auto">
        <Routes>
          <Route path="/logs" element={<ActionLogs />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/jokes" element={<Jokes />} />
          <Route path="*" element={<Navigate replace to="/logs" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
