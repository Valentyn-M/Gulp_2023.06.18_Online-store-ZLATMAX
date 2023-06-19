// JS-функция определения поддержки WebP
// Проверка поддержки webp, добавление класса webp или no-webp для HTML
export function isWebp() {
	"use strict";

	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}


// ==============================================================================================


// Определяем мобильное устройство
export function defineDevice() {
	let isMobile = {
		Android: function () { return navigator.userAgent.match(/Android/i); },
		BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
		iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
		Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
		Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
		// Любое мобильное устройство - any
		any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};

	let body = document.querySelector('body');

	if (isMobile.any()) {     			// Если это мобильное устройство (любое)
		body.classList.add('touch');
		console.log('this is mobile');
	} else {                			// Если не мобильное устройство
		body.classList.add('mouse');
		console.log('this is PC');
	}
}


// ==============================================================================================


// Плавная прокрутка в начало страницы
export function scrollTopStart() {
	element.addEventListener('click', function () {
		window.scrollTo({					// прокрутка документа до указанных координат
			top: 0,								// прокрутка до нужного пикселя по вертикальной оси документа
			behavior: "smooth"				// плавная прокрутка
		});
	});
}


// ==============================================================================================


