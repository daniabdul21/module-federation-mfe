/** @type {import('next').NextConfig} */
const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

const nextConfig = {
  reactStrictMode: true,
  basePath: "/base-path",
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(css|s[ac]ss)$/i,
      use: ["style-loader", "css-loader", "postcss-loader"],
    });
    config.target = "web";

    config.plugins.push(
      new NextFederationPlugin({
        name: <%= name %>,
        filename: "static/chunks/remoteEntry.js",
        remotes: {},
        exposes: {
          // expose pages/style/component/function you wanted
        },
        extraOptions: {},
        shared: {
          "@ordentco/addons-auth-provider": {
            singleton: true,
            eager: false,
            requiredVersion: false,
          },
          ni18n: {
            singleton: true,
            eager: false,
            requiredVersion: false,
          },
          i18next: {
            singleton: true,
            eager: false,
            requiredVersion: false,
          },
          "react-i18next": {
            singleton: true,
            eager: false,
            requiredVersion: false,
          },
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
