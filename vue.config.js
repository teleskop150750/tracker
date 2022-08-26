// const StyleLintPlugin = require("stylelint-webpack-plugin");

module.exports = {
    devServer: {
        port: 4000,
    },
    configureWebpack: {
        plugins: [
            //   new StyleLintPlugin({
            //     files: ["src/**/*.{vue,css}"],
            //   }),
        ],
    },
}
