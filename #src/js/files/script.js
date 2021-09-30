
window.onload = function () {
	document.addEventListener("click", documentActions);

	function documentActions(e) {
		const targetElement = e.target;
		if (window.innerWidth > 768 && isMobile.any()) {
			if (targetElement.classList.contains("menu__arrow")) {
				targetElement.closest(".menu__item").classList.toggle("_hover");
			}
			if (
				!targetElement.closest(".menu__item") &&
				document.querySelectorAll(".menu__item._hover").length > 0
			) {
				_removeClasses(
					document.querySelectorAll(".menu__item._hover"),
					"_hover"
				);
			}
		}
		if (targetElement.classList.contains("search-form__icon")) {
			document.querySelector(".search-form").classList.toggle("_active");
		} else if (
			!targetElement.closest(".search-form") &&
			document.querySelector(".search-form._active")
		) {
			document.querySelector(".search-form").classList.remove("_active");
		}
		//Show more button
		if (targetElement.classList.contains("products__more")) {
			getProducts(targetElement);
			e.preventDefault();
		}

		//add to cart
		if (targetElement.classList.contains('actions-product__button')) {
			const productId = targetElement.closest('.item-product').dataset.pid;
			addToCart(targetElement, productId);
			e.preventDefault();
		}

		//cart in header
		if (targetElement.classList.contains("cart-header__icon") || targetElement.closest(".cart-header__icon")) {
			if(document.querySelector('.cart-list').children.length > 0) {
				document.querySelector('.cart-header').classList.toggle('_active');
			}
			e.preventDefault();
		} else if(!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
			document.querySelector('.cart-header').classList.remove('_active');
		}
		//delete product from cart
		if(targetElement.classList.contains('cart-list__delete')) {
			const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
			updateCart(targetElement, productId, false);
			e.preventDefault();
		}
	
	}

	//HEADER
	const callback = function (entries, observer) {
		if (entries[0].isIntersecting) {
			headerElement.classList.remove("_scroll");
		} else {
			headerElement.classList.add("_scroll");
		}
	};
	const headerElement = document.querySelector(".header");
	const headerObserver = new IntersectionObserver(callback);
	headerObserver.observe(headerElement);

	//Load more products
	async function getProducts(button) {
		if(!button.classList.contains('_hold')){
			button.classList.add('_hold');
			const file = "json/products.json";
			let response = await fetch(file, {
				method: "GET"
			});
			if(response.ok){
				let result = await response.json();
				loadProducts(result);
				button.classList.remove('_hold');
				button.remove();
			} else {
				alert("Error");
			}
		}
	}

	function loadProducts(data) {
		const productItems = document.querySelector('.products__items');

		data.products.forEach(item => {
			const productId = item.id;
			const productUrl = item.url;
			const productImage = item.image;
			const productTitle = item.title;
			const productText = item.text;
			const productPrice = item.price;
			const productOldPrice = item.priceOld;
			const productShareUrl = item.shareUrl;
			const productLikeUrl = item.likeUrl;
			const productLabels = item.labels;

			let productTemplateStart = `<article class="products__item item-product" data-pid="${productId}">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__lables">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = "";

				productLabels.forEach((labelItem) => {
					productTemplateLabelsContent += `<div class="item-product__lable item-product__lable_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}
			
			let productTemplateImage = `
				<a href="${productUrl}" class="item-product__image _ibg">
					<img src="img/products/${productImage}" alt="${productTitle}">
				</a>
			`;

			let pruductTemplateBodyStart = `<div class="item-product__body">`;
			let pruductTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
				<div class="item-product__content">
					<h5 class="item-product__title">${productTitle}</h5>
					<div class="item-product__text">${productText}</div>
				</div>
			`;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesEnd = `</div>`;
			let productTemplatePricesCurrent = `<div class="item-product__price">${productPrice}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">${productOldPrice}</div>`;

			productTemplatePrices += productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if(productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
				<div class="item-product__actions actions-product">
					<div class="actions-product__body">
						<a href="" class="actions-product__button btn btn_white">Add to cart</a>
						<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
						<a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
					</div>
				</div>
			`;

			let pruductTemplateBody = '';
			pruductTemplateBody += pruductTemplateBodyStart;
			pruductTemplateBody += productTemplateContent;
			pruductTemplateBody += productTemplatePrices;
			pruductTemplateBody += productTemplateActions;
			pruductTemplateBody += pruductTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += pruductTemplateBody;
			productTemplate += productTemplateEnd;

			productItems.insertAdjacentHTML('beforeend', productTemplate);

		});
	}

	//Add to Cart
	function addToCart(productButton, productId) {
		if(!productButton.classList.contains('_hold')) {
			productButton.classList.add('_hold');
			productButton.classList.add('_fly');

			const cart = document.querySelector(".cart-header__icon");
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const productImage = product.querySelector(".item-product__image");

			const productImageFly = productImage.cloneNode(true);
			const productImageFlyWidth = productImage.offsetWidth;
			const productImageFlyHeight = productImage.offsetHeight;
			const productImageFlyTop = productImage.getBoundingClientRect().top;
			const productImageFlyLeft = productImage.getBoundingClientRect().left;

			productImageFly.setAttribute('class', '_flyImage _ibg');
			productImageFly.style.cssText = `
				left: ${productImageFlyLeft}px;
				top: ${productImageFlyTop}px;
				width: ${productImageFlyWidth}px;
				height: ${productImageFlyHeight}px;
			`;

			document.body.append(productImageFly);

			const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			productImageFly.style.cssText = `
				left: ${cartFlyLeft}px;
				top: ${cartFlyTop}px;
				width: 0px;
				height: 0px;
				opacity:0;
			`;

			productImageFly.addEventListener('transitionend', function(){
				if(productButton.classList.contains('_fly')){
					productImageFly.remove();
					updateCart(productButton, productId);
					productButton.classList.remove('_fly');
				}
			});
		}
	}
	//UpdateCart
	function updateCart(productButton, productId, productAdd = true) {
		const cart = document.querySelector('.cart-header');
		const cartIcon = cart.querySelector('.cart-header__icon');
		const cartQuantity = cartIcon.querySelector('span');
		const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
		const cartList = document.querySelector('.cart-list');
		//add to cart
		if(productAdd) {
			if(cartQuantity) {
				cartQuantity.innerHTML = ++cartQuantity.innerHTML;
			} else {
				cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
			}
			if(!cartProduct) {
				const product = document.querySelector(`[data-pid="${productId}"]`);
				const cartProductImage = product.querySelector('.item-product__image').innerHTML;
				const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
				const cartProductContent = `
					<a href="" class="cart-list__image _ibg">${cartProductImage}</a>
					<div class="cart-list__body">
						<a href="" class="cart-list__title">${cartProductTitle}</a>
						<div class="cart-list__quantity">Quantity: <span>1</span></div>
						<a href="" class="cart-list__delete">Delete</a>
					</div>
				`;
				cartList.insertAdjacentHTML(
					"beforeend",
					`<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`
				);
			} else {
				const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
				cartProductQuantity.innerHTML = ++ cartProductQuantity.innerHTML;
			}
			productButton.classList.remove('_hold');
		} else { //delete product fron cart
			const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
			if(!parseInt(cartProductQuantity.innerHTML)) {
				cartProduct.remove();
			}
			const cartQuantityValue = --cartQuantity.innerHTML;
			if(cartQuantityValue) {
				cartQuantity.innerHTML = cartQuantityValue;
			} else {
				cartQuantity.remove();
				cart.classList.remove('_active');
			}
		}
	}
}