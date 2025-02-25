import ConnectLink from "@/components/connect/ConnectLink";
import { settingsAtom } from "@/store/settings";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const Header: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-10 flex h-[56px] w-full flex-wrap items-center justify-between border-b border-solid border-card-border bg-background px-4 sm:px-10"
    >
      <div className="flex items-center gap-2">
        <img src={settings.darkMode ? "/logo.svg" : "/logo-dark.svg"} alt="Logo" className="h-7" />
        <h1 className="text-xl font-bold">Min QX</h1>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleDarkMode} className="rounded-lg border-none bg-transparent p-2 transition-colors">
          {settings.darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>
        <ConnectLink darkMode={settings.darkMode} />
      </div>
    </motion.div>
  );
};

export default Header;
