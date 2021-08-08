import React, { Component } from "react";
import StakingTokenContract from "./contracts/StakingToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
	state = { storageValue: 0, web3: null, accounts: null, contract: null, stakeValue: 1 };

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = StakingTokenContract.networks[networkId];
			const instance = new web3.eth.Contract(
				StakingTokenContract.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state.
			this.setState({ web3, accounts, contract: instance });
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	};

	createStake = async () => {
		try {
			const { accounts, contract } = this.state;
			const result = await contract.methods
				.createStake(this.state.stakeValue)
				.send({ from: accounts[0] });
			if (result.events.createStakeFailed !== undefined) {
				throw result.events.createStakeFailed.returnValues.reason;
			}
		} catch (err) {
			alert(err);
		}
	};

	withdrawStake = async () => {
		try {
			const { accounts, contract } = this.state;
			const result = await contract.methods.withdrawStake().send({ from: accounts[0] });
			if (result.events.withdrawStakeFailed !== undefined) {
				throw result.events.withdrawStakeFailed.returnValues.reason;
			}
		} catch (err) {
			alert(err);
		}
	};

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="section">
				<h1>Staking Tokens</h1>
				<div className="app">
					<div className="app-cs">
						<input
							className="app-cs-input"
							type="number"
							min="1"
							step="1"
							placeholder={this.state.stakeValue}
							onChange={(e) => this.setState({ stakeValue: e.target.value })}
						/>
						<button onClick={this.createStake} className="app-btn">
							CREATE STAKE
						</button>
					</div>
					<div className="app-ws">
						<button onClick={this.withdrawStake} className="app-btn">
							WITHDRAW STAKE
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
