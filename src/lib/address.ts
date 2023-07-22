import { ethers } from "ethers";

export function isAddress(value: string): boolean {
  try {
    ethers.utils.getAddress(value)
    return true;
  } catch (e) {
    return false;
  }
}