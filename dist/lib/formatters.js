"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatNumber = formatNumber;
exports.formatPrice = formatPrice;
var CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
});
function formatCurrency(amount) {
    return CURRENCY_FORMATTER.format(amount);
}
var NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
function formatNumber(number) {
    return NUMBER_FORMATTER.format(number);
}
function formatPrice(price, options) {
    if (options === void 0) { options = {}; }
    var _a = options.currency, currency = _a === void 0 ? "KRW" : _a, _b = options.notation, notation = _b === void 0 ? "standard" : _b;
    var numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: currency,
        notation: notation,
        maximumFractionDigits: 0,
    }).format(numericPrice);
}
