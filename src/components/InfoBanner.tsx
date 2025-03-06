import { useState } from "react";
import { ISSUER } from "@/constants";
import { actionAtom } from "@/store/action";
import { useAtom } from "jotai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const assetOptions = Array.from(ISSUER.entries()).map(([key, value]) => ({
  label: key,
  value: value,
}));

const InfoBanner: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [action, setAction] = useAtom(actionAtom);

  const handleAssetChange = (value: string) => {
    const index = parseInt(value);
    setSelectedAsset(index);
    setAction({
      ...action,
      curPair: assetOptions[index].label,
    });
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div className="w-[300px]">
          <Select onValueChange={handleAssetChange} value={selectedAsset.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {assetOptions.map((option, index) => (
                <SelectItem key={option.label} value={index.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="">InfoBanner</div>
      </div>
    </div>
  );
};

export default InfoBanner;
