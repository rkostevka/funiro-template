
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
			console.log(productItems);

			productItems.insertAdjacentHTML('beforeend', productTemplate);

		});
	}
}