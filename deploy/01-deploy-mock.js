const { network } = require("hardhat");
const { developmentChains,networkConfig } = require("../helper-hardhat.config");

const BASE_FEE = ethers.utils.parseEther("0.25");
const GAS_PRICE_LINK = ethers.utils.parseUnits("100", "gwei");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log,deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const args = [BASE_FEE, GAS_PRICE_LINK];
    if(developmentChains.includes(network.name))
    {
        log("Local network is there so deploying Mock contract");
        await deploy("VRFCordinatorV2Mock",{
            from: deployer,
            log: true,
            args:args
        });
    }
}
module.exports.tags = ["all","mock"];

// VRFCordinatorV2Mock's constructor takes two parameter 1.BASE_FEE and 2.GAS_PRICE_LINK