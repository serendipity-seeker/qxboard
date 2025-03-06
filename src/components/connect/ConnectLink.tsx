import { MdLock, MdLockOpen } from "react-icons/md";
import ConnectModal from "./ConnectModal";
import { useQubicConnect } from "./QubicConnectContext";

const ConnectLink: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();

  return (
    <>
      <div className="flex cursor-pointer items-center justify-center gap-[10px]" onClick={() => toggleConnectModal()}>
        {connected ? (
          <>
            {/* <span className="mt-[5px] font-space text-[16px] font-[500] text-foreground">Connected</span> */}
            <MdLock className="h-5 w-5" />
          </>
        ) : (
          <>
            {/* <span className="mt-[5px] font-space text-[16px] font-[500] text-foreground">Connect Wallet</span> */}
            <MdLockOpen className="h-5 w-5" />
          </>
        )}
      </div>
      <ConnectModal open={showConnectModal} onClose={() => toggleConnectModal()} darkMode={darkMode} />
    </>
  );
};

export default ConnectLink;
