import { toast } from "react-hot-toast";
import QRCode from "qrcode";

// format number input to 100,000,000 format
export const formatQubicAmount = (amount: number, seperator = ",") => {
  return amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, seperator)
    .replace(".0", "");
};

export const truncateMiddle = (str: string, charsToRemove: number) => {
  const length = str.length;
  const start = Math.floor((length - charsToRemove) / 2);
  const end = start + charsToRemove;

  return str.slice(0, start) + "..." + str.slice(end);
};

export const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

export const sumArray = (arr: any[]) => arr.reduce((acc, curr) => acc + curr, 0);

// Basic validation checks
export const isAddressValid = (toAddress: string) => toAddress.length === 60 && /^[A-Z]+$/.test(toAddress);
export const isPositiveNumber = (amount: number) => !isNaN(Number(amount)) && Number(amount) > 0;
export const isAmountValid = (amount: number) => isPositiveNumber(amount) && amount % 1 === 0;

export const generateQRCode = async (text: string) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text);
    return qrCodeDataURL;
  } catch (err) {
    console.error("Failed to generate QR code", err);
    return "";
  }
};

export const valueOfAssetName = (asset: string): bigint => {
  const bytes = new Uint8Array(8);
  bytes.set(new TextEncoder().encode(asset));
  return new DataView(bytes.buffer).getBigInt64(0, true);
};
