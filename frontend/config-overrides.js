const path = require('path');
module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.alias,
            'style': path.resolve(__dirname, 'src/shared/stylesheets'),
            'enums': path.resolve(__dirname, 'src/shared/enums'),
            'services': path.resolve(__dirname, 'src/services'),
            'features': path.resolve(__dirname, 'src/features'),
            'assets': path.resolve(__dirname, 'src/assets'),
            'images': path.resolve(__dirname, 'src/shared/images'),
        },
    };
    return config;
};