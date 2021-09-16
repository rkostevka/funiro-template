
window.onload = function () {
	document.addEventListener("click", documentActions)

	function documentActions(e) {
		const targetElement = e.target;
		if(window.innerWidth > 768 && isMobile.any()){
			if(targetElement.classList.contains('menu__arrow')){
				targetElement.closest('.menu__item').classList.toggle('_hover');
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
	}
}