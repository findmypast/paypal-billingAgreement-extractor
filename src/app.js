const braintree = require("braintree");

// intake a list of tokens, in csv or something else

// running through them all, make the following search query to Braintree for the Paypal BillingAgreementId
// If it exists, save it in the futurepay table in the new column PP_BilingAgreementId
// Else, add to a csv of errored tokens

// Establish a connection to Braintree Gateway
var gateway = new braintree.BraintreeGateway({
  //token value, stored in vault, production token found at the following location
  accessToken: "'paypal/tokens/fmp/gbp/production'",
});

const paymentToken = "string_representing_token";

const stream = gateway.customer.search(
  (search) => {
    // Examples of actual payment tokens can be found in the futurepay table.
    search.paymentMethodToken().is(paymentToken);
  },
  (err, response) => {
    response.each((err, customer) => {
      // obv more error handling, this is a short spike to prove the theory.
      console.log(customer.paypalAccounts[0].billingAgreementId);
    });

    if (err) {
      console.log("error here");
    }
  }
);
