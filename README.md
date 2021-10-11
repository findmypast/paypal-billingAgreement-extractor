# paypal-billingAgreement-extractor

We currently have an integration with Paypal, that integrated via the Braintree SDK. This is simply just a means of using Paypal, we are not using Braintree as a Payment Gateway. The Braintree SDK gives us a simple PaymentMethodToken, which translates to a Paypal BillingAgreementId. These AgreementId's are required for the import into our setup with Recurly. Braintree were slow to assist us in this, so we had to manually progress by using the API to gain these.

This code represents a spike to determine the feasibility of the task.

To Execute, simply run the following commands:

Install dependencies
`yarn install`

Copy in the required secrets from vault, as directed in the code.

Run the Application
`Node src/app.js`