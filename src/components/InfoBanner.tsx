import { useState } from "react";
import { actionAtom } from "@/store/action";
import { useAtom } from "jotai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assetsAtom } from "@/store/assets";

const InfoBanner: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [action, setAction] = useAtom(actionAtom);
  const [assets] = useAtom(assetsAtom);

  const handleAssetChange = (value: string) => {
    const index = parseInt(value);
    setSelectedAsset(index);
    setAction({
      ...action,
      curPair: assets[index].name,
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
              {assets.map((option, index) => (
                <SelectItem key={option.name} value={index.toString()}>
                  {option.name}
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
