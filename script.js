const navbarMenu = document.querySelectorAll(".navbar .navbar__menu-link");
const cratsList = document.querySelector(".menu-cart__cart");
const shoppingIcon = document.querySelector(".menu-cart__icons-shoppingIcon");
const shoppingNumIcon = document.querySelector(".menu-cart__icons-number");
const closeBtn = document.querySelector(".menu-cart__cart-closeBtn");
const Menu = document.querySelector(".menu");
const Cart = document.querySelector(".menu-cart__cart-items");
const TotalPriceEl = document.querySelector(".menu-cart__cart-totalPrice");
let listItems = [];
let listCarts = [];

// Navbar Active Element
navbarMenu.forEach(link => {
    link.addEventListener("click", () => {
        navbarMenu.forEach(item => item.classList.remove("navbar__menu-link--active"));

        link.classList.add("navbar__menu-link--active");
    });
});
// Open Or CLose Cart Page
shoppingIcon.addEventListener("click", () => {
    cratsList.classList.add("menu-cart__cart--active");
});

closeBtn.addEventListener("click", () => {
    cratsList.classList.remove("menu-cart__cart--active");
});

// Create Menu Items
const createEl = (tag, className, attrs = {}) => {
    const el = document.createElement(tag);
    if(className) el.className = className;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

const appendChildren = (parent, ...children) => {
    children.forEach(child => {
        parent.appendChild(child);
    });
}

Menu.addEventListener("click", event => {
    let positionClick = event.target;
    if(positionClick.classList.contains("menu__item-button")) {
        let item_Id = positionClick.parentElement.dataset.id;
        addToCartBtn(item_Id);
    }
});

Cart.addEventListener("click", (event) => {
    const minusBtn = event.target.closest(".menu-cart__item-minusBtn");
    const plusBtn = event.target.closest(".menu-cart__item-plusBtn");
    if (!minusBtn && !plusBtn) return;

    const cartItmeEl = event.target.closest(".menu-cart__cart-item");
    const itemId = cartItmeEl.dataset.id;

    if (minusBtn) decreaseQuantity(itemId);
    if (plusBtn) increaseQuantity(itemId);
});

const addCartToMemory = () => {
    const Carts = JSON.stringify(listCarts);
    localStorage.setItem('cart', Carts);
}

const addToCartBtn = (itemId) => {
    const index = listCarts.findIndex(cart => cart.item_Id === itemId);
    if (index === -1) {
        listCarts.push({
            item_Id: itemId,
            quantity: 1
        });
    }
    else {
        listCarts[index].quantity++;
    }
    renderCarts();
    addCartToMemory();
}

const increaseQuantity = (itemId) => {
    const item = listCarts.find(cart => cart.item_Id === itemId);
    
    if (!item) return;
    item.quantity++;
    addCartToMemory();
    renderCarts();
}

const decreaseQuantity = (itemId) => {
    const index = listCarts.findIndex(cart => cart.item_Id === itemId);

    if (index === -1) return;

    if(listCarts[index].quantity > 1) {
        listCarts[index].quantity--;
    }
    else {
        listCarts.splice(index, 1);
    }

    renderCarts();
    addCartToMemory();
}

const renderCarts = () => {
    Cart.innerHTML = ``;
    const fragment = document.createDocumentFragment();
    let TOTAL_QUANTITY = 0;
    let TOTAL_PRICE = 0;
    if(!listCarts.length) return;
    listCarts.forEach(cart => {

        // Find The Value Location
        const info = listItems.find(item => item.id == cart.item_Id);
        if (!info) return;

        // get Id
        

        // Create Element And Add Class
        let newCart = createEl("div", "menu-cart__cart-item");
        newCart.dataset.id = cart.item_Id;
        let fileDiv = createEl("div", "menu-cart__item-files");
        const img = createEl("img", "menu-cart__item-img", {src: info.image});
        const name = createEl("div", "menu-cart__item-name");
        const price = createEl("div", "menu-cart__item-price");
        let btnDiv = createEl("div", "menu-cart__item-Btns");
        const minusBtn = createEl("span", "menu-cart__item-minusBtn");
        const cartNum = createEl("span", "menu-cart__item-numebr");
        const plusBtn = createEl("span", "menu-cart__item-plusBtn");
        // Elements Created And Class Added

        // Add Value To Elements
        const Name = info.name;
        const Quantity = cart.quantity;
        const ITEM_TOTAL_PRICE = `$${(info.price * Quantity).toFixed(2)}`;
        const itemTotalPrice = info.price * Quantity;
        const MINUS_TEXT = "<";
        const PLUS_TEXT = ">";
        name.textContent = Name;
        price.textContent = ITEM_TOTAL_PRICE;
        minusBtn.textContent = MINUS_TEXT;
        cartNum.textContent = Quantity;
        plusBtn.textContent = PLUS_TEXT;
        TOTAL_QUANTITY += Quantity;
        TOTAL_PRICE += itemTotalPrice;

        // Append Elements
        fileDiv.appendChild(img);
        appendChildren(btnDiv, minusBtn, cartNum, plusBtn);
        appendChildren(newCart, fileDiv, name, price, btnDiv);
        fragment.appendChild(newCart);
    });
    Cart.appendChild(fragment);
    shoppingNumIcon.textContent = TOTAL_QUANTITY;
    TotalPriceEl.textContent = `Total Price: $${TOTAL_PRICE.toFixed(2)}`;
}

const renderMenu = () => {
    Menu.innerHTML = ``;
    const fragment = document.createDocumentFragment();
    if(!listItems.length) return;
    listItems.forEach(item => {

    // Add Element And ClassList
    let newItem = createEl("li", "menu__item");
    let fileDiv = createEl("div", "menu__item-files");
    const img = createEl("img", "menu__item-image", {src: item.image});
    const name = createEl("div", "menu__item-name");
    const price = createEl("div", "menu__item-price");
    const addBtn = createEl("button", "menu__item-button", {type: "button"});

    // Get Item Id
    newItem.dataset.id = item.id;

    // Add Value To Elements
    const ADD_TO_CART_NEXT = "Add to cart";
    name.textContent = item.name;
    price.textContent = `$${item.price}`;
    addBtn.textContent = ADD_TO_CART_NEXT;

    // Apennding Children
    fileDiv.appendChild(img);
    appendChildren(newItem, fileDiv, name, price, addBtn);
    fragment.appendChild(newItem);
    });
    Menu.appendChild(fragment);
}

const initApp = () => {
    try {
        fetch('menu-item.json')
    .then(response => {
        if (!response.ok) 
            throw new Error("Network error");
        return response.json();
    })
    .then(data => {
        listItems = data;
        renderMenu();

        // get cart from memory
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            listCarts = JSON.parse(savedCart);
            renderCarts();
        }
    });
    }
    catch(error) {
        console.error(error);
    }
}

initApp();