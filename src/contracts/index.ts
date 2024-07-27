import naxios from "@wpdas/naxios";

import {constants} from "../constants";

// Naxios (Contract/Wallet) Instance
export const naxiosInstance = new naxios({
  rpcNodeUrl: `https://${constants.NETWORK.toLowerCase() === "mainnet" ? "near" : "near-testnet"}.lava.build`,
  contractId: constants.SOCIAL_DB_CONTRACT_ID,
  network: constants.NETWORK
});

/**
 * NEAR Wallet API
 */
export const walletApi = naxiosInstance.walletApi();