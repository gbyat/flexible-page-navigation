const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            index: './src/index.js',
            frontend: './src/frontend.js',
            admin: './src/admin.js',
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
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/block.json', to: '.' },
                    { from: 'src/index.css', to: '.' },
                    { from: 'src/style.css', to: '.' },
                ],
            }),
        ],
        externals: {
            '@wordpress/blocks': ['wp', 'blocks'],
            '@wordpress/block-editor': ['wp', 'blockEditor'],
            '@wordpress/components': ['wp', 'components'],
            '@wordpress/compose': ['wp', 'compose'],
            '@wordpress/data': ['wp', 'data'],
            '@wordpress/element': ['wp', 'element'],
            '@wordpress/i18n': ['wp', 'i18n'],
            '@wordpress/rich-text': ['wp', 'richText'],
            '@wordpress/api-fetch': ['wp', 'apiFetch'],
            'jquery': 'jQuery',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.css'],
        },
        devtool: isProduction ? false : 'source-map',
        optimization: {
            minimize: isProduction,
        },
    };
}; 