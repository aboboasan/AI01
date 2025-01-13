module.exports = {
  // ... existing code ...
  module: {
    rules: [
      // ... other rules ...
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/mammoth/,
          /node_modules\/lop/,
          /node_modules\/attr-accept/,
          /node_modules\/file-selector/
        ]
      }
    ]
  }
}; 