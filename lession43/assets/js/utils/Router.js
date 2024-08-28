import { store } from "../index.js";
import { PageAbstract } from "../pages/PageAbstract.js";
export class Router {
    constructor(routes, rootEl) {
        this.routes = routes;
        this.appViewEl = rootEl.querySelector("app-view");
    }
    init() {
        this.defineCustomeElement();
        this.renderPageFromHash();
    }
    defineCustomeElement() {
        const tagNames = new Set();
        this.routes.forEach(route => {
            const tagName = ("view" + "-" + route.ctor.name).toLowerCase();
            if (tagNames.has(tagName))
                return;
            tagNames.add(tagName);
            customElements.define(tagName, route.ctor);
        });
    }
    renderPageFromHash() {
        const [, path, id] = window.location.hash.split("/");
        const route = this.routes.find(route => route.path === "/" + path);
        if (route) {
            const canGoNext = this.filterRoute(route);
            if (canGoNext) {
                this.push({ name: route.name, params: { id } });
            }
        }
        else {
            this.push({ name: "Blog" });
        }
    }
    async push(opt) {
        const nextRoute = this.getRouteByName(opt.name);
        if (nextRoute.dynamic && !opt.params?.id)
            throw new Error("Dynamic Route need An id");
        let nextPage;
        if (nextRoute.dynamic) {
            nextPage = PageAbstract.getNewIntance(nextRoute.ctor);
        }
        else {
            nextPage = PageAbstract.getIntance(nextRoute.ctor);
        }
        this.scrollToTop();
        let canGoToRoute = this.filterRoute(nextRoute, opt);
        if (!canGoToRoute || this.currentPage === nextPage)
            return;
        if (nextRoute.dynamic && opt.params?.id) {
            this.prop = { id: opt.params.id };
        }
        else {
            this.prop = {};
        }
        this.decoratorHref(nextRoute, opt);
        await nextPage.beforeRender();
        const parent = this.currentPage?.parentElement || this.appViewEl.parentElement;
        if (this.currentPage) {
            await this.currentPage.beforeDisconnected();
        }
        parent.removeChild(this.currentPage || this.appViewEl);
        parent.appendChild(nextPage);
        this.currentPage = nextPage;
    }
    filterRoute(route, opt) {
        if (route.meta?.auth === "guest" && store.isAuth) {
            this.push({ name: "Blog" });
            return false;
        }
        if (route.meta?.auth === "auth" && !store.isAuth) {
            const query = { redirectTo: route.name };
            if (opt?.params?.id) {
                query.id = opt.params.id;
            }
            this.push({ name: "Login", query });
            return false;
        }
        return true;
    }
    decoratorHref(route, opt) {
        let hash = route.path;
        if (route.dynamic) {
            hash += "/" + opt.params?.id;
        }
        if (opt.query) {
            hash += "?" + new URLSearchParams(Object.entries(opt.query)).toString();
        }
        window.location.hash = hash;
    }
    getRouteByName(name) {
        const route = this.routes.find(r => r.name === name);
        if (route) {
            return route;
        }
        else {
            throw new Error("Route not found");
        }
    }
    scrollToTop() {
        const navEl = document.querySelector("the-nav-bar");
        let top = 0;
        if (navEl) {
            top = navEl.clientTop + navEl.clientHeight;
        }
        window.scrollTo({
            behavior: "smooth",
            top,
        });
    }
    static createRouter(routes, rootEl) {
        this.intance = new Router(routes, rootEl);
        this.intance.init();
    }
    static getIntance() {
        if (!this.intance)
            throw new Error("Must call CreateRouter First. To setup Before get intance");
        return this.intance;
    }
}
