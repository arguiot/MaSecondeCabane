module.exports = {
    env: {
        STRIPE_PUBLIC: process.env.STRIPE_PUBLIC,
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
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
