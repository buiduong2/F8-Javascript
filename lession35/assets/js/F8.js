import { Component } from "./Component.js";
export class F8 {
    static component(componentName, options) {
        customElements.define(componentName, class extends Component {
            getTemplate() {
                return options.template;
            }
            getData() {
                return options.data();
            }
        });
    }
}
