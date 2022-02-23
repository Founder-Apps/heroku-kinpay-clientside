# @kin-sdk/client

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test client` to execute the unit tests via [Jest](https://jestjs.io).

## Install Dependencies
To install the dependencies, please run the following in your command terminal to start the project.

You need to install the @kin-sdk/client package to your project:

yarn add @kin-sdk/client
# Or if you are using npm
npm install @kin-sdk/client

## Step 1: Initializing the Kin Client
The first thing you need to do is import the KinClient and environment (KinProd or KinTest) into your project, and initialize a new instance of the client:
Step 1: Initializing the Kin Client
The first thing you need to do is import the KinClient and environment (KinProd or KinTest) into your project, and initialize a new instance of the client:

// Import the client
import { KinClient, KinProd } from '@kin-sdk/client'
// Create instance of client _ must Use KinTest to receive Test Kin for Transaction Testing. Be mindful
const client = new KinClient(KinProd)

## Step 2: Generate a new key pair
In order to interact with the blockchain you need a key pair that consists of a secret and publicKey.

This account will generally be stored on the users' device, for instance using IndexedDB. Make sure that the user has a way to export their secret, so they won't lose access to their Kin.

GET {API LINK}
POST [Secret, Public) to KINPasswords.txt

## Step 3: Create an account on Kin blockchain
Use the secret of the account you generated in the previous step to create the account on the blockchain.

Creating the account may take a little while (up to 30 seconds, possibly longer on a busy moment) after the result above has been returned. You can use the getBalances method (see next step) to make sure the account is in fact created. As soon as the account is created correctly, the getBalances method will return the address with the balance.

const [result, error] = await client.createAccount(account.secret)
if (error) {
  console.error(error)
}
## Step 4: Get balances
The next step is retrieving the balances. Kin is a token on the Solana blockchain, and your Solana Account can consist of various 'balances' or 'token accounts'. You can read more details here.

// Retrieve balances from account
GET [API Link}

## Step 5: Submit a payment.
After this is done, you are ready to submit a payment. This must be tested with KINTEST, not KIN PROD

The memo field here is optional, the other fields are required.

const secret = account.secret
const tokenAccount = account.publicKey
const amount = '1'
const destination = 'KIN.public.key'
const memo = 'Reason for payment'
await client.submitPayment({
  secret,
  tokenAccount,
  amount,
  destination,
  memo,
})
