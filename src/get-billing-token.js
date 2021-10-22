const braintree = require("braintree");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const sql = require("mssql");
const secrets = require("../secrets.json");
const writeToOutputFile = require("./write-to-output-file");
const readOutputFile = require("./read-output-file");
const path = require("path");

const main = async (inputFilename) => {
  var inputFile = fs.readFileSync(`./${inputFilename}`);
  var tokens = parse(inputFile);

  let requestCount = 1;

  const outputProgressFilePath = path.join(
    __dirname,
    path.sep,
    "../pp-billingAgreementId-retrieval-progress.csv"
  );

  const failedRetrievalFilePath = path.join(
    __dirname,
    path.sep,
    "../pp-billingAgreementId-retrieval-failed.csv"
  );

  // Establish a connection to Braintree Gateway
  var gateway = new braintree.BraintreeGateway({
    //token value, stored in vault, integration token found at the following location uk
    accessToken: secrets.uk_ie.integration,
  });

  // Connect to FuturePay DB
  await sql.connect(secrets.sqlConfig.integration);

  // A function to block processing by a specified amount of time
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  const startTime = process.hrtime.bigint();

  for (const token of tokens) {
    if (requestCount % 10 === 0) {
      // Due to rate limiting on the BrainTree SDK, we must stagger the calls to the api by adding a block of 150ms every 10 requests
      await timer(150);
    }

    try {
      gateway.customer.search(
        async (search) => {
          // Examples of actual payment tokens can be found in the futurepay table.
          search.paymentMethodToken().is(token[0]);
        },
        (error, response) => {
          response.first(async (err, customer) => {
            if (customer) {
              writeToOutputFile(
                outputProgressFilePath,
                `${token[0]},${customer.paypalAccounts[0].billingAgreementId},`
              );
            } else {
              writeToOutputFile(failedRetrievalFilePath, `${token[0]},`);
            }
          });
        }
      );
    } catch (err) {
      console.log(err);
    }

    requestCount++;

    if (requestCount % 100 === 0) {
      const operationDuration =
        (process.hrtime.bigint() - startTime) / BigInt(1_000_000);

      process.stdout.write(
        `Processed ${requestCount} tokens in ${operationDuration}\n`
      );
    }
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
