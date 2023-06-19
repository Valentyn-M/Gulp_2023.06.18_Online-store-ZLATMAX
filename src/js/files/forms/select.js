// СОЗДАЁМ ГИБРИДНЫЙ СЕЛЕКТ (https://web-standards.ru/articles/native-and-custom-select/)
/*
Гибридный селект состоит из двух селектов, каждый из которых показывается в нужный для него момент:
1) Нативный (родной) селект, видимый и доступный по умолчанию.
2) Кастомный селект, скрытый до тех пор, пока не произойдёт взаимодействие посредством мыши.
*/
/*
JavaScript добавляет несколько обработчиков событий:
1) Один для события клика, по которому в игру вступает кастомный селект, раскрываясь и показывая варианты выбора.
2) Один, чтобы синхронизировать выбранные варианты Кастомного и Нативного селекта. При изменении одного варианта выбора, меняется и второй.
3) И ещё один для установки навигации через клавиатуру с помощью клавиш Up и Down, выбора варианта с помощью клавиш Enter или Space, и закрытия списка через Esc.
*/

// ==========================================================================================================================

const selects = document.querySelectorAll('.select');
if (selects.length > 0) {
	// Проходим циклом по все селектам и работаем с каждым
	for (let index = 0; index < selects.length; index++) {
		const select = selects[index];

		// Добавляем идентификатор для Лейбл каждого селектора (для правильной сментики)
		const selectLabel = select.querySelector('.select__label');
		selectLabel.setAttribute('id', `select__label-${index + 1}`);

		// Получаем "живую" коллекцию, состоящую из Нативного селекта
		const selectNative = select.getElementsByClassName("select-native")[0];		// <select></select>
		const selectNativeList = selectNative.children;										// Список option Нативного селекта (это не массив)

		// Добавляем такой же идентификатор (как и для Лейбл) для атрибута "aria-labelledby" Нативного селекта, чтобы их связать
		selectNative.setAttribute('aria-labelledby', `select__label-${index + 1}`);

		// ==========================================================================================================================

		// Строим Кастомный селект на основе Нативного

		// Добавляем Основной блок
		selectNative.insertAdjacentHTML(
			"afterend",
			'<div class="select-custom"><div tabindex="0" class="select-custom__header header-select"><div class="header-select__text"></div><div class="header-select__icon"></div></div><div class="select-custom__body" hidden><ul class="select-custom__list"></ul></div></div></div>'
		);

		// Получаем "живую" коллекцию созанного Кастомного селектов
		const selectCustom = select.getElementsByClassName("select-custom")[0];		// Выбираем Кастомнный селект в каждом Селекте
		const selectCustomHeader = selectCustom.children[0];								// Заголовок списка Кастомного селекта
		const selectCustomHeaderText = selectCustomHeader.children[0];					// Текст Заголовка списка Кастомного селекта
		const selectCustomBody = selectCustom.children[1];									// Тело Кастомного селекта (это не массив)
		const selectCustomList = selectCustomBody.children[0];							// Список Кастомного селекта (это не массив)

		// Проходим циклом по всем option Нативного селекта
		for (let index = 0; index < selectNativeList.length; index++) {
			const option = selectNativeList[index];											// <option></option>
			const optionSelected = option.selected;											// Свойство selected (true or false)
			const optionDisabled = option.disabled;											// Свойство disabled (true or false)
			const optionValue = option.value;													// Свойство value (1, 2, 3, 4, 5)
			const optionContent = option.innerHTML;											// Сoдержимое option

			// Заполняем Заголовок Кастомного селекта
			if (optionSelected) {
				selectCustomHeaderText.textContent = optionContent;
			}

			// Если <option> имеет атрибут disabled (чтобы его нельзя было выбрать, только показать в заголовке один раз)
			const classHidden = optionDisabled ? " _hidden" : "";							// Класс для скрытия элемента списка Кастомного селекта

			// Заполняем список Кастомного селекта
			selectCustomList.insertAdjacentHTML(
				"beforeend",
				`<li class="select-custom__option${classHidden}" data-value="${optionValue}" tabindex="-1">${optionContent}</li>`
			);
		};

		// Получаем первоначальное значение заголовка селекта
		const selectCustomHeaderTextValueInitial = selectCustomHeaderText.textContent;


		// ==========================================================================================================================

		// Основной код работы Гибридного селекта

		const customListArray = Array.from(selectCustomList.children);					// Создаем массив из списка Кастомного селекта (Метод Array.from() создаёт новый экземпляр Array из массивоподобного или итерируемого объекта)
		const optionsCount = customListArray.length;											// Получаем длину массива

		let optionChecked = "";
		let optionHoveredIndex = -1;

		// Показываем тело (список) Кастомного селекта при клике на Заголовок
		selectCustomHeader.addEventListener("click", (e) => {
			const isClosed = !selectCustom.classList.contains("_select-active");		// Переменная isClosed хранит состояние закрытого Кастомного селекта (не содержит класс _select-active)
			if (isClosed) {
				openSelectCustom();																	// Вызываем функцию Открытия Кастомного селекта
			} else {
				closeSelectCustom();																	// Вызываем функцию Закрытия Кастомного селекта
			}
		});

		// Показываем тело (список) Кастомного селекта при нажатии Enter на Заголовок
		selectCustomHeader.addEventListener('keydown', function (event) {
			if (event.code === 'Enter') {
				const isClosed = !selectCustom.classList.contains("_select-active");		// Переменная isClosed хранит состояние закрытого Кастомного селекта (не содержит класс _select-active)
				if (isClosed) {
					openSelectCustom();																	// Вызываем функцию Открытия Кастомного селекта
				} else {
					closeSelectCustom();																	// Вызываем функцию Закрытия Кастомного селекта
				}
			}
		});

		// Показываем тело (список) Кастомного селекта при нажатии Arrow-Down на Заголовок
		selectCustomHeader.addEventListener('keydown', function (event) {
			if (event.code === 'ArrowDown') {
				const isClosed = !selectCustom.classList.contains("_select-active");		// Переменная isClosed хранит состояние закрытого Кастомного селекта (не содержит класс _select-active)
				if (isClosed) {
					openSelectCustom();																	// Вызываем функцию Открытия Кастомного селекта
				}
			}
		});

		// Функция открытия Кастомного селекта
		function openSelectCustom() {
			selectCustom.classList.add("_select-active");									// Добавляем активный класс
			_slideDown(selectCustomBody, 200);													// Вызываем функцию показа тела селекта в виде слайда

			// Добавляем значение "data-value" в переменную optionChecked (выбраный элемент)
			if (optionChecked) {
				const optionCheckedIndex = customListArray.findIndex((el) => el.getAttribute("data-value") === optionChecked);
				updateCustomSelectHovered(optionCheckedIndex);								// Передаем значение выбранного опшион в функцию updateCustomSelectHovered, чтобы присвоить ему класс _option-hover
			}

			// Добавляем связанные прослушиватели событий
			document.addEventListener("click", watchClickOutside);						// Отслеживаем клики при открытом селекте. Функция "watchClickOutside" закрывает селект
			document.addEventListener("keydown", watchPressKeyEsc);						// При нажатии на клавиатуру вызываем функцию "supportKeyboardNavigation"
			selectCustom.addEventListener("keydown", watchKeyboardNavigation);		// Навигация по списку клавишами клавиатуры
		}

		// Функция закрытия Кастомного селекта
		function closeSelectCustom() {
			selectCustom.classList.remove("_select-active");								// Удаляем активный класс
			_slideUp(selectCustomBody, 200);														// Вызываем функцию скрытия тела селекта в виде слайда

			updateCustomSelectHovered(-1);

			// Удаляем связанные прослушиватели событий
			document.removeEventListener("click", watchClickOutside);
			document.removeEventListener("keydown", watchPressKeyEsc);
			selectCustom.removeEventListener("keydown", watchKeyboardNavigation);
		}

		// Функция которая добавляет классс _option-hover для опшион (элемента списка Кастомного селекта). Эта функция имспользуется для перемещения по списку с клавиатуры
		function updateCustomSelectHovered(newIndex) {
			const prevOption = selectCustomList.children[optionHoveredIndex];
			const option = selectCustomList.children[newIndex];

			if (prevOption) {
				prevOption.classList.remove("_option-hover");
			}
			if (option) {
				option.classList.add("_option-hover");
			}

			optionHoveredIndex = newIndex;
		}

		// Функция которая добавляем классс _option-active для опшион (элемента списка Кастомного селекта)
		function updateCustomSelectChecked(value, text) {
			const prevValue = optionChecked;

			const elPrevOption = selectCustomList.querySelector(
				`[data-value="${prevValue}"`
			);
			const elOption = selectCustomList.querySelector(`[data-value="${value}"`);

			if (elPrevOption) {
				elPrevOption.classList.remove("_option-active");
			}
			if (elOption) {
				elOption.classList.add("_option-active");
			}

			// Заполняем значениями оба селекта
			selectCustomHeaderText.textContent = text;
			optionChecked = value;

			// Если селект был изменен (выбран като-то элемент списка), то добавляем класс (он необходитм для отслеживания событий изменения заголовка помощью MutationObserver)
			if (selectCustomHeaderTextValueInitial !== selectCustomHeaderText.textContent) {
				if (!selectCustomHeaderText.classList.contains('_changed')) {
					selectCustomHeaderText.classList.add('_changed');
				}
			} else {
				selectCustomHeaderText.classList.remove('_changed');
			}
		}

		// Закрываем Кастомный селект при клике за его пределами
		function watchClickOutside(e) {
			const didClickedOutside = !selectCustom.contains(e.target);
			if (didClickedOutside) {
				closeSelectCustom();
			}
		}

		// Закрываем Кастомный селект при нажатии клавиши Esc
		function watchPressKeyEsc(event) {
			if (event.code === 'Escape') {
				closeSelectCustom();
			}
		}

		// Премещаемся по списку клавиатурой
		function watchKeyboardNavigation(event) {
			let option;																									// Номер элемента для фокуса будет в этой перменной
			const optionHover = selectCustomList.querySelector('._option-hover');					// Элемент списка, на котором остановился hover ранее
			const optionHoverNumber = customListArray.findIndex(i => i == optionHover);			// Номер Активного элемента списка

			// 1) Если есть такой класс. 2) Начинаем перемещение с предыдущего выбранного элемента. 3) Начинаем с начала (при новом клике)
			optionHover ? option = optionHoverNumber : option = -1;

			// Клавиша "Вниз"
			if (event.code === 'ArrowDown') {
				if (option < (customListArray.length - 1)) {
					const selectCustomListItemNext = selectCustomList.children[++option];			// Следующий Элемент списка
					selectCustomListItemNext.focus();
					// Сначала удаляем все классы установленные до этого
					customListArray.forEach(customListEltment => {
						if (customListEltment.classList.contains('_option-hover')) {
							customListEltment.classList.remove('_option-hover');
						}
					});
					// Теперь добавляем класс
					selectCustomListItemNext.classList.add('_option-hover');
				}
				event.preventDefault();
			}

			// Клавиша "Вверх"
			if (event.code === 'ArrowUp') {
				if (option > 0) {
					const selectCustomListItemPrevious = selectCustomList.children[--option];			// Предыдущий Элемент списка
					selectCustomListItemPrevious.focus();
					// Сначала удаляем все классы установленные до этого
					customListArray.forEach(customListEltment => {
						if (customListEltment.classList.contains('_option-hover')) {
							customListEltment.classList.remove('_option-hover');
						}
					});
					// Теперь добавляем класс
					selectCustomListItemPrevious.classList.add('_option-hover');
				}
				event.preventDefault();
			}
		}

		// Обновляем значение selectCustom при изменении selectNative (эта функция уже не используется (сделано одностороннее управление через кастомный селект))
		selectNative.addEventListener("change", (e) => {
			const value = e.target.value;
			const elRespectiveCustomOption = selectCustomList.querySelectorAll(`[data-value="${value}"]`)[0];

			updateCustomSelectChecked(value, elRespectiveCustomOption.textContent);
		});

		// Обновить значение selectCustom при определенном действии на элементе списка
		customListArray.forEach(function (elOption, index) {
			// При клике на элементе списка
			elOption.addEventListener("click", (e) => {
				const value = e.target.getAttribute("data-value");
				// Синхронизируем Нативный селект, чтобы иметь то же значение
				selectNative.value = value;
				updateCustomSelectChecked(value, e.target.textContent);
				closeSelectCustom();
			});

			// Нажатие Enter на элементе списка
			elOption.addEventListener("keydown", (e) => {
				if (e.code === 'Enter') {
					const value = e.target.getAttribute("data-value");
					// Синхронизируем Нативный селект, чтобы иметь то же значение
					selectNative.value = value;
					updateCustomSelectChecked(value, e.target.textContent);
					closeSelectCustom();
				}
			});

			// Наведение мышкой на элементе списка
			elOption.addEventListener("mouseenter", (e) => {
				updateCustomSelectHovered(index);
			});

			// TODO: Переключаем эти прослушиватели событий на основе видимости selectCustom
		});
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

	// ==========================================================================================================================

}

// // ==========================================================================================================================

// /*
// Нативный (родной) <select> обладает более широким списком возможностей, которые достаются нам бесплатно и не входят в этот список требований:
// 1) Выбранный вариант доступен для восприятия всеми пользователями, вне зависимости от их возможностей зрения.
// 2) С компонентом можно предсказуемо взаимодействовать с помощью клавиатуры во всех браузерах — например, используя клавиши стрелок для навигации, Enter для выбора, Esc для отмены и так далее.
// 3) Вспомогательные технологии (например, скринридеры) чётко объявляют пользователям элемент, называя его роль, имя и состояние.
// 4) Положение списка регулируется, то есть он не обрезается за краями экрана.
// 5) Элемент следует настройкам операционной системы пользователя — например, высокую контрастность, цветовую схему, ограничение движений и другие.

// Дополнительные характеристики, за которыми нужно следить:
// - Выбирается ли опция списка сразу же при получения фокуса с клавиатуры?
// - Можно ли использовать Enter и Space для выбора варианта?
// - Нажатие на Tab переносит нас к следующему варианут списка или же к следующему элементу формы?
// - Что будет, когда вы достигнете последнего варианта в списке с помощью стрелок? Фокус замрет на последнем варианте, вернется к первому или же, что хуже всего, перейдет к следующему элементу формы?
// - Возможно ли перейти к последней опции списка с помощью клавиши Page Down?
// - Можно ли прокручивать элементы списка, если их больше, чем в поле видимости в данный момент?
// */

// // ==========================================================================================================================

// // Готовая конструкция Гибридного селекта
// // если лейбл не нужен, то просто оставить пустым span

// /*
// <div class="catalog__select select">
// 	<span class="select__label">Сортировать</span>
// 	<div class="select__wrapper">
// 		<select class="select-native" name="form[]">
// 			<option value="1" selected>По умолчанию</option>
// 			<option value="2">По популярности</option>
// 			<option value="3">По цене</option>
// 			<option value="4">По наименованию</option>
// 			<option value="5">По производителю</option>
// 		</select>

// 		<div class="select-custom" aria-hidden="true">
// 			<div class="select-custom__header">По умолчанию</div>
// 			<ul class="select-custom__list">
// 				<li class="select-custom__option" data-value="1">По умолчанию</li>
// 				<li class="select-custom__option" data-value="2">По популярности</li>
// 				<li class="select-custom__option" data-value="3">По цене</li>
// 				<li class="select-custom__option" data-value="4">По наименованию</li>
// 				<li class="select-custom__option" data-value="5">По производителю</li>
// 			</ul>
// 		</div>
// 	</div>
// </div>
// */

// // ==========================================================================================================================

// // Вариант Гибридного селекта с отключенным первым парамаетром (пример здесь: https://codepen.io/sandrina-p/pen/YzyOYRr?editors=1010)

// /*
// <div class="catalog__select select">
// 	<span class="select__label"></span>
// 	<div class="select__wrapper">
// 		<select class="select-native" name="form[]">
// 			<option value="1" selected disabled>Выберите из списка</option>
// 			<option value="2">По популярности</option>
// 			<option value="3">По цене</option>
// 			<option value="4">По наименованию</option>
// 			<option value="5">По производителю</option>
// 		</select>

// 		<div class="select-custom" aria-hidden="true">
// 			<div class="select-custom__header">Выберите из списка</div>
// 			<ul class="select-custom__list">
// 				<li class="select-custom__option hidden" data-value="1">Выберите из списка</li>
// 				<li class="select-custom__option" data-value="2">По популярности</li>
// 				<li class="select-custom__option" data-value="3">По цене</li>
// 				<li class="select-custom__option" data-value="4">По наименованию</li>
// 				<li class="select-custom__option" data-value="5">По производителю</li>
// 			</ul>
// 		</div>
// 	</div>
// </div>
// */
