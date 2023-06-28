// Функция для Медиа-запросов (переводит px в rem и обратно в px с учетом шрифта браузера)
import { mediaWidthRem } from "./functions.js"

// Popup 1
export function popup1() {

	const popupCallbackButton = document.querySelector('[data-popup-button="1"]');		// кнопка попапа
	const popupCallbackWindow = document.querySelector('[data-popup-window="1"]');		// окно попапа
	const popupCallbackBody = popupCallbackWindow.parentElement;								// оболочка попапа

	// Вешаем прослушку (по клику) на кнопку
	popupCallbackButton.addEventListener("click", showPopup);
	function showPopup(event) {
		let windowWidth = window.innerWidth;		// получаем ширину окна браузера
		const bodyElement = document.body;			// body

		popupCallbackBody.classList.add('_popup-active');
		popupCallbackWindow.classList.add('_popup-active');
		if (windowWidth <= mediaWidthRem(991.98)) {
			bodyElement.classList.add('_lock');
		}

		// Вешаем прослушку (по клику) на весь документ
		document.addEventListener("click", closePopup);
		function closePopup(event) {
			const popupButton = event.target.closest('[data-popup-button="1"]');
			const popupWindow = event.target.closest('[data-popup-window="1"]');
			const closeButton = event.target.closest('.close-css');
			// Если клик сделан НЕ по окну И НЕ по кнопке ИЛИ клик сделан по кнопке Закрыть (крестик)
			if (!popupButton && !popupWindow || closeButton) {
				popupCallbackBody.classList.remove('_popup-active');
				popupCallbackWindow.classList.remove('_popup-active');
				if (windowWidth <= mediaWidthRem(991.98)) {
					bodyElement.classList.remove('_lock');
				}
				// Удаляем текущую прослушку со всего документа
				document.removeEventListener("click", closePopup);
			}
		}

		// Вешаем прослушку (по нажатию клавиш) на весь документ
		document.addEventListener("keyup", closePopupEscape);
		function closePopupEscape(event) {
			// Если нажата клавиша Escape
			if (event.code === 'Escape') {
				popupCallbackBody.classList.remove('_popup-active');
				popupCallbackWindow.classList.remove('_popup-active');
				if (windowWidth <= mediaWidthRem(991.98)) {
					bodyElement.classList.remove('_lock');
				}
				// Удаляем текущую прослушку со всего документа
				document.removeEventListener("click", closePopup);
			}
		}
	}
}

// Popup 1
export function popup2() {

	const popupCallbackButton = document.querySelector('[data-popup-button="2"]');		// кнопка попапа
	const popupCallbackWindow = document.querySelector('[data-popup-window="2"]');		// окно попапа
	const popupCallbackBody = popupCallbackWindow.parentElement;								// оболочка попапа

	// Вешаем прослушку (по клику) на кнопку
	popupCallbackButton.addEventListener("click", showPopup);
	function showPopup(event) {
		let windowWidth = window.innerWidth;		// получаем ширину окна браузера
		const bodyElement = document.body;			// body

		popupCallbackBody.classList.add('_popup-active');
		popupCallbackWindow.classList.add('_popup-active');
		if (windowWidth <= mediaWidthRem(991.98)) {
			bodyElement.classList.add('_lock');
		}

		// Вешаем прослушку (по клику) на весь документ
		document.addEventListener("click", closePopup);
		function closePopup(event) {
			const popupButton = event.target.closest('[data-popup-button="2"]');
			const popupWindow = event.target.closest('[data-popup-window="2"]');
			const closeButton = event.target.closest('.close-css');
			// Если клик сделан НЕ по окну И НЕ по кнопке ИЛИ клик сделан по кнопке Закрыть (крестик)
			if (!popupButton && !popupWindow || closeButton) {
				popupCallbackBody.classList.remove('_popup-active');
				popupCallbackWindow.classList.remove('_popup-active');
				if (windowWidth <= mediaWidthRem(991.98)) {
					bodyElement.classList.remove('_lock');
				}
				// Удаляем текущую прослушку со всего документа
				document.removeEventListener("click", closePopup);
			}
		}

		// Вешаем прослушку (по нажатию клавиш) на весь документ
		document.addEventListener("keyup", closePopupEscape);
		function closePopupEscape(event) {
			// Если нажата клавиша Escape
			if (event.code === 'Escape') {
				popupCallbackBody.classList.remove('_popup-active');
				popupCallbackWindow.classList.remove('_popup-active');
				if (windowWidth <= mediaWidthRem(991.98)) {
					bodyElement.classList.remove('_lock');
				}
				// Удаляем текущую прослушку со всего документа
				document.removeEventListener("click", closePopup);
			}
		}
	}
}

// Popup 3
export function popup3() {

	const popupCallbackButton = document.querySelector('[data-popup-button="3"]');		// кнопка попапа
	const popupCallbackWindow = document.querySelector('[data-popup-window="3"]');		// окно попапа
	const popupCallbackBody = popupCallbackWindow.parentElement;								// оболочка попапа

	// Вешаем прослушку (по клику) на кнопку
	popupCallbackButton.addEventListener("click", showPopup);
	function showPopup(event) {
		let windowWidth = window.innerWidth;		// получаем ширину окна браузера
		const bodyElement = document.body;			// body

		popupCallbackBody.classList.add('_popup-active');
		popupCallbackWindow.classList.add('_popup-active');
		if (windowWidth <= mediaWidthRem(991.98)) {
			bodyElement.classList.add('_lock');
		}

		// Вешаем прослушку (по клику) на весь документ
		document.addEventListener("click", closePopup);
		function closePopup(event) {
			const popupButton = event.target.closest('[data-popup-button="3"]');
			const popupWindow = event.target.closest('[data-popup-window="3"]');
			const closeButton = event.target.closest('.close-css');
			// Если клик сделан НЕ по окну И НЕ по кнопке ИЛИ клик сделан по кнопке Закрыть (крестик)
			if (!popupButton && !popupWindow || closeButton) {
				popupCallbackBody.classList.remove('_popup-active');
				popupCallbackWindow.classList.remove('_popup-active');
				if (windowWidth <= mediaWidthRem(991.98)) {
					bodyElement.classList.remove('_lock');
				}
				// Удаляем текущую прослушку со всего документа
				document.removeEventListener("click", closePopup);
			}
		}

		// Вешаем прослушку (по нажатию клавиш) на весь документ
		document.addEventListener("keyup", closePopupEscape);
		function closePopupEscape(event) {
			// Если нажата клавиша Escape
			if (event.code === 'Escape') {
				popupCallbackBody.classList.remove('_popup-active');
				popupCallbackWindow.classList.remove('_popup-active');
				if (windowWidth <= mediaWidthRem(991.98)) {
					bodyElement.classList.remove('_lock');
				}
				// Удаляем текущую прослушку со всего документа
				document.removeEventListener("click", closePopup);
			}
		}
	}
}