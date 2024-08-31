// Admin Imports
import Dashboard from "@/views/admin/Dashboard";
import Reports from "@/views/admin/Reports";
import Incidents from "@/views/admin/Incidents";
import Staff from "@/views/admin/Staff";
import Chatbot from "@/views/admin/ChatBot";

// Auth Imports
import SignIn from "@/views/auth/SignIn";

// Icon Imports
import { MdHome, MdLock, MdReport } from "react-icons/md";
import { BiCollection } from "react-icons/bi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { SiWechat } from "react-icons/si";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import Endpoints from "./views/admin/Endpoints";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "API Collection",
    layout: "/admin",
    path: "api-collection",
    icon: <BiCollection className="h-6 w-6" />,
    component: <Reports />,
  },
  {
    name: "API Endpoints",
    layout: "/admin",
    path: "api-endpoints",
    icon: <FaCode className="h-6 w-6" />,
    component: <Endpoints />,
  },
  {
    name: "Testing",
    layout: "/admin",
    path: "testing",
    icon: <FaRegCirclePlay className="h-6 w-6" />,
    component: <Reports />,
  },
  {
    name: "Issues",
    layout: "/admin",
    path: "issues",
    icon: <MdReport className="h-6 w-6" />,
    component: <Incidents />,
  },
  {
    name: "VibraniumGPT",
    layout: "/admin",
    path: "vibraniumgpt",
    icon: <SiWechat className="h-6 w-6" />,
    component: <Chatbot />,
  },
  {
    name: "Team",
    layout: "/admin",
    path: "team",
    icon: <BsFillPeopleFill className="h-6 w-6" />,
    component: <Staff />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
