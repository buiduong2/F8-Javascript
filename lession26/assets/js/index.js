import { Form, FormGroup, FormPasswordGroup } from "./Form.js";
import { Modal } from "./Modal.js";
import { Tab } from "./Tab.js";
import { TabAction, TabActionItem } from "./TabAction.js";
import { TabContent } from "./TabContent.js";
import { Validation } from "./Validation.js";
var formLoginContraints = {
    email: [
        { rule: "required", }, { rule: "email" }
    ],
    password: [
        { rule: "required", },
        { rule: "between", options: { min: 6, max: 20 } }
    ]
};
var formRegisterContraints = {
    fullname: [
        { rule: "required" }
    ],
    email: [
        { rule: "required", },
        { rule: "email" }
    ],
    password: [
        { rule: "required", },
        { rule: "between", options: { min: 6, max: 20 } }
    ]
};
var validation = new Validation();
var formLogin = getForm("form", formLoginContraints);
var formRegister = getForm("form:last-of-type", formRegisterContraints);
var modal = getModal();
var tabContent = getTabContent([formLogin, formRegister]);
var tabAction = getTabAction();
var tab = getTab(tabAction, tabContent);
var hierarchy = {
    ref: modal,
    children: [
        {
            ref: tab,
            children: [
                {
                    ref: tabAction,
                    children: tabAction.tabActionItems.map(item => ({ ref: item }))
                },
                {
                    ref: tabContent,
                    children: [
                        {
                            ref: formLogin,
                            children: formLogin.formGroups.map(item => ({ ref: item }))
                        },
                        {
                            ref: formRegister,
                            children: formRegister.formGroups.map(item => ({ ref: item }))
                        }
                    ]
                }
            ]
        }
    ]
};
makeRelation(hierarchy);
hierarchy.ref.mount();
function makeRelation(hierarchy, parent) {
    var _a;
    var current = hierarchy.ref;
    var children = hierarchy.children;
    current.parent = parent;
    current.chidren = (_a = hierarchy.children) === null || _a === void 0 ? void 0 : _a.map(function (child) {
        return child.ref;
    });
    children === null || children === void 0 ? void 0 : children.forEach(function (child) {
        makeRelation(child, current);
    });
}
function getForm(selector, formConstraint) {
    var formEl = document.querySelector(selector);
    var formGroups = [];
    formEl === null || formEl === void 0 ? void 0 : formEl.querySelectorAll(".form-group").forEach(node => {
        var name = node.querySelector("input").name;
        var formGroup;
        if (name === 'password') {
            formGroup = new FormPasswordGroup(node, formConstraint[name]);
        }
        else {
            formGroup = new FormGroup(node, formConstraint[name]);
        }
        formGroup.validation = validation;
        formGroups.push(formGroup);
    });
    return new Form(formEl, formGroups);
}
function getTabContent(tabContentItems) {
    var tabContentEl = document.querySelector(".tab-content");
    return new TabContent(tabContentEl, tabContentItems);
}
function getTabAction() {
    var tabActionEl = document.querySelector(".tab-list");
    var tabActionItemEls = tabActionEl.querySelectorAll(".tab-item");
    var tabActionItems = Array.from(tabActionItemEls).map(function (item) {
        return new TabActionItem(item);
    });
    return new TabAction(tabActionEl, tabActionItems);
}
function getTab(tabAction, tabContent) {
    var tabEl = document.querySelector(".modal");
    return new Tab(tabEl, tabAction, tabContent);
}
function getModal() {
    var flagOpen = { value: false };
    var modalEl = document.querySelector(".modal");
    var btnCloseEl = document.querySelector(".modal-open-btn");
    var modal = new Modal(modalEl, flagOpen);
    flagOpen = modal.flagOpen;
    btnCloseEl.onclick = function () {
        flagOpen.value = true;
    };
    document.onkeyup = function (e) {
        if (e.key === 'Escape') {
            modal.flagOpen.value = false;
        }
    };
    return modal;
}
