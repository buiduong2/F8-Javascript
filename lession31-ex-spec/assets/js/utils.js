export var F8 = {
    createElement(options) {
        var el = document.createElement(options.tagName);
        if (options.attrs) {
            Object.assign(el, options.attrs);
        }
        el.append(...options.children.map(this.render));
        return el;
    },
    render(child) {
        if (typeof child !== 'object' || child instanceof HTMLElement) {
            return child;
        }
        return this.createElement(child);
    }
};
export function debounce(fn, delay) {
    var isReady = true;
    return function (...args) {
        if (isReady) {
            isReady = false;
            setTimeout(function () {
                isReady = true;
            }, delay);
            return fn(...args);
        }
    };
}
export var dragManager = (function () {
    var dragHorizontalIntances = [];
    var dragVertitalIntances = [];
    function beginListner() {
        var mouseMoveHandler = function (e) {
            if (!dragHorizontalIntances.length || !dragVertitalIntances.length) {
                document.removeEventListener("mousemove", mouseMoveHandler);
            }
            if (e.clientX !== dragHorizontalIntances[0].getInitialClient()) {
                dragVertitalIntances.forEach(function (item) {
                    item.cancelDrag();
                });
            }
            else if (e.clientY !== dragVertitalIntances[0].getInitialClient()) {
                dragHorizontalIntances.forEach(function (item) {
                    item.cancelDrag();
                });
            }
            document.removeEventListener("mousemove", mouseMoveHandler);
            dragHorizontalIntances = [];
            dragVertitalIntances = [];
        };
        document.addEventListener("mousemove", mouseMoveHandler);
    }
    function addDragHorizontalIntance(instance) {
        dragHorizontalIntances.push(instance);
        beginListner();
    }
    function addDragVertitalIntance(instance) {
        dragVertitalIntances.push(instance);
        beginListner();
    }
    return {
        addDragHorizontalIntance,
        addDragVertitalIntance
    };
})();
