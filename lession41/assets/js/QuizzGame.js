import { PreparePage } from "./PagePrepare.js";
export class QuizzApp {
    constructor(el) {
        this.el = el;
        this.mainContentEl = this.el.querySelector(".main-content");
        this.totalQuestion = 10;
        this.currentPage = new PreparePage(this, { totalQuestion: this.totalQuestion });
        this.init();
    }

    init() {
        this.currentPage.render();
    }
    
    goNextPage(data, nextPageCon) {
        this.currentPage.remove()
            .then(() => {
            const nextPage = new nextPageCon(this, data);
            this.currentPage = nextPage;
            this.currentPage.render();
        });
    }
}
