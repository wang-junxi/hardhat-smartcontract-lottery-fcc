const { network } = require("hardhat")
const { devChains } = require("../helper-hardhat-config")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    if (devChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy a mock vfrCoordinator
    }
}
