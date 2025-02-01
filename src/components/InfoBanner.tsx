import { useState } from "react";
import AccountSelector from "./ui/AccountSelector";
import { ISSUER } from "@/constants";
import { actionAtom } from "@/store/action";
import { useAtom } from "jotai";

const assetOptions = Array.from(ISSUER.entries()).map(([key, value]) => ({
  label: key,
  value: value,
}));

const InfoBanner: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [action, setAction] = useAtom(actionAtom);

  const handleAssetChange = (value: number) => {
    setSelectedAsset(value);
    setAction({
      ...action,
      curPair: assetOptions[value].label,
    });
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div className="w-[300px]">
          <AccountSelector
            options={assetOptions}
            selected={selectedAsset}
            setSelected={handleAssetChange}
            showValue={false}
          />
        </div>
        <div className="">InfoBanner</div>
      </div>
    </div>
  );
};

export default InfoBanner;
