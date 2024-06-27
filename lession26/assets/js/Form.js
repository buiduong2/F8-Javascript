import { TabContentItem } from "./TabContent.js";
export class Form extends TabContentItem {
    constructor(el, formGroups) {
        super(el);
        this.formGroups = formGroups;
    }
    mount() {
        super.mount();
        var _this = this;
        this.el.onsubmit = function (e) {
            var _a;
            e.preventDefault();
            if (_this.validate()) {
                (_a = _this.onsubmit) === null || _a === void 0 ? void 0 : _a.call(_this, _this.collectData());
            }
        };
    }
    validate() {
        return this.formGroups.every(function (group) {
            return group.validate();
        });
    }
    collectData() {
        return this.formGroups.map(function (group) {
            return group.inputEl;
        }).reduce(function (res, inputEl) {
            res[inputEl.name] = inputEl.value;
            return res;
        }, {});
    }
}
export class FormGroup extends TabContentItem {
    constructor(el, contraints) {
        super(el);
        this.inputEl = el.querySelector("input");
        this.msgEl = el.querySelector("p");
        this.constraints = contraints;
        var _this = this;
        this.constraints
            .map(function (contraint) {
            if (!contraint.options) {
                contraint.options = {};
            }
            return contraint.options;
        })
            .forEach(function (options) {
            var _a;
            options.label = (_a = options.label) !== null && _a !== void 0 ? _a : _this.inputEl.name;
        });
    }
    validate() {
        if (this.validation && this.constraints) {
            var message = this.validation.validate(this.inputEl.value, this.constraints);
            if (message) {
                this.showError(message);
            }
            else {
                this.clearError();
            }
        }
        return true;
    }
    showError(message) {
        this.el.classList.add("error");
        this.msgEl.innerText = message;
    }
    clearError() {
        this.el.classList.remove("error");
        this.msgEl.innerText = "";
    }
    mount() {
        super.mount();
        var _this = this;
        this.inputEl.oninput = function () {
            _this.validate();
        };
        this.inputEl.onblur = function () {
            _this.validate();
        };
    }
    destroy() {
        super.destroy();
        this.clearError();
        this.inputEl.value = "";
    }
}
export class FormPasswordGroup extends FormGroup {
    constructor(el, constraints) {
        super(el, constraints);
        this.showPasswordBtnEl = el.querySelector("button");
        this.showPasswordIconEl = el.querySelector("button > *");
        this.showPassword = false;
    }
    set isShowPassword(value) {
        this.showPassword = value;
        this.changeIsShowPassword();
    }
    get isShowPassword() {
        return this.showPassword;
    }
    mount() {
        super.mount();
        var _this = this;
        this.showPasswordBtnEl.onclick = function (e) {
            e.preventDefault();
            _this.isShowPassword = !_this.isShowPassword;
        };
    }
    destroy() {
        super.destroy();
        this.isShowPassword = false;
    }
    changeIsShowPassword() {
        if (this.showPassword) {
            this.inputEl.type = 'text';
            this.showPasswordIconEl.classList.replace("fa-eye", "fa-eye-slash");
        }
        else {
            this.inputEl.type = "password";
            this.showPasswordIconEl.classList.replace("fa-eye-slash", "fa-eye");
        }
    }
}
