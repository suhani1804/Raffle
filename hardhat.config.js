require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()

const Goerli_Rpc_Url = process.env.GOERLI_URL;
const Private_key = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations:1,
    },
    goerli:
    {
      chainId: 0x5,
      url: Goerli_Rpc_Url,
      accounts: [Private_key],
      blockConfirmations:2,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player:
    {
      default:1,
    }
  },
  mocha:
  {
    timeout: 200000,
  }
};
