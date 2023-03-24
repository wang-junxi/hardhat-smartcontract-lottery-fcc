const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { devChains, networkConfig } = require("../../helper-hardhat-config")

devChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let deployer, raffle, entranceFee

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              entranceFee = await raffle.getEntranceFee()
          })

          describe("fullfilRandomWords", () => {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
                  // before entering the raffle, record the variables
                  const startingTimestamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()

                  // before entering the raffle, setup listener
                  // Just in case the blockchain moves REALLY FAST
                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              // add asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimestamp = await raffle.getLastTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner, accounts[0].address)
                              assert.equal(raffleState.toString(), "0")
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(entranceFee).toString()
                              )
                              assert(endingTimestamp > startingTimestamp)

                              // after doing all this, we can resolve()
                              resolve()
                          } catch (e) {
                              console.error(e)
                              reject(e)
                          }
                      })

                      // enter the raffle
                      console.log("Entering Raffle...")
                      const tx = await raffle.enterRaffle({ value: entranceFee })
                      await tx.wait(1)

                      console.log("Ok, time to wait...")
                      const winnerStartingBalance = await accounts[0].getBalance()

                      // and this code WON'T complete util our listener has finished listening.
                  })
              })
          })
      })
