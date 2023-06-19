// При определенном разрешении экрана переносим один html-элемент в другой

"use strict";

// Ждать построение DOM-дерева
document.addEventListener("DOMContentLoaded", adaptive);

function adaptive() {
	let originalPositions = [];											// Массив первоначальных позиций перемещаемых элементов
	let daElements = document.querySelectorAll('[data-da]');		// Коллекция всех перемещаемых элементов на странице
	let daElementsArray = [];												// Массив для хранения всех пераметров перемещения элемента (сам элемент, элемент куда перемещаем, позиция перемещения, брейкпоинт)
	let daMatchMedia = [];													// Массив для брейкпоинтов каждого перемещаемого элемента

	// Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		// Проходим циклом по всем элементам с атрибутом "data-da"
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];														// Каждый найденный перемещаемый элемент
			const daMove = daElement.getAttribute('data-da');										// Получаем значение data-атрибут перемещаемого элемента
			if (daMove != '') {																				// Если занчение data-атрибута не пусто
				const daArray = daMove.split(',');														// Создаем массив из значений атрибута "data-da"
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';							// Если не указано, по умолчанию в конец перенесет
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '2000';					// Если не указано, по умолчанию 2000px (с запасом)
				const daDestination = document.querySelector('.' + daArray[0].trim());		// Куда переносим (класс)
				if (daArray.length > 0 && daDestination) {											// Если массив с параметрами существует и есть куда переносить (класс)
					daElement.setAttribute('data-da-index', number);								// Добавляем каждому элементу data-атрибут с его порядковым номером (напрмер, data-da-index="1")
					// Заполняем массив первоначальных позиций (чтобы все перемещенные элементы можно было вернуть на место)
					originalPositions[number] = {
						"parent": daElement.parentNode,													// Родитель каждого перемещаемого элемента
						"index": indexInParent(daElement)												// Позиция этого элемента в родителе. indexInParent - Функция получения индекса внутри родителя (описана ниже)
					};
					// Заполняем массив элементов (чтобы его отсортировать для верной работы - функция dynamicAdaptSort)
					daElementsArray[number] = {
						"element": daElement,																// Перемещаемый элемент
						"destination": document.querySelector('.' + daArray[0].trim()),		// Выбираем html-элемент (по его классу, который мы указываем на первой позиции в дата-атрибуте), куда будем делать пермещение
						"place": daPlace,																		// В какую позицию перемещаем. Метод trim() удаляет пробельные символы с начала и конца строки (на всякий случай)
						"breakpoint": daBreakpoint															// Брейкпоинт для перемещения (3-я позиция в дата-атибуте)
					}
					number++;																					// Увеличиваем счетчик
				}
			}
		}
		dynamicAdaptSort(daElementsArray);																// Здесь происходит сортировка массива

		// Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];															// "element" - каждый перемещаемый элемент
			const daBreakpoint = el.breakpoint;															// Брйкпоинт для каждого перемещаемого элемента
			const daType = "max";

			// Вместо того, чтобы слушать все время изменение размера окна (window.addEventListener("resize", funtcion)), мы будем слушать изменение размера окна ТОЛЬКО в точке брейкпоинта (window.matchMedia). Это снижаем нагрузку на браузер
			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + (daBreakpoint / 16) + "rem)"));		// Напоняем массив всех брейкоинтов (переводим px в rem)
			// daMatchMedia[index].addListener(dynamicAdapt);																	// Устарел (Устаревший addListener() метод интерфейса MediaQueryList добавляет прослушиватель, который MediaQueryListener будет запускать пользовательскую функцию обратного вызова в ответ на изменение статуса медиа-запроса).
			daMatchMedia[index].addEventListener("change", dynamicAdapt);													// На каждый брейкпоинт вешаем событие "dynamicAdapt" (функцию)
		}
	}

	// Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];							// Каждый перемещаемый элемент, хранящийся в объекте "da_elements_array"
			// Создаем переменные из объекта "daElementsArray"
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;		// Класс, который будем добавлять перемещаемому элементу

			if (daMatchMedia[index].matches) {								// Проверяем наличие брейкпоинта (того или иного)
				if (!daElement.classList.contains(daClassname)) {		// Если элемент не содержит класс перемещенного элемента
					// Определяем, в какое место (позицию в родителе) перемещать каждый элемент
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];		// indexOfElements - метод получения индекса при перебросе элемента. Это функция получения массива индексов внутри родителя (описана ниже)
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					// Перебрасываем элементы
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);		// Метод Node.insertBefore() добавляет элемент в список дочерних элементов родителя перед указанным элементом. Синтаксис: parentElement.insertBefore(newElement, referenceElement), где: parentElement - Родитель для нового элемента, newElement - Элемент для вставки, referenceElement - Элемент, перед которым будет вставлен newElement
					daElement.classList.add(daClassname);
				}
			} else {
				// Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);								// Вызываем функцию возврата элемента на место
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	// Вызов основной функции (Запустится при загрузке страницы)
	dynamicAdapt();

	// Функция возврата элемента на место
	function dynamicAdaptBack(el) {
		// Опрелеяем переменные относительно родителя перемещенного элемента
		const daIndex = el.getAttribute('data-da-index');				// Получаем значение атрибута data-da-index для родителя элемента
		const originalPlace = originalPositions[daIndex];				// Берем соответствующий массив (объект), хранящий первоначальные данные об элементе в родителе
		const parentPlace = originalPlace['parent'];						// Родитель перемещаемого элемента
		const indexPlace = originalPlace['index'];						// Позиция этого элемента в родителе
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);		// Перемещаем обратно
	}

	// Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}

	// Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				// Исключая перенесенный элемент
				/* когда переносим элемент в одно и то же место, для того чтобы было все
				адекватно и чтобы элементы выстраивались в том порядке, в котором мы хотим
				нужно при переносе исключить уже перенесенный ранее элемент в ту же точку */
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}

	// Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }		// Для MobileFirst поменять
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}

	// Дополнительные сценарии адаптации
	function customAdapt() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
};

// Пояснения https://www.youtube.com/watch?v=QKuMr575vlQ
// Пояснения https://habr.com/ru/articles/502028/




