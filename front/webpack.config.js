module.exports = {
  mode: 'development',
  entry: './src/tsx/index.tsx',
  output: {
    path: `${__dirname}/dist`,
    filename: 'index.js'
  },
  module: {
  // {
  //   loader: 'postcss-loader',
  //   options: {
  //     postcssOptions: {
  //       ident: 'postcss',
  //       plugins: [
  //         require('tailwindcss'),
  //         require('autoprefixer'),
  //       ],
  //     } 
  //   },
  // }
  // {
    rules : [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: 'css-loader', options: { importLoaders: 1} },
          'postcss-loader',
        ]
      },
      {
        test: /\.tsx$/,
        use: 'ts-loader',
      }
    ],
    
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.tsx'
    ]
  }
}