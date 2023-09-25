/*
            商城範例
        */
let shop = {
    'searchItems': [],
    'inputText': null,
    'search': null,
    'searchButton': null,
    'allProducts': [],
    'addToCartButtons': [], // 由於此按鈕現在是被 js 加到 HTML 中的, 稍後在 getElements() 中再選擇

    'cartToggle': null, // 選擇 #cart-toggle, 即展開/關閉購物車的 button
    'productsContainer': null, // 選擇 #products-container, 即裝有商品的 div
    'addedProductsContainer': null, // 選擇 #added-products-container, 即裝有購物車中商品的 div
    'cartAmount': null, // 選擇 #cart-amount, 即裝有購物車中商品數量的 span
    'cartSubtotal': null, // 選擇 #cart-subtotal, 即裝有購物車中商品總價的 span

    'checkoutButton': null, // 先不用選, 最後送出購物車中商品的按鈕
    'cookieName': 'cartItems',
    'urls': {
        'getProducts': 'https://cart-handler.weihaowang.work/api/products',
        'submit': 'https://cart-handler.weihaowang.work/api/cartHandler'
    },
    'cart': {
        'items': [],  // 加入購物車的商品的 id
        'subtotal': 0, // 加入購物車的商品的總價
        'amount': 0    // 加入購物車的商品的數量
    },
    'init': function (productsInCookie) {
        this.fetchProducts();
        this.getElements();
        this.renderElements();
        this.addListeners();
        if (productsInCookie) {
            // 如果有存在 cookie 的商品 id...
            /* 
                8.
                productsInCookie 為已經入購物車的商品 id 的陣列, 
                我們可以用 for 迴圈來檢視此陣列中的每個值, 
                現在要呼叫 shop 的哪個方法來把有這些 id 的商品加入購物車?
            */
            for (let i = 0; i < productsInCookie.length; i++) {
                this.updateCart(productsInCookie[i]);
            }
        }

    },
    'renderElements': function () {
        /*
            1.
        */
        for (let i = 0; i < this.allProducts.length; i++) {
            let p = this.allProducts[i];
            this.productsContainer.innerHTML += `<div class="product" id="product-` + (i + 1) + `">
                            <div class="product-thumbnail-wrapper"><img class="product-thumbnail" src="` + p.thumbnail + `"></div>
                            <div class="product-name">` + p.title + `</div>
                            <div class="product-price-wrapper"><span class="product-price">`+ p.price + `</span> 元</div>
                            <input type="text" name="number" id="number-`+ (i + 1) + `">         
                            <button class="add-to-cart-button" productId = "`+ p.id + `">加入購物車</button>
                        </div>`
        }
    },
    'getElements': function () {
        this.addToCartButtons = document.getElementsByClassName('add-to-cart-button');
        this.productsContainer = document.getElementById("products-container");
        this.cartToggle = document.getElementById("cart-toggle");
        this.addedProductsContainer = document.getElementById("added-products-container");
        this.cartAmount = document.getElementById("cart-amount");
        this.cartSubtotal = document.getElementById("cart-subtotal");
        this.checkoutButton = document.getElementById("checkout-button");
        this.search = document.getElementById("search");
        this.searchButton = document.getElementById("visible");
    },
    'addListeners': function () {
        /*
            2
        */

        for (let i = 0; i < this.addToCartButtons.length; i++) {
            let a = document.getElementById("number-" + (i + 1));
            this.addToCartButtons[i].addEventListener("click", () => {
                let productId = this.addToCartButtons[i].getAttribute("productId");
                for (let j = 0; j < a.value; j++) {
                    this.updateCart(productId);
                }
                console.log(JSON.stringify(a));
            });
        }
        /*
            3
        */
        this.cartToggle.addEventListener("click", () => {
            document.body.classList.toggle("viewing-cart");
        });

        if (this.checkoutButton) {
            this.checkoutButton.addEventListener("click", () => {
                this.submit();
            })
        }

        this.searchButton.addEventListener("click", () => {

            this.searchItems = [];
            for (let i = 0; i < this.allProducts.length; i++) {

                console.log(this.search.value);
                if (this.allProducts[i].title.match(this.search.value)) {
                    this.searchItems.push(this.allProducts[i]);
                    // console.log(this.allProducts[i]);
                }
            }
            shop.productsContainer.innerHTML = ``;
            shop.updateView(this.searchItems);
        })


    },
    'updateCart': function (p_id) {
        // console.log("updateCart()");

        for (let i = 0; i < this.allProducts.length; i++) {
            if (this.allProducts[i].id == p_id) {
                /* 
                    4.1
                */
                for (let i = 0; i < 1; i++) {

                }
                this.cart.items.push(p_id);
                this.cart.subtotal += this.allProducts[i].price;
                this.cart.amount++;

                /*
                    4.2
                */
                this.updateCartUI(this.allProducts[i].title, this.allProducts[i].price);
                /* 
                6.
                更新 cookie 
                用 setCookie() 將 this.cart.items 存在 cookie 中
                由於 cookie 的值只能是字串, 我們這裡會使用 JSON.stringify(this.cart.items) 來將陣列準換成文字且保留其格式
                cookie 名稱儲存在 this.cookieName
                */

                break;
            }
        }

        let a = JSON.stringify(this.cart.items);
        setCookie(this.cookieName, a);

        console.log(this.cart);
    },
    'updateCartUI': function (p_name, p_price) {
        // 更新購物車的 UI
        /*
            5.1
        */
        this.addedProductsContainer.innerHTML += `<div class="added-product">
                       <span class="added-product-title">` + p_name + `</span>
                       <span class="added-product-price">` + p_price + `</span>
                   </div>`
        /*
            5.2
        */
        this.cartAmount.innerText = this.cart.amount;
        this.cartSubtotal.innerText = this.cart.subtotal;
    },
    'fetchProducts': function () {
        // 從資料庫請求商品資料
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {

            if (request.readyState == 4 && request.status === 200) {
                this.allProducts = JSON.parse(request.responseText);
            } else {
                console.log(request.responseText);
            }
        }.bind(this));
        request.open("GET", this.urls.getProducts, false);
        request.send();
    },
    'submit': function () {
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState === 4 && request.status === 200) {
                console.log(request.responseText);
                eraseCookie(this.cookieName); // 成功送出後記得清除 cookie
            }
        }.bind(this));
        request.open('POST', this.urls.submit, false);
        request.setRequestHeader('Content-type', 'application/json');
        let data = {
            'token': 'eec1e2cdb3eef9204a8ee7df511baad619d701c268a101f9bc44c7a97276eead',
            'items': this.cart.items,
            'subtotal': this.cart.subtotal,
        }
        data = JSON.stringify(data);
        request.send(data);
    },

    'updateView': function () {
        this.fetchProducts();
        this.getElements();
        for (let i = 0; i < this.searchItems.length; i++) {
            let p = this.searchItems[i];
            this.productsContainer.innerHTML += `<div class="product" id="product-` + (i + 1) + `">
                            <div class="product-thumbnail-wrapper"><img class="product-thumbnail" src="` + p.thumbnail + `"></div>
                            <div class="product-name">` + p.title + `</div>
                            <div class="product-price-wrapper"><span class="product-price">`+ p.price + `</span> 元</div>
                            <input type="text" name="number" id="number-`+ (i + 1) + `">         
                            <button class="add-to-cart-button" productId = "`+ p.id + `">加入購物車</button>
                        </div>`
        }


    }

}