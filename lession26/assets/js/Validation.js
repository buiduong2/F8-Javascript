export class Validation {
    constructor() {
        this.rules = {
            required: function (value) {
                return !!value && value.trim().length > 0;
            },
            between: function (value, options) {
                if (value) {
                    return value.length >= Number(options.min) && value.length <= Number(options.max);
                }
                return true;
            },
            email: function (value, options) {
                if (value) {
                    if (options.regExp) {
                        return options.regExp.test(value);
                    }
                    return value.includes("@") && value.includes(".");
                }
                return true;
            }
        };
        this.messages = {
            required: "${label} must not be null nor empty",
            between: "${label} 's length must be between ${min} and ${max}",
            email: "Email invalidate"
        };
    }
    validate(value, contrants) {
        var _a, _b;
        var _this = this;
        var contraint = contrants.find(function (contraint) {
            return !_this.isContrantValid(value, contraint);
        });
        if (!contraint)
            return "";
        var message = (_b = (_a = contraint.message) !== null && _a !== void 0 ? _a : this.messages[contraint.rule]) !== null && _b !== void 0 ? _b : '';
        return this.resolveMessage(message, contraint.options);
    }
    isContrantValid(value, contrant) {
        var ruleName = contrant.rule;
        var options = contrant.options;
        if (ruleName in this.rules) {
            return this.rules[ruleName](value, options);
        }
        else {
            throw new TypeError("Rule Name is not Exists");
        }
    }
    resolveMessage(message, options) {
        while (message.includes("${")) {
            var startIndex = message.indexOf("${");
            var endIndex = message.indexOf("}") + 1;
            var express = message.slice(startIndex + 2, endIndex - 1);
            message = message.substring(0, startIndex) + options[express] + message.substring(endIndex);
        }
        return message;
    }
}
