import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Gets a default provider (in production use something else like infura/alchemy)
const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");

const privateKey = process.env.PRIVATE_KEY || "";

// Initialize SchemaEncoder with the schema string
const verifiedBy = "0x29369c3E2d9EC68f6f900C27de3eFb161133Cde7".toLowerCase();

const schemaUID = "0x9eb1719b9b5d438bc9fdce2618933210971ad7f62a7808b6c44b0b2d874a5312";

// Attest the data
export async function attestData(suspiciousAddress: string) {
  const signer = new ethers.Wallet(privateKey, provider);

  const eas = new EAS(EASContractAddress);

  const schemaEncoder = new SchemaEncoder("address address,bool suspicious,address verifiedBy");

  const encodedData = schemaEncoder.encodeData([
    { name: "address", value: suspiciousAddress.toLowerCase(), type: "address" },
    { name: "suspicious", value: true, type: "bool" },
    { name: "verifiedBy", value: verifiedBy, type: "address" },
  ]);

  eas.connect(signer);
  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: suspiciousAddress.toLowerCase(),
      expirationTime: 0,
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);
}

// Revoke the attestation
export async function revoke(attestationId: string) {
  const signer = new ethers.Wallet(privateKey, provider);
  const eas = new EAS(EASContractAddress);

  eas.connect(signer);

  const tx = await eas.revoke({
    schema: schemaUID,
    data: {
      uid: attestationId,
    }
  });

  const receipt = await tx.wait();
  console.log("Receipt:", receipt);
}