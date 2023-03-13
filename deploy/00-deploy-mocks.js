const { network, ethers } = require("hardhat")
const { devChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium. It costs 0.25 LINK per request.
const GAS_PRICE_LINK = 1e9 // link per gas. // calculated value based on the gas price of the chain.

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (devChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy a mock vfrCoordinator...
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })

        log("Mocks deployed!")
        log("-----------------------------")
    }
}
