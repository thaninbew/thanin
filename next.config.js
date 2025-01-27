module.exports = {
  experimental: {
    appDir: true,
    esmExternals: false
  },
  webpack: (config) => {
    // Remove existing CSS rules
    config.module.rules = config.module.rules.filter(
      (rule) => !rule.test?.test('.css')
    );

    // Add new CSS handling
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
              localIdentName: '[local]--[hash:base64:5]'
            },
            importLoaders: 1
          }
        }
      ]
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "img-src 'self' data: *"
          }
        ]
      }
    ];
  }
}; 