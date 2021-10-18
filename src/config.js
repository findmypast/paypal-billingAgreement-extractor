const SQL_CONFIG_USER = "user";
const SQL_pASSWORD = "password";
const SQL_DATABASE = "database";
const SQL_SERVER = "server";

const createConfig = () => {
  if (process.env.NODE_ENV !== "production") {
    return {
      runtimeEnv: process.env.NODE_ENV || "Unknown",
      settingsName: "non-production",
      braintreeAccessToken: "paypal/tokens/fmp/gbp/integration",
    };
  } else {
    return {
      runtimeEnv: process.env.NODE_ENV || "Unknown",
      settingsName: "production",
      braintreeAccessToken: "paypal/tokens/fmp/gbp/production",
    };
  }
};

const sqlConfig = {
  user: SQL_CONFIG_USER,
  password: SQL_pASSWORD,
  database: SQL_DATABASE,
  server: SQL_SERVER,
};

module.exports = { createConfig, sqlConfig };
