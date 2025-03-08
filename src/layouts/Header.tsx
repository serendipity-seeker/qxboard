import ConnectLink from "@/components/connect/ConnectLink";
import { settingsAtom } from "@/store/settings";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import packageJson from "../../package.json";
import { UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const version = packageJson.version;

  const toggleDarkMode = () => {
    setSettings({ darkMode: !settings.darkMode });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-card-border fixed top-0 z-10 flex h-[56px] w-full flex-wrap items-center justify-between border-b border-solid bg-background px-4 sm:px-6"
    >
      <Link to="/" className="flex items-center gap-2 text-foreground hover:no-underline">
        <img src={settings.darkMode ? "/logo.svg" : "/logo-dark.svg"} alt="Logo" className="h-7" />
        <h1 className="text-xl font-bold">{packageJson.title}</h1>
        <span className="text-xs text-gray-500 dark:text-gray-400">v{version}</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/account" className="rounded-lg border-none bg-transparent p-2 text-foreground transition-colors">
          <UserIcon size={20} />
        </Link>
        <button
          onClick={toggleDarkMode}
          className="rounded-lg border-none bg-transparent p-2 transition-colors hover:text-primary"
        >
          {settings.darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>
        <ConnectLink darkMode={settings.darkMode} />
      </div>
    </motion.div>
  );
};

export default Header;
