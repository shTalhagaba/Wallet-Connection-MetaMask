// import { useEffect, useState, useCallback } from "react";
// import { AccountInfo, MetaMaskHook } from "../types/ConnectWallet";

// export default function useMetaMask(): MetaMaskHook {

//   const [accounts, setAccounts] = useState<AccountInfo[]>([]);
//   const [chainId, setChainId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);

//   const getProvider = () => {
//     if (typeof window === "undefined") return null;
//     return window.ethereum ?? null;
//   };

//   const showMetaMaskAlert = () => {
//     alert("MetaMask is not installed.\n\nPlease install MetaMask to connect your wallet:\nhttps://metamask.io/download/");
//   };

//   const weiHexToEth = (weiHex: any) => {
//     try {
//       const wei = BigInt(weiHex);
//       const ethBase = BigInt(1e18);
//       const whole = wei / ethBase;
//       const remainder = wei % ethBase;
//       const decimal = Number((remainder * BigInt(1_000_000)) / ethBase) / 1_000_000;
//       return (Number(whole) + decimal).toString();
//     } catch (e) {
//       return "0";
//     }
//   };

//   const fetchBalances = useCallback(async (addresses) => {
//     const provider = getProvider();
//     if (!provider) {
//       setAccounts((prev) => prev.map((a) => ({ ...a, balanceEth: "0" })));
//       return;
//     }

//     setIsLoadingBalances(true);
//     try {
//       const promises = addresses.map(async (address) => {
//         const balanceHex = await provider.request({
//           method: "eth_getBalance",
//           params: [address, "latest"],
//         });
//         return { address, balanceEth: weiHexToEth(balanceHex) };
//       });

//       const withBalances = await Promise.all(promises);
//       setAccounts(withBalances);
//     } catch (err) {
//       console.error("fetchBalances error", err);
//       setError(err?.message || String(err));
//     } finally {
//       setIsLoadingBalances(false);
//     }
//   }, []);

//   const connect = useCallback(async () => {
//     setError(null);
//     const provider = getProvider();
//     if (!provider) {
//       showMetaMaskAlert();
//       setError("No Ethereum provider found. Install MetaMask.");
//       return [];
//     }

//     try {
//       const result = await provider.request({ method: "eth_requestAccounts" });
//       const addresses = Array.isArray(result) ? result : [];
//       await fetchBalances(addresses);
//       try {
//         const id = await provider.request({ method: "eth_chainId" });
//         setChainId(id);
//       } catch (e) {
//         console.error("eth_chainId error", e);
//       }
//       return addresses;
//     } catch (err) {
//       setError(err?.message || String(err));
//       return [];
//     }
//   }, [fetchBalances]);

//   useEffect(() => {
//     const provider = getProvider();
//     if (!provider) {
//       showMetaMaskAlert();
//       setError("No Ethereum provider found (window.ethereum is undefined).");
//       return;
//     }

//     (async () => {
//       try {
//         const exposed = await provider.request({ method: "eth_accounts" });
//         if (Array.isArray(exposed) && exposed.length > 0) {
//           await fetchBalances(exposed);
//         } else {
//           setAccounts([]);
//         }
//         try {
//           const id = await provider.request({ method: "eth_chainId" });
//           setChainId(id);
//         } catch (e) {
//           console.log("eth_chainId error", e);
//         }
//       } catch (err) {
//         console.error("initial eth_accounts error", err);
//         setError(err?.message || String(err));
//       }
//     })();

//     const handleAccountsChanged = (newAccounts: any) => {
//       if (!Array.isArray(newAccounts) || newAccounts.length === 0) {
//         setAccounts([]);
//       } else {
//         fetchBalances(newAccounts);
//       }
//       setError(null);
//     };

//     const handleChainChanged = (newChainId) => {
//       setChainId(newChainId);
//       if (accounts.length > 0) {
//         fetchBalances(accounts.map((a) => a.address));
//       }
//     };

//     provider.on && provider.on("accountsChanged", handleAccountsChanged);
//     provider.on && provider.on("chainChanged", handleChainChanged);

//     return () => {
//       provider.removeListener && provider.removeListener("accountsChanged", handleAccountsChanged);
//       provider.removeListener && provider.removeListener("chainChanged", handleChainChanged);
//     };
//   }, [fetchBalances]);

//   const isConnected = accounts.length > 0;

//   return {
//     connect,
//     accounts,
//     chainId,
//     isConnected,
//     error,
//     isLoadingBalances,
//   };
// }


import { useEffect, useState, useCallback } from "react";
import { AccountInfo, MetaMaskHook } from "../types/ConnectWallet";


export default function useMetaMask(): MetaMaskHook {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);

  const getProvider = () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    return window.ethereum;
  };

  const showMetaMaskAlert = () => {
    alert(
      "MetaMask is not installed.\n\nPlease install MetaMask to connect your wallet:\nhttps://metamask.io/download/"
    );
  };

  // Safely convert wei (hex string) to ETH string
  const weiHexToEth = (weiHex: string | null | undefined): string => {
    if (!weiHex || typeof weiHex !== "string") return "0";

    try {
      const wei = BigInt(weiHex);
      const ethBase = BigInt(1e18);
      const whole = wei / ethBase;
      const remainder = wei % ethBase;
      const decimal = Number((remainder * BigInt(1_000_000)) / ethBase) / 1_000_000;
      return (Number(whole) + decimal).toFixed(6).replace(/\.?0+$/, "");
    } catch (e) {
      console.error("Error converting wei to eth:", e);
      return "0";
    }
  };

  const fetchBalances = useCallback(
    async (addresses: string[]) => {
      const provider = getProvider();
      if (!provider || addresses.length === 0) {
        setAccounts((prev) =>
          prev.map((a) => ({ ...a, balanceEth: "0" }))
        );
        return;
      }

      setIsLoadingBalances(true);
      try {
        const promises = addresses.map(async (address) => {
          const balanceHex: string = await provider.request({
            method: "eth_getBalance",
            params: [address, "latest"],
          });
          return {
            address,
            balanceEth: weiHexToEth(balanceHex),
          };
        });

        const withBalances = await Promise.all(promises);
        setAccounts(withBalances);
      } catch (err: any) {
        console.error("fetchBalances error", err);
        setError(err?.message || "Failed to fetch balances");
      } finally {
        setIsLoadingBalances(false);
      }
    },
    []
  );

  const connect = useCallback(async (): Promise<string[]> => {
    setError(null);
    const provider = getProvider();

    if (!provider) {
      showMetaMaskAlert();
      setError("No Ethereum provider found. Install MetaMask.");
      return [];
    }

    try {
      const result: string[] = await provider.request({
        method: "eth_requestAccounts",
      });

      const addresses = Array.isArray(result) ? result : [];
      if (addresses.length > 0) {
        await fetchBalances(addresses);
      } else {
        setAccounts([]);
      }

      try {
        const id: string = await provider.request({ method: "eth_chainId" });
        setChainId(id);
      } catch (e) {
        console.error("Failed to get chainId", e);
      }

      return addresses;
    } catch (err: any) {
      const message = err?.message || "Failed to connect wallet";
      setError(message);
      return [];
    }
  }, [fetchBalances]);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) {
      showMetaMaskAlert();
      setError("No Ethereum provider found (window.ethereum is undefined).");
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        const exposed: string[] = await provider.request({
          method: "eth_accounts",
        });

        if (mounted) {
          if (Array.isArray(exposed) && exposed.length > 0) {
            await fetchBalances(exposed);
          } else {
            setAccounts([]);
          }

          try {
            const id: string = await provider.request({
              method: "eth_chainId",
            });
            setChainId(id);
        } catch (e) {
          console.error("Initial chainId fetch failed", e);
        }
      }

        const handleAccountsChanged = (newAccounts: unknown) => {
          if (!mounted) return;
          const accountsArray = Array.isArray(newAccounts) ? newAccounts : [];
          if (accountsArray.length === 0) {
            setAccounts([]);
          } else {
            fetchBalances(accountsArray as string[]);
          }
          setError(null);
        };

        const handleChainChanged = (newChainId: unknown) => {
          if (!mounted) return;
          const chain = typeof newChainId === "string" ? newChainId : null;
          setChainId(chain);
          if (accounts.length > 0) {
            fetchBalances(accounts.map((a) => a.address));
          }
        };

        if (provider.on) {
          provider.on("accountsChanged", handleAccountsChanged);
          provider.on("chainChanged", handleChainChanged);
        }

        return () => {
          mounted = false;
          if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
          }
        };
      } catch (err: any) {
        if (mounted) {
          console.error("Initial connection error", err);
          setError(err?.message || "Initialization failed");
        }
      }
    };

    const cleanup = init();
    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, [fetchBalances]);

  const isConnected = accounts.length > 0;

  return {
    connect,
    accounts,
    chainId,
    isConnected,
    error,
    isLoadingBalances,
  };
}