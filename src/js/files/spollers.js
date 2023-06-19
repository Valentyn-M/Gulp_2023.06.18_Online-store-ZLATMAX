// Спойлеры

"use strict";

// Ждать построение DOM-дерева
document.addEventListener("DOMContentLoaded", function () {

	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray) {
		// Получение обычных спойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {		// Array.from - Переводим коллекцию spollersArray в массив и применяем метод filter (этот метод делает дубль нашего массива и сохраняет его в константу)
			// Поскольку метод filter вернет в константу spollersRegular все массивы, которые соотвествуют следующему условию...
			return !item.dataset.spollers.split(",")[0];		// выбираем массивы, которые не имеют дополнительных параметров (такие как data-spollers="800,max"), только чистый атрибут data-spollers
		});

		// Инициализация обычных спойлеров
		if (spollersRegular.length > 0) {		// если есть хоть один обычный спойлер (массив)
			initSpollers(spollersRegular);		// вызываем функцию с аргументом (этот массив)
		}

		// Получение спойлеров с медиа-запросами
		const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
			return item.dataset.spollers.split(",")[0];		// выбираем массивы, которые имеют дополнительные параметры
		});

		// Инициализация спойлеров с медиа-запросами
		if (spollersMedia.length > 0) {
			const breakpointsArray = [];
			spollersMedia.forEach(item => {
				const params = item.dataset.spollers;
				const breakpoint = {};
				const paramArray = params.split(",");
				breakpoint.value = paramArray[0];
				breakpoint.type = paramArray[1] ? paramArray[1].trim() : "max";		// если второй параметр в атрибуте data-spollers не указан, то по умолчанию установтися параметр "max"
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});

			// Получаем уникальные брейкпоинты
			let mediaQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + (item.value / 16) + "rem)," + item.value + ',' + item.type;
			});
			mediaQueries = mediaQueries.filter(function (item, index, self) {
				return self.indexOf(item) === index;
			});

			// Работаем с каждым брейкпоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);

				// Объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				// Слушаем событие "изменение размера экрана"
				matchMedia.addEventListener("change", function () {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});
		}

		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollersBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollersBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}

		// Работа с контентом
		function initSpollersBody(spollersBlock, hideSpollerBody = true) {
			const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');			// Все заголовки
			if (spollerTitles.length > 0) {
				spollerTitles.forEach(spollerTitle => {												// Каждый заголовок спойлера
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;																										// Элемент, на котором кликнули
			if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {									// Если клик по заголовку спойлера или по элементу внутри него
				const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');		// Заголовок спойлера. Заносим в переменную элемент, на котором кликнули (в блоке заголовка). Это либо элемент внутри заголовка или его ближайший родитель с дата-атрибутом "data-spoller", т.е. сам заголовок
				const spollersBlock = spollerTitle.closest('[data-spollers]');											// Получаем родительский блок спойлеров (ищем ближайшего родителя с дата-атрибутом "data-spollers")
				// Проверка: нужен ли нам функционал аккардиона
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;				// Если родительский блок спойлеров содержит "data-one-spoller", то получим в константу true
				if (!spollersBlock.querySelectorAll('._slide').length) {													// Если нет объектов внутри с классом "_slide", чтобы избежать двойного нажатия
					// Проверка на функционал аккардиона (если есть атрибут data-one-spoller и если кнопка не имеет класса _spoller-active...)
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						// Скрываем все остальные спойлеры, вызывая функцию hideSpollerBody и передаем ей родительский блок спойлеров
						hideSpollerBody(spollersBlock);
					}
					// Одновременно активируем тот спойлер, на который кликнули
					spollerTitle.classList.toggle('_spoller-active');														// Переключаем класс активности (добавляем или убираем)
					_slideToggle(spollerTitle.nextElementSibling, 300);													// Передаем в функцию _slideToggle контентную часть спойлера
				}
				e.preventDefault();
			}
		}
		function hideSpollerBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');			// Получаем активный открытый ранее спойлер
			if (spollerActiveTitle) {																								// Если есть такой
				// Скрываем его
				spollerActiveTitle.classList.remove('_spoller-active');													// Удаляем класс активности
				_slideUp(spollerActiveTitle.nextElementSibling, 300);														// Вызываем функцию закрытия содержимого спойлера
			}
		}
	}

	// ==========================================================================================================================

	// Анимация спойлеров
	// Длительность анимации (по умолчанию 300 мс - если не задано при вызове функции) указывается  при вызове каждой функции: см. выше

	// Функция закрытия спойлера
	let _slideUp = (target, duration = 300) => {													// target - элемент, который надо анимировать
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-property');
				target.style.removeProperty('transition-duration');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	// Функция открытия спойлера
	let _slideDown = (target, duration = 300) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	// Функция закрытия/открытия спойлера (если открыт, закроет и наоборот)
	let _slideToggle = (target, duration = 300) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
});

// ==========================================================================================================================

/*
Для родителя спойлеров пишем атрибут "data-spollers"
Для заголовков спойлеров пишем атрибут "data-spoller"

<button data-spoller type="button">Заголовок спойлера</button> прячет следующий элемент, что находится под ним
	
Если нужно включить/выключить работу споёлеров на разных
размерах экранов, пишем параметры "ширина" и "тип брйкпоинта".
Например:
data-spollers="991.98,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="767.98,min" - спойлеры будут работать только на экранах больше или равно 768px
	
Если нужно, чтобы в блоке открывался только один спойлер (остальные будут скрыты)
добавляем для родителя спойлеров атрибут "data-one-spoller"
Например: data-spollers data-one-spoller
	
Если нужно изначально показать (расскрыть) спойлер при загрузке страницы,
то добавляем для заголовка этого спойлера (data-spoller) класс "_spoller-active"
*/