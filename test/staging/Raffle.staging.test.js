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

          describe("fulfillRandomWords", () => {})
      })
