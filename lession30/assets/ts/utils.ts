export var F8 = {
    createElement({ tagName, attrs, children }: Options): any {
        var element = document.createElement(tagName);

        if (attrs) {
            Object.assign(element, attrs);
        }

        if (children?.length) {
            element.append(...children.map(this.render.bind(this)));

        }
        return element;
    },

    render(child: Options | string | HTMLElement): any {
        if (typeof child !== 'object' || child instanceof HTMLElement) {
            return child;
        }
        return this.createElement(child);
    }
}

export type Options = {
    tagName: string,
    attrs: {
        [key: string]: string | number | Function
    },
    children?: (Options | string | HTMLElement)[];
}