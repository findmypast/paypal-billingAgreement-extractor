# paypal-billingAgreement-extractor

We currently have an integration with Paypal, that integrated via the Braintree SDK. This is simply just a means of using Paypal, we are not using Braintree as a Payment Gateway. The Braintree SDK gives us a simple PaymentMethodToken, which translates to a Paypal BillingAgreementId. These AgreementId's are required for the import into our setup with Recurly. Braintree were slow to assist us in this, so we had to manually progress by using the API to gain these.

This code represents a spike to determine the feasibility of the task.

To Execute, simply run the following commands:

Install dependencies
`yarn install`

Copy in the required secrets from vault, as directed in the code.

Run the Application
`yarn start -- path/to/input.csv'
e.g. `yarn start 'test-input/100-test-input.csv'`

# Notes
To test, we are using the integration database. It's quicker to get the meat of the task, not to mention the future_pay table will become void. In integration, BNA/Genes/FMP all use the happyGeneral_integration DB, and share the future_pay table. The values for each system are differentiated by site_key. FMP = 60, BNA = 55, Genes = 3.