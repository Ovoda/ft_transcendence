const path = require('path');
module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.alias,
            'style': path.resolve(__dirname, 'src/shared/stylesheets'),
        },
    };
    return config;
};