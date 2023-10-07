# CasperDash - Faucet

CasperDash is an open-source web application that serves as a faucet for distributing tokens from a token pool. It provides a simple and user-friendly interface for users to initiate the distribution process and receive tokens to their account. This README file provides an overview of the project, installation instructions, and details about its features.

## Features

The CasperDash web app offers the following features:

1. **Automated Transaction Signing For CSPR**: The web app automatically signs the transaction required to transfer tokens to the user's account, eliminating the need for users to manually sign the transaction.

2. **Token Distribution Logic**: Users can initiate the distribution process of 1000 tokens by clicking on a button and signing the transaction. They are responsible for paying the gas fee required to transfer the tokens. 

3. **Cooldown Period**: After successfully initiating the distribution process, users must wait for a cooldown period of 24 hours before they can repeat the action. This ensures fair distribution and prevents abuse of the faucet.

4. **Token Availability**: The website provides real-time information about the number of tokens remaining in the token pool. Users can easily check the available tokens before initiating the distribution process.

## Installation

To run CasperDash locally, follow the instructions below:

1. Clone the repository:

```shell
git clone https://github.com/hoailinh1210/casperdash-faucet.git
```

2. Install the dependencies using npm or yarn:

```shell
yarn
```

3. Open a web browser and visit http://localhost:5173 to access the CasperDash Faucet web app.

## License
CasperDash Faucet is released under the MIT License. You are free to use, modify, and distribute this project as per the terms of the license.

## Support
If you encounter any issues or have any questions or suggestions, please [open an issue](https://github.com/hoailinh1210/casperdash-faucet/issues/new) on the GitHub repository. We appreciate your feedback and will do our best to assist you.
