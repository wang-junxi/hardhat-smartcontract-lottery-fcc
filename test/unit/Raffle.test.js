const { assert, expect } = require("chai")
const { getNamedAccounts, deployments } = require("hardhat")
const { devChains, networkConfig } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Uint Tests", async function () {
          let deployer, raffle, vrfCoordinatorV2Mock, entranceFee
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              entranceFee = await raffle.getEntranceFee()
          })

          describe("constructor", async function () {
              it("initializes the raffle correctly", async function () {
                  // Ideally we make our tests have only 1 assert per "it"
                  const raffleState = await raffle.getRaffleState()
                  const interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", async function () {
              it("reverts when you do not pay enough ETH", async function () {
                  await expect(raffle.enterRaffle).to.be.revertedWith("Raffle__NotEnoughETHEntered")
              })

              it("record players when they enter", async function () {
                  await raffle.enterRaffle({ value: entranceFee })
                  const playerFromRaffle = await raffle.getPlayer(0)
                  assert.equal(playerFromRaffle, deployer)
              })

              it("emits event on enter", async function () {
                
              })
          })
      })
