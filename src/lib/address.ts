import { utils } from 'ethers';

export function isAddress(value: string): boolean {
  try {
    utils.getAddress(value)
    return true;
  } catch (e) {
    return false;
  }
}