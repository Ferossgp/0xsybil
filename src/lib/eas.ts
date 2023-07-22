import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request'

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const schemaUID = "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995";
const eas = new EAS(EASContractAddress);

const provider = ethers.providers.getDefaultProvider(
  "sepolia"
);

eas.connect(provider);

export const API_URL = 'https://sepolia.easscan.org/graphql'

export const graphQLClient = new GraphQLClient(API_URL, { fetch })