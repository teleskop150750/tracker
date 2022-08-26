const { propertyOrdering, selectorOrdering } = require('stylelint-semantic-groups')

module.exports = {
    plugins: ['stylelint-order', 'stylelint-color-format', 'stylelint-declaration-block-no-ignored-properties', 'stylelint-prettier'],
    extends: ['stylelint-config-standard', 'stylelint-config-html/vue', 'stylelint-prettier/recommended', 'stylelint-config-prettier'],
    rules: {
        'color-format/format': {
            format: 'hsl',
        },
        'color-function-notation': 'modern',
        'plugin/declaration-block-no-ignored-properties': true,
        'order/order': selectorOrdering,
        'order/properties-order': propertyOrdering,
        'declaration-empty-line-before': [
            'always',
            {
                ignore: ['after-comment', 'after-declaration', 'first-nested', 'inside-single-line-block'],
            },
        ],

        'length-zero-no-unit': [
            true,
            {
                ignore: ['custom-properties'],
            },
        ],
        // 'declaration-colon-newline-after': 'always-multi-line',
        'selector-class-pattern': '^.*$',
        'prettier/prettier': true,
    },
}
