# paypal-billingAgreement-extractor

We currently have an integration with Paypal, that integrated via the Braintree SDK. This is simply just a means of using Paypal, we are not using Braintree as a Payment Gateway. The Braintree SDK gives us a simple PaymentMethodToken, which translates to a Paypal BillingAgreementId. These AgreementId's are required for the import into our setup with Recurly. Braintree were slow to assist us in this, so we had to manually progress by using the API to gain these.

This code represents a spike to determine the feasibility of the task.

To Execute, simply run the following commands:

Install dependencies
`yarn install`

Copy in the required secrets from vault into a file called secrets.json at the top level of the directory. It should have the following format:

{
    "uk_ie": {
        "integration": "paypal/integration-payment-gateway-config/uk-ie",
        "production": "paypal/production-payment-gateway-config/uk-ie"
    },
    "au": {
        "integration": "paypal/integration-payment-gateway-config/au",
        "production": "paypal/production-payment-gateway-config/au"
    },
    "us": {
        "integration": "paypal/integration-payment-gateway-config/us",
        "production": "paypal/production-payment-gateway-config/us"
    },
    "sqlConfig" : {
        "integration" : {
            "user": "fmp/integration/db/fh1-mssqlt01.dun.fh/username",
            "password": "fmp/integration/db/fh1-mssqlt01.dun.fh/password",
            "database": "HappyGeneral_integration",
            "server": "fmp/integration/db/fh1-mssqlt01.dun.fh/server",
            "options": {
              "trustServerCertificate": true
            }
        },
        "production" : {
            "user": "fmp/production/db/fh1-mssql02.dun.fh/username",
            "password": "fmp/production/db/fh1-mssql02.dun.fh/password",
            "database": "fmp_future_pay",
            "server": "fmp/production/db/fh1-mssql02.dun.fh/server",
            "options": {
              "trustServerCertificate": true
            }
        }

    }
}

This solution has two parts, one that retrieves the BillingAgreements, and one that saves Billingagreements into the database. 

Run the Retrieval Application
`yarn start -- path/to/input.csv'
e.g. `yarn retrieve test-input/100-test-input.csv`

Run the Save Application
`yarn start -- path/to/input.csv'
e.g. `yarn retrieve test-input/100-test-input.csv`

# Notes
To test, we are using the integration database. It's quicker to get the meat of the task, not to mention the future_pay table will become void. In integration, BNA/Genes/FMP all use the happyGeneral_integration DB, and share the future_pay table. The values for each system are differentiated by site_key. FMP = 60, BNA = 55, Genes = 3.