module.exports = {
    transpileDependencies: [
        'vuetify'
    ],

    configureWebpack: config => {
        config.resolve.fallback = { url: require.resolve("url/") };
    }
}
