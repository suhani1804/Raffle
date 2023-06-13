// const { getNamedAccounts, deployments, ethers } = require("hardhat");
// const {developmentChains, networkConfig} = require("../../helper-hardhat.config");

// const chain = developmentChains.includes(network.name)
// !chain
//   ? describe.skip
//   : describe("Lottary", async function () {
//     let lottary, vrfCoordinator;
//     const chainId = network.config.chainId

//     beforeEach(async function(){
//         const {deployer} = await getNamedAccounts();
//         await deployments.fixture();
//         lottary = await ethers.getContract("Lottary", deployer);
//         vrfCoordinator = await ethers.getContract("VRFCordinatorV2Mock", deployer);
//     })
//     describe("constructor", async function()
//     {
//         it("Check the initialization ", async function()
//         {
//             const rafflestate = await lottary.getRaffleState();
//             const interval = await lottary.getInterval();
//             assert.equals(interval.toString(), networkConfig[chainId]["interval"]);
//             assert.equals(rafflestate.toString(),"0");
//         })
//     })
// });

const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
          let raffle, raffleContract, vrfCoordinatorV2Mock, raffleEntranceFee, interval, player // , deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              //   deployer = accounts[0]
              player = accounts[1]
              await deployments.fixture() // Deploys modules with the tags "mocks" and "raffle"
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock") // Returns a new connection to the VRFCoordinatorV2Mock contract
              raffleContract = await ethers.getContract("Lottary") // Returns a new connection to the Raffle contract
              raffle = raffleContract.connect(player) // Returns a new instance of the Raffle contract connected to player
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", function () {
              it("initializes the raffle correctly", async () => {
                  // Ideally, we'd separate these out so that only 1 assert per "it" block
                  // And ideally, we'd make this check everything
                  const raffleState = (await raffle.getRaffleState()).toString()
                  // Comparisons for Raffle initialization:
                  assert.equal(raffleState, "0")
                  assert.equal(
                      interval.toString(),
                      networkConfig[network.config.chainId]["interval"]
                  )
              })
          })

})