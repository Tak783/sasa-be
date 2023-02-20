// The Plaid Open Banking SDK
//import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';


// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const { Configuration, PlaidApi, PlaidEnvironments }  = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': "619a01d5a71801001b62ca08",
      'PLAID-SECRET': "f73195eb856a95ff38ab10678e389d",
    },
  },
});

const plaidClient = new PlaidApi(configuration);

exports.createPlaidLinkToken = functions.https.onCall(async (data, context) => {
  const customerId = data.uid;

  //call the createLinkToken  METHOD of tge plaidClient instance!
  return plaidClient
    .linkTokenCreate({
      user: {
        client_user_id: customerId,
      },
      client_name: "Plaid Test App",
      language: "en",
      products: ["auth"],
      country_codes: ["US"],
    })
    .then((apiResponse) => {
      const linkToken = apiResponse.data.link_token;
      const expiration = apiResponse.data.expiration;
      const requestID = apiResponse.data.request_id;

      return {
        "link_token": linkToken,
        "expiration": expiration,
        "request_id": requestID
      };
    })
    .catch((err) => {
      console.log(err);
      console.log("There was an error")
      console.log("No Token")
      return functions.https.HttpsError(
        "internal",
        " Unable to create plaid link token: " + err
      );
    });
});