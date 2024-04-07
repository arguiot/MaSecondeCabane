module.exports = {
    env: {
        STRIPE_PUBLIC: process.env.STRIPE_PUBLIC,
    },
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            crypto: require.resolve("crypto-browserify"),
            os: false,
            path: false,
            stream: false,
            net: false,
            tls: false,
            zlib: false,
            http: false,
            https: false,
            perf_hooks: false,
        };
        config.externals.push(
            "pino-pretty",
            "lokijs",
            "encoding",
            "bufferutil",
            "utf-8-validate",
        );

        return config;
    },
    i18n: {
        locales: ['en-CA', 'fr-CA'],
        defaultLocale: 'fr-CA',
    },
};
