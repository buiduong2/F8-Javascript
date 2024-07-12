
export var F8 = {
    createElement(options: ElementOptions): HTMLElement {
        var el = null;
        if (options.tagName) {
            el = document.createElement(options.tagName)
        } else if (options.el) {
            el = options.el
        } else {
            throw new Error("Error Element does not created");
        }
        if (options.attrs) {
            Object.assign(el, options.attrs);
        }

        el.append(...options.children.map(this.render.bind(this)));

        return el;
    },

    render(child: string | ElementOptions | HTMLElement) {
        if (typeof child !== 'object' || child instanceof HTMLElement) {
            return child;
        }

        return this.createElement(child);
    }
}

type ElementOptions = {
    tagName?: string,
    el?: HTMLElement;
    attrs?: { [key: string]: string | Function };
    children: (string | ElementOptions | HTMLElement)[]
}

export function debounce(fn: Function, delay: number) {
    var isReady = true;
    return function (...args: any[]) {
        if (isReady) {
            isReady = false;
            setTimeout(function () {
                isReady = true;
            }, delay);
            return fn(...args);
        }
    }
}

export var dragManager = (function () {
    var dragHorizontalIntances: DragIntanceCancelAble[] = [];
    var dragVertitalIntances: DragIntanceCancelAble[] = [];

    function beginListner() {
        var mouseMoveHandler = function (e: MouseEvent) {
            if (!dragHorizontalIntances.length || !dragVertitalIntances.length) {
                document.removeEventListener("mousemove", mouseMoveHandler);
                return;
            }
            if (e.clientX !== dragHorizontalIntances[0].getInitialClient()) {
                dragVertitalIntances.forEach(function (item) {
                    item.cancelDrag();
                })
            } else if (e.clientY !== dragVertitalIntances[0].getInitialClient()) {
                dragHorizontalIntances.forEach(function (item) {
                    item.cancelDrag();
                })
            }
            document.removeEventListener("mousemove", mouseMoveHandler);

        }
        document.addEventListener("mousemove", mouseMoveHandler);
    }

    function addDragHorizontalIntance(instance: DragIntanceCancelAble) {
        dragHorizontalIntances.push(instance);
        beginListner();
    }

    function addDragVertitalIntance(instance: DragIntanceCancelAble) {
        dragVertitalIntances.push(instance)
        beginListner();
    }

    function clearIntance() {
        dragHorizontalIntances = [];
        dragVertitalIntances = [];
    }
    return {
        addDragHorizontalIntance,
        addDragVertitalIntance,
        clearIntance
    }
})()


interface DragIntanceCancelAble {

    getInitialClient(): number;

    cancelDrag(): void;
}