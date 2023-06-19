const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat.config");

// console.log("running Lottary.test.js")
// runs on testnets and mainnet
// developmentChains.includes(network.name)
//   ? describe.skip
//   :
   describe("Raffle Unit Tests", function () {
      let raffle,
        raffleContract,raffleEntranceFee,deployer

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        raffleEntranceFee = await raffle.getEntranceFee()
        raffleContract = await ethers.getContractFactory("Raffle" , deployer)
      });
      describe("fulfillRandomWords", function () {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
            console.log("Setting up test...")
            const startingTimeStamp = await raffle.getLastTimeStamp()
            const accounts = await ethers.getSigners()

            console.log("Setting up Listener...")
            await new Promise(async (resolve, reject) => {
                raffle.once("WinnerPicked", async () => {
                    console.log("WinnerPicked event fired!")
                    try {
                        const recentWinner = await raffle.getRecentWinner()
                        const raffleState = await raffle.getRaffleState()
                        const winnerEndingBalance = await accounts[0].getBalance()
                        const endingTimeStamp = await raffle.getLastTimeStamp()

                        await expect(raffle.getPlayer(0)).to.be.reverted
                        assert.equal(recentWinner.toString(), accounts[0].address)
                        assert.equal(raffleState, 0)
                        assert.equal(
                            winnerEndingBalance.toString(),
                            winnerStartingBalance.add(raffleEntranceFee).toString()
                        )
                        assert(endingTimeStamp > startingTimeStamp)
                        resolve()
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                })
                console.log("Entering Raffle...")
                const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                await tx.wait(1)
                console.log("Ok, time to wait...")
                const winnerStartingBalance = await accounts[0].getBalance()
            })
        })
      })
    })