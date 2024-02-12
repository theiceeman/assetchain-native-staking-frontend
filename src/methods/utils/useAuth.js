import web3 from "web3";
import { connectorsByName } from "utils/web3React";
import _const from "../_const";
import removeAddress from "./remove-address";
import { connectorLocalStorageKey } from "./config";
import reduxStore from "methods/redux";
import { getUserStaked,
  getPendingRewards,
  getAvailableBalance,
  getAllStakingIds,
  togglemodal
} from "methods/redux/actions";


export const login = (connectorID, chainId, walletName, tokenAddress) => {
  return async (dispatch) => {
    try {
      let account;
      const connector = connectorsByName(connectorID, chainId);

      const dt = { chainId, connectorID, walletName };

      localStorage.setItem("CONNECTION_DETAILS", JSON.stringify(dt));

      if (connector) {
        if (connectorID === "injected") {
          await switchOrAddNetworkToMetamask(chainId);

          let connection = await connector.activate();

          account = connection.account;

          window.APPWEB3 = new web3(web3.givenProvider);
        }
        if (connectorID === "walletconnect") {
          const result = await connector.enable();
          account = result[0];

          //very important 2 lines
          delete connector.__proto__.request;
          connector.hasOwnProperty("request") && delete connector.request;
          const provider = await new web3(connector);
          window.APPWEB3 = provider;
        }
        if (account) {
          dispatch({
            type: _const.ADDRESS,
            payload: { address: account, walletInUse: walletName, chainId },
          });
          dispatch(togglemodal(false, 0));
          dispatch(getUserStaked(account));
          dispatch(getPendingRewards());
          dispatch(getAvailableBalance(tokenAddress));
          dispatch(getAllStakingIds());
        }
      } else {
        console.warn("Can't find connector \n The connector config is wrong");
        console.log("");
      }
    } catch (error) {}
  };
};

export const recreateWeb3 = (tokenAddress) => {
  return async (dispatch) => {
    try {
      const connectionDetails = JSON.parse(
        localStorage.getItem("CONNECTION_DETAILS")
      );

      if (connectionDetails) {
        let account = null;

        let { walletName, chainId } = connectionDetails;
        dispatch({
          type: _const.ADDRESS,
          payload: { address: "", walletInUse: walletName, chainId },
        });

        const connector = connectorsByName(
          connectionDetails.connectorID,
          connectionDetails.chainId
        );

        if (connector) {
          if (connectionDetails.connectorID === "injected") {
            await switchOrAddNetworkToMetamask(connectionDetails.chainId);

            let connection = await connector.activate();

            connection.provider.on("accountsChanged", (code, reason) => {
              const accountSwitch = code[0];
              if (accountSwitch) {
                if (accountSwitch) {
                  dispatch({
                    type: _const.ADDRESS,
                    payload: { address: accountSwitch },
                  });
                }
              } else {
                DisconnectFromWallet();
              }
            });

            account = connection.account;

            window.APPWEB3 = await new web3(web3.givenProvider);
          }

          if (connectionDetails.connectorID === "walletconnect") {
            const result = await connector.enable();
            account = result[0];

            // very important 2 lines
            delete connector.__proto__.request;
            connector.hasOwnProperty("request") && delete connector.request;

            const provider = await new web3(connector);

            window.APPWEB3 = provider;
          }
          if (account) {
            dispatch({
              type: _const.ADDRESS,
              payload: { address: account },
            });
            dispatch(getUserStaked(account));
            dispatch(getPendingRewards());
            dispatch(getAvailableBalance(tokenAddress));
            dispatch(getAllStakingIds());
          }
        } else {
          console.warn("Can't find connector \n The connector config is wrong");
        }
      } else {
        console.log("Storage Data Not There Yet Show Modal");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const DisconnectFromWallet = async () => {
  try {
    let connector = localStorage.getItem("CONNECTION_DETAILS");
    let { connectorID } = JSON.parse(connector);

    if (connectorID === "walletconnect") {
      localStorage.removeItem(connectorID);
    }

    removeAddress();

    window.sessionStorage.removeItem(connectorLocalStorageKey);
    window.sessionStorage.removeItem(_const.WEB3SETPROVIDER);
    window.sessionStorage.removeItem(
      _const.WEB3_WALLETCONNECT_HAS_DISCONNECTED
    );
    window.localStorage.removeItem(_const.NETWORK_PROVIDER_HAS_CHANGED);

    window.localStorage.removeItem("CONNECTION_DETAILS");

    const ConnectWalletReducerAction = await reduxStore();
    ConnectWalletReducerAction.dispatch({
      type: _const.PRISTINE,
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

async function switchOrAddNetworkToMetamask(chainId) {
  const hexChainId = `0x${chainId.toString(16)}`;
  try {
    if (window.ethereum) {
      // switch to the selected network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    }
  } catch (e) {
    if (e.code === 4902) {
      let params = {};
      if (chainId === 137) {
        params = {
          chainId: hexChainId,
          chainName: "Polygon Mainnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "matic",
            decimals: 18,
          },

          rpcUrls: [process.env.REACT_APP_RPC_URL],
          blockExplorerUrls: ["https://explorer.matic.network/"],
        };
      }

      // add test polygon
      if (chainId === 80001) {
        params = {
          chainId: hexChainId,
          chainName: "Polygon Testnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "matic",
            decimals: 18,
          },
          rpcUrls: process.env.REACT_APP_RPC_URL,
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        };
      }

      try {
        // the network is added
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [params],
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
}