const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//获取主机地址
var os = require('os');
function getLocalIps(flagIpv6) {
    var ifaces = os.networkInterfaces();
    var ips = [];
    var func = function(details) {
        if (!flagIpv6 && details.family === 'IPv6') {
            return;
        }
        if (details.address =='127.0.0.1') {
            return;
        }
        ips.push(details.address);
    };
    for (var dev in ifaces) {
        ifaces[dev].forEach(func);
    }
    return ips;
};


module.exports = {
    entry: {
        "app": path.resolve(__dirname, 'src/index.js'),
        "vendors": ['jquery','moment']
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // //这个使用uglifyJs压缩你的js代码
        new webpack.optimize.UglifyJsPlugin({ minimize: true }),

        //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),

        //把入口文件里面的"vendors"数组打包成verdors.js
        new webpack.optimize.CommonsChunkPlugin({
           name: 'vendors',
           filename: 'vendors.js'
        }),

        //css从js中提取出来，单独打包
        new ExtractTextPlugin({
            filename: '[name].css', //提取出来生成的css文件
            allChunks: true
        }),

        //生成HTML
        new HtmlWebpackPlugin({
            filename: 'index.html',//生成的html存放路径
            template: 'src/index.html',//
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
            }
        }),

        //启用热部署
        new webpack.HotModuleReplacementPlugin() // 启用 HMR  无需刷新
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),//服务器访问的目录
        port: 9900,
        host:getLocalIps[0],//修改host的地址为本机地址, 默认是localhost
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