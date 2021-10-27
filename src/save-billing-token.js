const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const sql = require("mssql");
const secrets = require("../secrets.json");
const writeToOutputFile = require("./write-to-output-file");
const path = require("path");

const main = async (inputFilename) => {
  var inputFile = fs.readFileSync(`./${inputFilename}`);
  var inputCsv = parse(inputFile);

  let requestCount = 1;

  const outputProgressFilePath = path.join(
    __dirname,
    path.sep,
    "../pp-billingAgreementId-save-progress.csv"
  );

  const failedRetrievalFilePath = path.join(
    __dirname,
    path.sep,
    "../pp-billingAgreementId-save-failed.csv"
  );

  // Connect to FuturePay DB
  await sql.connect(secrets.sqlConfig.production);

  const startTime = process.hrtime.bigint();
  for (const inputLine of inputCsv) {
    const [paymentGatewayToken, billingAgreementId] = inputLine;

    try {
      await sql.query(`UPDATE future_pay
                      SET paypal_billing_agreement_id = '${billingAgreementId}'
                      WHERE [future_pay_id] = '${paymentGatewayToken}';`);

      writeToOutputFile(
        outputProgressFilePath,
        `${paymentGatewayToken},${billingAgreementId},`
      );
      requestCount++;
    } catch (err) {
      writeToOutputFile(
        failedRetrievalFilePath,
        `${paymentGatewayToken},${billingAgreementId},`
      );
    }

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
