const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            'flexible-nav/index': './src/block/flexible-nav/index.js',
            'flexible-breadcrumb/index': './src/block/flexible-breadcrumb/index.js',
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
                    // Flexible Nav Block
                    {
                        from: 'src/block/flexible-nav/block.json',
                        to: 'flexible-nav/block.json',

                    },
                    {
                        from: 'src/block/flexible-nav/index.css',
                        to: 'flexible-nav/index.css',
                    },
                    {
                        from: 'src/block/flexible-nav/style.css',
                        to: 'flexible-nav/style.css',
                    },
                    // Flexible Breadcrumb Block
                    {
                        from: 'src/block/flexible-breadcrumb/block.json',
                        to: 'flexible-breadcrumb/block.json',

                    },
                    {
                        from: 'src/block/flexible-breadcrumb/index.css',
                        to: 'flexible-breadcrumb/index.css',
                    },
                    {
                        from: 'src/block/flexible-breadcrumb/style.css',
                        to: 'flexible-breadcrumb/style.css',
                    },
                ],
            }),
        ],
        externals: {
            '@wordpress/blocks': {
                root: ['wp', 'blocks'],
                commonjs: '@wordpress/blocks',
                commonjs2: '@wordpress/blocks',
                amd: '@wordpress/blocks'
            },
            '@wordpress/i18n': {
                root: ['wp', 'i18n'],
                commonjs: '@wordpress/i18n',
                commonjs2: '@wordpress/i18n',
                amd: '@wordpress/i18n'
            },
            '@wordpress/block-editor': {
                root: ['wp', 'blockEditor'],
                commonjs: '@wordpress/block-editor',
                commonjs2: '@wordpress/block-editor',
                amd: '@wordpress/block-editor'
            },
            '@wordpress/components': {
                root: ['wp', 'components'],
                commonjs: '@wordpress/components',
                commonjs2: '@wordpress/components',
                amd: '@wordpress/components'
            },
            '@wordpress/element': {
                root: ['wp', 'element'],
                commonjs: '@wordpress/element',
                commonjs2: '@wordpress/element',
                amd: '@wordpress/element'
            },
            '@wordpress/api-fetch': {
                root: ['wp', 'apiFetch'],
                commonjs: '@wordpress/api-fetch',
                commonjs2: '@wordpress/api-fetch',
                amd: '@wordpress/api-fetch'
            },
        },
        devtool: isProduction ? false : 'source-map',
    };
}; 