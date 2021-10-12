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

module.exports = { createConfig };
