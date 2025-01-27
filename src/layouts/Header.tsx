import { motion } from "framer-motion";

const Header: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-10 flex h-[78px] w-full flex-wrap items-center justify-between border-b border-solid border-card-border bg-background px-4 sm:px-10"
    >
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-7" />
        <h1 className="text-xl font-bold">Min QX</h1>
      </div>
    </motion.div>
  );
};

export default Header;
