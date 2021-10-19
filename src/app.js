const braintree = require("braintree");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const sql = require("mssql");
const secrets = require("../secrets.json");

const main = async (inputFilename) => {
  var inputFile = fs.readFileSync(`./${inputFilename}`);
  var tokens = parse(inputFile);

  let inputCount = tokens.length;
  let requestCount = 1;
  let outputCount = 1;
  let failedCount = 0;

  // Establish a connection to Braintree Gateway
  var gateway = new braintree.BraintreeGateway({
    //token value, stored in vault, integration token found at the following location uk
    accessToken: secrets.uk_ie.integration,
  });

  await sql.connect(secrets.sqlConfig);

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  for (const token of tokens) {
    if (requestCount % 10 === 0) {
      await timer(150);
    }

    gateway.customer.search(
      async (search) => {
        // Examples of actual payment tokens can be found in the futurepay table.
        search.paymentMethodToken().is(token[0]);
      },
      (err, response) => {
        response.first(async (err, customer) => {
          if (customer) {
            process.stdout.write(
              `${outputCount++} ${token[0]} ${
                customer.paypalAccounts[0].billingAgreementId
              }\n`
            );
            // try {
            //   const result = await sql.query(`UPDATE future_pay
            //       SET paypal_billing_agreement_id = '${customer.paypalAccounts[0].billingAgreementId}'
            //       WHERE [future_pay_id] = '${token[0]}';`);
            // } catch (err) {
            //   // ... error checks
            // }
          } else {
            process.stdout.write(`${outputCount++} ${token[0]}\n`);
            failedCount++;
          }
        });
      }
    );

    requestCount++;
  }
};

(async () => {
  const [inputFilename] = process.argv.slice(2);

  if (!inputFilename) {
    process.exit(1);
  }

  process.stdout.write("start\n");

  await main(inputFilename);

  process.stdout.write("...done\n");
})();
