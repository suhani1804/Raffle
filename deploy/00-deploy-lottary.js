const { network } = require("hardhat");
const { developmentChains,networkConfig } = require("../helper-hardhat.config");
require("@nomiclabs/hardhat-etherscan");
const { verify } = require("../utils/verify");

const FUND_AMOUNT = ethers.utils.parseEther("1");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log,deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;
    let VRFCordinatorAddress, SubscriptionId;
    if(developmentChains.includes(network.name))
    {
        const vrfCordinatorV2Mock = await ethers.getContract("VRFCordinatorV2Mock");
        VRFCordinatorAddress = vrfCordinatorV2Mock.address; //Got the address (Parameter 1 for contructor)
        const transactionResponse = await vrfCordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        SubscriptionId = transactionReceipt.events[0].args[0]; // Got the subscriptionId (Parameter 2)

        await vrfCordinatorV2Mock.fundSubscription(SubscriptionId, FUND_AMOUNT);
    }
    else{
        VRFCordinatorAddress = networkConfig[chainId]["vrfCoordinator"];
        SubscriptionId = networkConfig[chainId]["subscriptionId"];
    }

    const gasLane = networkConfig[chainId]["gasLane"];// got the gasLane (Parameter 3)
    const interval = networkConfig[chainId]["interval"]; // got the interval (Parameter 4)
    const entranceFee = networkConfig[chainId]["entranceFee"]; // got the entranceFee (Parameter 5 )
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];// got the callbackGasLimit (Parameter 6)

    const args=[VRFCordinatorAddress,SubscriptionId,gasLane,interval,entranceFee,callbackGasLimit];
    const lottary = await deploy("Lottary", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(SubscriptionId, lottary.address)
    }

    if(!developmentChains.includes(network.name))
    {
        log("Verifying contract...");
        await verify(lottary.address,args);
    }
    log("-------------------------------------------")
}
module.exports.tags = ["all","Lottary"];