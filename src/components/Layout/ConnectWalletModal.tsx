import React from "react";

interface WalletModalProps {
  show: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
}

const ConnectWalletModal: React.FC<WalletModalProps> = ({
  show,
  onClose,
  onConnectMetaMask,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md animate-fadeIn border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Connect Your Wallet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          Choose a wallet provider to continue
        </p>

        <div className="flex flex-col gap-3">

          <button
            onClick={onConnectMetaMask}
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition border border-orange-200 hover:border-orange-400 active:scale-95"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ymr3UNKopfI0NmUY95Dr-0589vG-91KuAA&s"
              alt="MetaMask"
              className="w-8 h-8"
            />
            <span className="font-medium text-gray-800">
              MetaMask
            </span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
