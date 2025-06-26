const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            index: './src/block/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: 'src/block/block.json',
                        to: 'block.json',
                    },
                    {
                        from: 'src/block/index.css',
                        to: 'index.css',
                    },
                    {
                        from: 'src/block/style.css',
                        to: 'style.css',
                    },
                ],
            }),
        ],
        externals: {
            '@wordpress/blocks': ['wp', 'blocks'],
            '@wordpress/i18n': ['wp', 'i18n'],
            '@wordpress/block-editor': ['wp', 'blockEditor'],
            '@wordpress/components': ['wp', 'components'],
            '@wordpress/element': ['wp', 'element'],
            '@wordpress/api-fetch': ['wp', 'apiFetch'],
        },
        devtool: isProduction ? false : 'source-map',
    };
}; 