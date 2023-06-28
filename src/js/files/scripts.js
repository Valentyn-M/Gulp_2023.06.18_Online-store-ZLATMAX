// Импорт функционала (нужные функции раскомментировать)


// ==========================================================================


// Функция: Определение поддержки WebP (всегда включена)

import { isWebp } from "./functions.js";		// импортируем функцию
isWebp();												// вызываем эту функцию


// ==========================================================================


// Функция: Плавная прокрутка в начало страницы

// import { scrollTopStart } from "./functions.js"
// scrollTopStart();


// ==========================================================================


// Функция: Определение устройства (мобильное или ПК)

// import { defineDevice } from "./functions.js"
// defineDevice();

// ==========================================================================


// Функция для Медиа-запросов (переводит px в rem и обратно в px с учетом шрифта браузера)

// Вызываем функцию в нужном месте и передаем в аргументе ширину окна браузера в px: mediaWidthRem(mediaWidth)
// Например:
// if (windowWidth <= mediaWidthRem(768)) {...}
// import { mediaWidthRem } from "./functions.js"


// ==========================================================================


// Здесь пишем Javascript для данного проекта


// --------------------------------------------------------------------------


// Добавление специальных классов блокам меню, чтобы правильно строилась сетка Grid для каждого блока меню
const menuBlocks = document.querySelectorAll('.submenu-catalog__block');
if (menuBlocks.length) {																									// Если существуют такие объекты, бегаем по ним циклом
	menuBlocks.forEach(menuBlock => {
		const menuBlocksItems = menuBlock.querySelectorAll('.submenu-catalog__category').length;		// получаем количество элементов (подменю) в каждом меню
		menuBlock.classList.add(`_submenu-catalog__block_${menuBlocksItems}`);								// Добавляем кждому блоку нужный класс (например, submenu-catalog__block_5)
	});
}


// -------------------------------------


// Вешаем одно событие "клик" на весь документ - это делегирование событий
document.addEventListener("click", documentActions);

function documentActions(e) {
	const targetElement = e.target;															// Элемент, на котором сделан клик

	// Активация выпадающего меню
	if (targetElement.closest('[data-menu-parent]')) {									// Если этот елемент имеет атрибут "data-menu-parent"
		const subMenuId = targetElement.dataset.menuParent ? targetElement.dataset.menuParent : null;		// Получаем значение data-атрибута "data-menu-parent". При этом делаем проверку: если в этом атрибуте есть что-то заполненное, тогда получаем его ( ? ), в противном случае ( : ) возвращаем null
		const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);									// Ищем объекты с атрибутом data-submenu с таким же номером в дата-атрибуте
		if (subMenu) {																				// Если есть такой объект (subMenu с таким дата-атрибутом), то работаем дальше...
			const activeLink = document.querySelector('._submenu-active');			// Активная кнопка меню
			const activeBlock = document.querySelector('._submenu-open');			// Открытое (активное) подменю
			const submenuCatalog = document.querySelector('.submenu-catalog');	// Общий контейнер для submenu-шек
			if (activeLink && activeLink !== targetElement) {							// Если существует Активная кнопка меню И если Она не наш выбранный элемент (на котором сделан предыдущий клик), то забираем активные классы у предыдущих активных элементов
				activeLink.classList.remove('_submenu-active');
				activeBlock.classList.remove('_submenu-open');
				submenuCatalog.classList.remove('_submenu-catalog-open');
			}
			targetElement.classList.toggle('_submenu-active');							// добавляем класс копке меню
			subMenu.classList.toggle('_submenu-open');									// добавляем класс скрытому подменю
			submenuCatalog.classList.toggle('_submenu-catalog-open');				// добавляем класс общему блоку подменюшек

			// Нужна плавность для пследнего подменю на мобильном устройстве (display: none; не анимируется)
			const notActiveBlocks = document.querySelectorAll('[data-submenu]');	// все подменю
			for (let i = 0, a = notActiveBlocks.length; i < a; i++) {
				const notActiveBlock = notActiveBlocks[i];
				if (!notActiveBlock.classList.contains('_submenu-open')) {			// все неактивные подменю
					notActiveBlock.classList.add('_submenu-not-open');
				} else {
					notActiveBlock.classList.remove('_submenu-not-open');
				}
			}
		} else {
			console.log("Ой-ой, нет такого подменю :(");
		}
		e.preventDefault();																		// Отменяем стандартные действия элемента (ссылки или кнопки)
	}
	// Если клик за пределами меню и подменю
	if (!targetElement.closest('[data-menu-parent]') && !targetElement.closest('[data-submenu]') && !targetElement.closest('.submenu-catalog')) {
		const activeLink = document.querySelector('._submenu-active');
		const activeBlock = document.querySelector('._submenu-open');
		const submenuCatalog = document.querySelector('.submenu-catalog');
		if (activeLink || activeBlock) {														// Если есть активное (открытое) меню
			activeLink.classList.remove('_submenu-active');
			activeBlock.classList.remove('_submenu-open');
			submenuCatalog.classList.remove('_submenu-catalog-open');
		}
	}

	// Активация menu-catalog (На мобильных устройствах)
	if (targetElement.closest('.menu-top-header__link_catalog')) {					// Если клик по меню "Каталог товаров"
		document.querySelector('.menu-catalog').classList.add('_catalog-open');
		e.preventDefault();																		// Запрещеаем переход по ссылке
	}
	// Если клик за пределами меню или по кнопке Закрыть или клик по кнопке Назад
	if (!targetElement.closest('.menu') || targetElement.closest('.icon-menu') || targetElement.closest('.menu-catalog__back')) {
		if (document.querySelector('.menu-catalog').classList.contains('_catalog-open')) {
			document.querySelector('.menu-catalog').classList.remove('_catalog-open');
		}
	}

	// Если клик за пределами меню или по кнопке Закрыть или клик по кнопке Назад для submenu
	if (targetElement.closest('.submenu-catalog__back')) {
		document.querySelector('._submenu-catalog-open').classList.remove('_submenu-catalog-open');
		document.querySelector('._submenu-open').classList.remove('_submenu-open');
		// Краткая запись if...else
		// Если существует элемент с классом _submenu-active, то (?) удаляем у него класс, иначе (:) ничего не делаем
		document.querySelector('._submenu-active') ? document.querySelector('._submenu-active').classList.remove('_submenu-active') : null;
	}
}


// ==========================================================================================================================

// Доставка

const selectBlock = document.querySelector('.tab-selection');
if (selectBlock) {
	const selects = document.querySelectorAll('.select-custom');
	const selectsArray = Array.from(selects);
	const selectLast = selectsArray[selectsArray.length - 1];
	const selectLastHeaderText = selectLast.querySelector('.header-select__text');		// Будем наблюдать за изменениями этого элемента с помощью MutationObserver

	// MutationObserver предоставляет возможность получать уведомления об изменении определённых DOM-элементов

	// Конфигурация observer (за какими изменениями наблюдать)
	const config = {
		attributes: true
	};

	// Колбэк-функция при срабатывании мутации
	const callback = function (mutationsList, observer) {
		for (let mutation of mutationsList) {
			if (mutation.type === 'attributes') {
				// Вызываем функцию
				showDeliveryInfo();
			}
		}
	};

	// Создаём экземпляр наблюдателя с указанной функцией колбэка
	const observer = new MutationObserver(callback);

	// Начинаем наблюдение за настроенными изменениями целевого элемента
	observer.observe(selectLastHeaderText, config);

	function showDeliveryInfo() {
		const deliveryBlocks = document.querySelectorAll('.tab-info');
		if (selectLastHeaderText.classList.contains('_changed')) {
			deliveryBlocks.forEach(deliveryBlock => {
				deliveryBlock.classList.add('_active');
			});
		} else {
			deliveryBlocks.forEach(deliveryBlock => {
				deliveryBlock.classList.remove('_active');
			});
		}
		// Останавливаем наблюдение
		observer.disconnect();
	}
}


