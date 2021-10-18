const braintree = require("braintree");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const sql = require("mssql");

// import { parse } from "csv-parse/sync";
import { sqlConfig } from "./config";

// Load a whole file into memory

// do a search

// process result

//move onto the next one.

const main = async (inputFilename) => {
  var inputFile = fs.readFileSync(`./${inputFilename}`);
  var tokens = parse(inputFile);

  let inputCount = tokens.length;
  let requestCount = 1;
  let outputCount = 1;
  let failedCount = 0;

  // Establish a connection to Braintree Gateway
  var gateway = new braintree.BraintreeGateway({
    //token value, stored in vault, integration token found at the following location
    accessToken: "paypal/tokens/fmp/gbp/integration",
  });
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  for (const token of tokens) {
    if (requestCount % 10 === 0) {
      await timer(1000);
    }

    const customerStream = gateway.customer.search(
      (search) => {
        // Examples of actual payment tokens can be found in the futurepay table.
        search.paymentMethodToken().is(token[0]);
      },
      (err, response) => {
        response.first((err, customer) => {
          //console.log(err);
          if (customer) {
            process.stdout.write(
              `${outputCount++} ${token[0]} ${
                customer.paypalAccounts[0].billingAgreementId
              }\n`
            );
          } else {
            console.log(`${outputCount++} ${token[0]}`);
            failedCount++;
          }
        });
      }
    );

    // customerStream.on("readable", () => {
    //   const customer = customerStream.read();

    //   if (customer) {
    //     process.stdout.write(
    //       `${outputCount++} ${token[0]} ${
    //         customer.paypalAccounts[0].billingAgreementId
    //       }\n`
    //     );
    //   } else {
    //     console.log(`failed: ${failedCount++}`);
    //   }

    //   // process.stdout.write(
    //   //         `${outputCount++} ${token[0]} ${
    //   //           customer.paypalAccounts[0].billingAgreementId
    //   // )
    // });

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

//  Populate db
// async () => {
//   try {
//     await sql.connect(sqlConfig);
//     const result =
//       await sql.query`INSERT INTO [HappyGeneral_integration].[dbo].[future_pay](paypal_billing_agreement_id)
//     VALUES ('')
//     WHERE future_pay_id = 'asdqwe'`;
//     console.dir(result);
//   } catch (err) {
//     // ... error checks
//   }
// };
