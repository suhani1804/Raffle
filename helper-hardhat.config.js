const networkConfig ={
    0x5 :
    {
        name: "goerli",
        vrfCoordinator: process.env.VRF_COORDINATOR,
        subscriptionId :0,
        entraceFee: ethers.utils.parseEther("0.01"),
        gasLane: process.env.GAS_LANE,
        callbackGasLimit: 50000,
        interval: 30
    },
    31337:
    {
        name: "hardhat",
        entraceFee: ethers.utils.parseEther("0.01"),
        gasLane: process.env.GAS_LANE,
        callbackGasLimit: 50000,
        interval: 30
    }
}

const developmentChains =["hardhat","localhost"]

module.exports.tag ={
    networkConfig,
    developmentChains,
}

//We are using actual contract address if we are in testnet or mainnet