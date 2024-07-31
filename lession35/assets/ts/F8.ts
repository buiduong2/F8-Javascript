import { Component } from "./Component.js"

export class F8 {
    static component(componentName: string, options: Options): void {

        customElements.define(componentName, class extends Component {

            getTemplate(): string {
                return options.template;
            }
            getData(): any {
                return options.data();
            }
        });
    }
}

type Options = {
    data: () => Data
    template: string
}

export type Data = { [key: string]: any }