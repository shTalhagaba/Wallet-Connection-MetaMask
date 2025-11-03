export interface AccountInfo {
  address: string;
  balanceEth: string;
}

export interface MetaMaskHook {
  connect: () => Promise<string[]>;
  accounts: AccountInfo[];
  chainId: string | null;
  isConnected: boolean;
  error: string | null;
  isLoadingBalances: boolean;
}