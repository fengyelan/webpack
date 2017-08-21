const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    entry: {
        "app": path.resolve(__dirname, 'src/index.js')
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // //这个使用uglifyJs压缩你的js代码
         new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        // //把入口文件里面的数组打包成verdors.js "vendors"数组中有两个以上的元素用这个。。。。，一个的话可以先注释
        // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        // 
        
        //提取css
         new ExtractTextPlugin("styles.css"),

        //生成HTML
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),

        //启用热部署
        new webpack.HotModuleReplacementPlugin() // 启用 HMR  无需刷新
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 9900,
        hot: true // 告诉 dev-server 我们在使用 HMR
    },
    module: {
        rules: [{
            test: /\.scss$/,
             use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader', 'sass-loader']
            })
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'url-loader?limit=8192'
            ]
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'app'),
            query: {
                presets: ['es2015']
            }
        }]
    }
}
