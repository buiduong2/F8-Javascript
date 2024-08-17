"use strict";
document.addEventListener("DOMContentLoaded", function () {
    let coverMoveEvent = new Event("cover.move");
    const imgZoomWrappers = document.querySelectorAll(".img-zoom-wrapper");
    imgZoomWrappers.forEach(wrapper => {
        const baseItem = wrapper.querySelector(".img--base");
        const zoomedItem = wrapper.querySelector(".img--zoom");
        const zoomCover = wrapper.querySelector(".zoom-cover");
        const scale = Number(wrapper.getAttribute("data-scale"));
        addZoomImageBehavior(baseItem, zoomCover, zoomedItem, scale);
    });
    function addZoomImageBehavior(baseItem, cover, zoomedItem, scale) {
        if (!zoomedItem.parentElement)
            throw new Error("Zoomed Item must be wrapped");
        if (!baseItem.parentElement)
            throw new Error("Base Item Must have a wrapper");
        const baseWrapper = baseItem.parentElement;
        const zoomWrapper = zoomedItem.parentElement;
        zoomedItem.src = baseItem.src;
        addWrapperInfo();
        addZoomedItemInfo();
        addZoomCoverInfo();
        addMoveoverBaseItemBehavior();
        addMoveZoomedItemBehavior();
        function addWrapperInfo() {
            if (zoomWrapper.style.position.trim().length === 0 || zoomWrapper.style.position === 'static') {
                zoomWrapper.style.position = "relative";
            }
            zoomWrapper.style.width = (zoomWrapper.clientWidth) + "px";
            zoomWrapper.style.height = (zoomWrapper.clientHeight) + "px";
            zoomWrapper.style.overflow = "hidden";
            if (baseWrapper.style.position.trim().length === 0 || baseWrapper.style.position === 'static') {
                baseWrapper.style.position = "relative";
            }
        }
        function addZoomedItemInfo() {
            zoomedItem.style.position = 'absolute';
            zoomedItem.style.height = scale * baseItem.clientHeight + "px";
            zoomedItem.style.width = scale * baseItem.clientWidth + "px";
        }
        function addZoomCoverInfo() {
            cover.style.position = "absolute";
            cover.style.width = zoomWrapper.clientWidth / scale + "px";
            cover.style.height = zoomWrapper.clientHeight / scale + "px";
        }
        function addMoveZoomedItemBehavior() {
            cover.addEventListener("cover.move", function (e) {
                zoomedItem.style.top = -1 * (cover.offsetTop * scale) + "px";
                zoomedItem.style.left = -1 * (cover.offsetLeft) * scale + "px";
            });
        }
        function addMoveoverBaseItemBehavior() {
            baseItem.addEventListener("mouseenter", function (e) {
                cover.style.display = "block";
                document.addEventListener("mousemove", dragEvent);
            });
            function dragEvent(e) {
                let top;
                let left;
                const baseItemBoundaries = {
                    top: baseItem.getBoundingClientRect().top,
                    bottom: baseItem.getBoundingClientRect().bottom,
                    left: baseItem.getBoundingClientRect().left,
                    right: baseItem.getBoundingClientRect().right
                };
                top = e.clientY - baseItemBoundaries.top - cover.clientHeight / 2;
                if (top < 0) {
                    top = 0;
                }
                else if (top + cover.clientHeight > baseItem.clientHeight) {
                    top = baseItem.clientHeight - cover.clientHeight;
                }
                left = e.clientX - baseItemBoundaries.left - cover.clientWidth / 2;
                if (left < 0) {
                    left = 0;
                }
                else if (left + cover.clientWidth > baseItem.clientWidth) {
                    left = baseItem.clientWidth - cover.clientWidth;
                }
                cover.style.top = top + "px";
                cover.style.left = left + "px";
                cover.dispatchEvent(coverMoveEvent);
                const isMouseMoveXOut = e.clientX < baseItemBoundaries.left || e.clientX > baseItemBoundaries.right;
                const isMouseMoveYOut = e.clientY < baseItemBoundaries.top || e.clientY > baseItemBoundaries.bottom;
                if (isMouseMoveXOut || isMouseMoveYOut) {
                    this.removeEventListener("mousemove", dragEvent);
                    cover.style.display = "none";
                }
            }
        }
    }
});
