import lock from "../../assets/lock.svg";
import unlocked from "../../assets/unlocked.svg";
import ConnectModal from "./ConnectModal";
import { useQubicConnect } from "./QubicConnectContext";

const ConnectLink: React.FC = () => {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();

  return (
    <>
      <div className="flex cursor-pointer items-center justify-center gap-[10px]" onClick={() => toggleConnectModal()}>
        {connected ? (
          <>
            <span className="mt-[5px] font-space text-[16px] font-[500] text-gray-50">Connected</span>
            <img src={lock} alt="locked lock icon" />
          </>
        ) : (
          <>
            <span className="mt-[5px] font-space text-[16px] font-[500] text-gray-50">Connect Wallet</span>
            <img src={unlocked} alt="unlocked lock icon" />
          </>
        )}
      </div>
      <ConnectModal open={showConnectModal} onClose={() => toggleConnectModal()} />
    </>
  );
};

export default ConnectLink;
