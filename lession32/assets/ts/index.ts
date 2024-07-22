var QUERY_STRING_DRAG_ITEM = '.list-item[draggable="true"]'
var QUERY_STRING_DRAG_ITEM_ID = '.list-item[draggable="true"] .drag-id'
var PREFIX_GROUP_ID = "id-"
var CLASS_DRAGGING = "dragging"
var dragItems = document.querySelectorAll(QUERY_STRING_DRAG_ITEM);
var draggingItem: HTMLElement | null = null;

indexingAllDragElement();
dragItems.forEach(function (dragItem) {
    var item = dragItem as HTMLElement;
    item.addEventListener("dragstart", function (e) {
        draggingItem = this;
        draggingItem.classList.add(CLASS_DRAGGING);
    })

    item.addEventListener("dragover", function (e) {
        e.preventDefault();
        if (draggingItem == this) return
        if (draggingItem) {
            var insertPosition: "beforebegin" | "afterend" = draggingItem.offsetTop > this.offsetTop ? "beforebegin" : "afterend"
            this.insertAdjacentElement(insertPosition, draggingItem);
        } else {
            throw new Error("Error Dragging Item NOt Found")
        }
    })

    item.addEventListener("drop", function (e) {
        e.preventDefault();
        if (draggingItem) {
            draggingItem.classList.remove(CLASS_DRAGGING);
            draggingItem = null;
        }

        indexingAllDragElement();

    })
})

function indexingAllDragElement() {
    var idEls = Array.from(document.querySelectorAll(QUERY_STRING_DRAG_ITEM_ID))

    var isIdValid = idEls.every(function (id) {
        return id && Array.from(id.classList).some(function (className) {
            return className.startsWith(PREFIX_GROUP_ID);
        });
    })


    if (!isIdValid) {
        throw new Error("Error on structur define");
    }

    var idCount: { [key: string]: number } = {}


    idEls.forEach(function (el) {
        var groupId = Array.from(el.classList).find(function (className) {
            return className.startsWith(PREFIX_GROUP_ID);
        }) ?? "abc"

        if (!(groupId in idCount)) {
            idCount[groupId] = 0
        }
        idCount[groupId]++;
        el.textContent = String(idCount[groupId]);
    })
}



