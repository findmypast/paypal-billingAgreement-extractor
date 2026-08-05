const braintree = require("braintree");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const path = require("path");

const secrets = require("../secrets.json");
const writeToOutputFile = require("./write-to-output-file");

const main = async (inputFilename) => {
  const inputFile = fs.readFileSync(`./${inputFilename}`);
  const inputCsv = parse(inputFile);

  let requestCount = 1;

  const outputProgressFilePath = path.join(
    __dirname,
    "../bna-pp-billing-agreement-id-retrieval-progress.csv",
  );

  const failedRetrievalFilePath = path.join(
    __dirname,
    "../bna-pp-billing-agreement-id-retrieval-failed.csv",
  );

  const gateway = new braintree.BraintreeGateway({
    accessToken: secrets.bna.integration,
  });

  const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const startTime = process.hrtime.bigint();

  for (const inputLine of inputCsv) {
    const [memberKey, paymentGatewayToken] = inputLine;

    if (requestCount % 10 === 0) {
      await timer(150);
    }

    try {
      gateway.customer.search(
        (search) => {
          search.paymentMethodToken().is(paymentGatewayToken);
        },
        (error, response) => {
          if (error) {
            writeToOutputFile(
              failedRetrievalFilePath,
              `${memberKey},${paymentGatewayToken},${error.message},`,
            );

            return;
          }

          response.first((customerError, customer) => {
            if (customerError) {
              writeToOutputFile(
                failedRetrievalFilePath,
                `${memberKey},${paymentGatewayToken},${customerError.message},`,
              );

              return;
            }

            const billingAgreementId =
              customer?.paypalAccounts?.[0]?.billingAgreementId;

            if (billingAgreementId) {
              writeToOutputFile(
                outputProgressFilePath,
                `${memberKey},${billingAgreementId},`,
              );
            } else {
              writeToOutputFile(
                failedRetrievalFilePath,
                `${memberKey},${paymentGatewayToken},Billing agreement ID not found,`,
              );
            }
          });
        },
      );
    } catch (error) {
      writeToOutputFile(
        failedRetrievalFilePath,
        `${memberKey},${paymentGatewayToken},${error.message},`,
      );

      console.error(
        `Failed to retrieve Billing Agreement ID for member ${memberKey}:`,
        error.message,
      );
    }

    requestCount++;

    if (requestCount % 100 === 0) {
      const operationDuration =
        (process.hrtime.bigint() - startTime) / BigInt(1_000_000);

      process.stdout.write(
        `Processed ${requestCount} tokens in ${operationDuration}ms\n`,
      );
    }
  }
};

(async () => {
  const [inputFilename] = process.argv.slice(2);

  if (!inputFilename) {
    console.error(
      "Usage: yarn retrieve:bna -- path/to/bna-member-payment-tokens.csv",
    );

    process.exitCode = 1;
    return;
  }

  process.stdout.write("Starting BNA Billing Agreement retrieval...\n");

  try {
    await main(inputFilename);

    process.stdout.write("...done\n");
  } catch (error) {
    console.error("BNA Billing Agreement retrieval failed:", error.message);
    process.exitCode = 1;
  }
})();
