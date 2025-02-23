module.exports = {
    // set your styleguidist configuration here
    title: 'Default Style Guide',
    components: 'src/runtime/components/**/[A-Z]*.vue',
    // defaultExample: true,
    // sections: [
    //   {
    //     name: 'First Section',
    //     components: 'src/components/**/[A-Z]*.vue'
    //   }
    // ],
    webpackConfig: {
        module: {
            rules: [
                // Vue loader
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    loader: 'vue-loader',
                },
                // Babel loader, will use your project’s .babelrc
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                // Other loaders that are needed for your components
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
        },
    },
    exampleMode: 'expand',
}
