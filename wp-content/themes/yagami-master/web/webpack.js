const path                    = require('path');
const webpack                 = require('webpack');
const requireYaml             = require('require-yaml');
const webpackConfig           = require('./webpack.yaml');
const autoprefixer            = require('autoprefixer');
const StyleLintPlugin         = require('stylelint-webpack-plugin');
const UglifyJsPlugin          = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin    = require("mini-css-extract-plugin");
const CleanWebpackPlugin      = require('clean-webpack-plugin');
const BrowserSyncPlugin       = require('browser-sync-webpack-plugin');
const WebpackNotifierPlugin   = require('webpack-notifier');


const webpackConfiguration = function (env, options) {

    const { mode } = options;
    const devMode  = mode === 'development';
    const prodMode = mode === 'production';


    /*
    |-----------------------
    |
    |   Entries & Outputs
    |
    |-----------------------
    |
    */
    let entries = webpackConfig.entry_points;
    let output = {
        path: path.resolve(webpackConfig.output.path),
        filename: '[name].js'
    }


    /*
    |-----------------------
    |
    |        Aliases
    |
    |-----------------------
    |
    */
    let aliases = {};
    let aliasConfig = webpackConfig.alias;
    for (alias in aliasConfig) {
        if (aliasConfig.hasOwnProperty(alias)) {
            aliases[alias] = path.resolve(aliasConfig[alias])
        }
    }


    /*
    |-----------------------
    |
    |        Loaders
    |
    |-----------------------
    |
    */
    let loaders = [];


    /*
    |
    | EsLint Loader
    |----------------
    |
    */
    if (devMode) {
        if (webpackConfig.linters.js) {
            loaders.push({
                enforce: 'pre',
                test: /\.js$/,
                exclude: [/node_modules/, /lib/],
                loader: 'eslint-loader',
                options: {
                    configFile: '.eslintrc',
                    quite: false,
                    failOnWarning: false,
                    failOnError: false
                }
            })
        }
    }

    /*
    |
    | Babel Loader
    |---------------
    |
    */
    loaders.push({
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'babel-loader'
        }]
    });

    /*
    |
    | CSS Loaders
    |---------------------
    |
    */
    let cssLoaders = [{
        loader: 'css-loader',
        options: {
            importLoaders: 1,
            minimize: prodMode,
            sourceMap: devMode
        }
    }];

    if (prodMode) {
        cssLoaders.push({
            loader: 'postcss-loader',
            options: {
                plugins: (loader) => [autoprefixer({
                    browsers: ["> 1%", "last 5 versions", "ie > 8"]
                })]
            }
        });
    }

    loaders.push({
        test: /\.css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            ...cssLoaders,

        ]
    });

    /*
    |
    | SASS Loaders
    |---------------------
    |
    */
    loaders.push({
        test: /\.scss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            ...cssLoaders,
            {
                loader: "sass-loader",
                options: {
                    sourceMap: true
                }
            }
        ]
    });

    /*
    |
    | File Loader: Images
    |----------------------
    |
    */
    loaders.push({
        test: /\.(png|jpe?g|gif|jpg|svg)(\?.*)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: webpackConfig.output.resources.img + '/[name].[ext]',
            }
        }]
    });

    /*
    |
    | File Loader: Fonts
    |---------------------
    |
    */
    loaders.push({
        test: /\.(woff2?|eot|ttf|otf|wav)(\?.*)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: webpackConfig.output.resources.fonts + '/[name].[ext]'
            }
        }]
    });


    /*
    |
    | File Loader: Glsl
    |---------------------
    |
    */
    loaders.push({
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
    });


    /*
    |
    | Imports Loader: Fonts
    |------------------------
    |
    */
    loaders.push({
        test: /\.js$/,
        use: [{
            loader: 'imports-loader?define=>false'
        }]
    });


    /*
    |-----------------------
    |
    |        Plugins
    |
    |-----------------------
    |
    */
    let plugins = [];

    /*
    |
    | ExtractTextPlugin
    |--------------------
    |
    */
    plugins.push(new MiniCssExtractPlugin({
        filename: webpackConfig.output.resources.css + '/[name].css'
    }))

    /*
    |
    | ProvidePlugin
    |----------------
    |
    */
    plugins.push(new webpack.ProvidePlugin(webpackConfig.global_plugins));

    /*
    |
    | NotifierPlugin
    |-----------------
    |
    */
    plugins.push(new WebpackNotifierPlugin({
        title: 'MKX',
        contentImage: path.join(__dirname, webpackConfig.notifier_logo_path),
        alwaysNotify: true
    }));

    /*
    |
    | BrowserSyncPlugin
    |--------------------
    |
    */
    if (devMode) {
        if (webpackConfig.browserSync.use) {
            plugins.push(new BrowserSyncPlugin({
                proxy: webpackConfig.browserSync.proxy,
                files: webpackConfig.browserSync.watch,
                notify: false
            }));
        }
    }

    /*
    |
    | CleanWebpackPlugin
    |---------------------
    |
    */
    if (prodMode) {
        plugins.push(new CleanWebpackPlugin(webpackConfig.clean.folders, {
            root: path.resolve(webpackConfig.clean.root),
            verbose: true,
            dry: false
        }))
    }

    /*
    |
    | StyleLintPlugin
    |---------------------
    |
    */
    if (devMode) {
        if (webpackConfig.linters.scss) {
            plugins.push(new StyleLintPlugin({
                syntax: 'scss',
                configFile: '.stylelintrc',
                failOnError: false,
                emitErrors: false,
                quiet: false
            }));
        }
    }


    /*
    |-----------------------
    |
    |        Minimizers
    |
    |-----------------------
    |
    */
    let minimizers = [];

    if (prodMode) {
        minimizers.push(new UglifyJsPlugin({
            cache: true,
            //parallel: true,
            //sourceMap: true,
            uglifyOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
        }))

        minimizers.push(new OptimizeCSSAssetsPlugin({

        }))
    }

    return {
        entry       : entries,
        output      : output,
        resolve     : { alias: aliases },
        module      : { rules: loaders },
        plugins     : plugins,
        optimization: { minimizer: minimizers },
        devtool     : 'cheap-module-source-map'
    };
}

module.exports = webpackConfiguration;
