// Admin Imports
import Dashboard from "@/views/admin/Dashboard";
import Team from "@/views/admin/Team";
import Chatbot from "@/views/admin/ChatBot";

// Auth Imports
import SignIn from "@/views/auth/SignIn";

// Icon Imports
import { MdHome, MdLock, MdReport } from "react-icons/md";
import { BiCollection } from "react-icons/bi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { SiWechat } from "react-icons/si";
import { FaGlobeAfrica } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import Endpoints from "./views/admin/Endpoints";
import SignUp from "./views/auth/SignUp";
import Traffic from "./views/admin/Traffic";
import Collections from "./views/admin/Collections";
import Threats from "./views/admin/Threats";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "Traffic",
    layout: "/admin",
    path: "traffic",
    icon: <FaGlobeAfrica className="h-6 w-6" />,
    component: <Traffic />,
  },
  {
    name: "API Collection",
    layout: "/admin",
    path: "api-collection",
    icon: <BiCollection className="h-6 w-6" />,
    component: <Collections />,
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
    component: <></>,
  },
  {
    name: "Threats",
    layout: "/admin",
    path: "threats",
    icon: <MdReport className="h-6 w-6" />,
    component: <Threats />,
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
    component: <Team />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
  },
];
export default routes;
