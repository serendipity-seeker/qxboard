import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchTickInfo } from "@/services/rpc.service";
import { MdClose } from "react-icons/md";
interface Transaction {
  description: string;
  targetTick?: number;
}

interface ConfirmResult {
  txResult?: {
    status: number;
  };
  targetTick?: number;
}

interface ConfirmTxModalProps {
  tx: Transaction;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<ConfirmResult>;
  beTickOffset?: number;
}

const ConfirmTxModal = ({ tx, open, onClose, onConfirm, beTickOffset = 3 }: ConfirmTxModalProps) => {
  const [confirmedTx, setConfirmedTx] = useState<ConfirmResult | null>(null);
  const [initialTick, setInitialTick] = useState<number | null>(null);
  const [tick, setTick] = useState<number | null>(null);

  const refetchInterval = 3000;

  let intervalId: NodeJS.Timeout;

  useEffect(() => {
    const fetchTick = async () => {
      const tickInfo = await fetchTickInfo();
      setTick(tickInfo.tick);
    };

    if (confirmedTx) {
      fetchTick(); // Fetch immediately when confirmedTx is set
      intervalId = setInterval(fetchTick, refetchInterval);
    }

    return () => clearInterval(intervalId); // Cleanup interval on unmount or when confirmedTx changes
  }, [confirmedTx]);

  useEffect(() => {
    if (tick !== null && confirmedTx !== null && initialTick !== null && confirmedTx.targetTick) {
      const targetTick = confirmedTx.targetTick;
      const normalizedTick = ((tick - initialTick) / (targetTick - initialTick)) * 100;
      const widthPercentage = Math.min(Math.max(normalizedTick, 0), 100);

      if (widthPercentage >= 100) {
        onClose();
      }
    }
  }, [tick, confirmedTx, initialTick, onClose]);

  const startTickFetchInterval = async (cTx: ConfirmResult) => {
    if (cTx.targetTick) {
      cTx.targetTick = cTx.targetTick + beTickOffset; // add ticks as quottery backend buffer
    }
    // Fetch initial tick value
    const tickInfo = await fetchTickInfo();
    setInitialTick(tickInfo.tick);
    setConfirmedTx(cTx);
  };

  return (
    <>
      {open && (
        <div
          className="bg-smoke-light fixed left-0 top-0 z-50 flex h-full w-full overflow-y-auto overflow-x-hidden p-5"
          onClick={() => onClose()}
        >
          <Card className="relative m-auto flex w-full max-w-md flex-col p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white">
                qubic <span className="text-primary-40">connect</span>
              </div>
              <MdClose onClick={onClose} className="h-5 w-5 cursor-pointer" />
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {confirmedTx && confirmedTx.targetTick && (
                <>
                  <p className="text-white">
                    Current Tick: {tick} / {confirmedTx.targetTick}
                  </p>
                  <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{
                        width:
                          tick && initialTick
                            ? `${Math.min(Math.max(((tick - initialTick) / (confirmedTx.targetTick - initialTick)) * 100, 0), 100)}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </>
              )}

              {!confirmedTx && (
                <>
                  <p className="text-white">{tx.description}</p>
                  <Button
                    onClick={async () => {
                      const confirmResult = await onConfirm();
                      // check if confirmed has finished with status 200
                      if (confirmResult.txResult && confirmResult.txResult.status !== 200) return;
                      // start fetching tick and show progress bar
                      startTickFetchInterval(confirmResult);
                    }}
                  >
                    Confirm
                  </Button>
                </>
              )}
              <Button onClick={() => onClose()}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ConfirmTxModal;
