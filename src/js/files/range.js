// Инструкция: https://refreshless.com/nouislider/

// Подключение из node_modules
import * as noUiSlider from 'nouislider';

// Подключение подсказок ползунков настраиваемом числоаом формате
import "./range-format-wnum.js";

// Подключение станадртных стилей из node_modules (не работает: нужен соответствующий загрузчик для обработки этого типа файла)
// import 'nouislider/dist/nouislider.css';

// Подключение станадртных стилей в файле: scss/base/forms/_forms.scss (копия станадртных стилей из node_modules)
// Настройка стилей в файле: scss/base/forms/range.scss

// Для каждого вида Слайдера Диапазона нужно создать отдельную функцию с другими параметрами
// Каждому виду Слайдера Диапазона следует указать уникальный атрибут data-range-name

// ==========================================================================================================================

// Для цены (самовызывающаяся функция)
(function rangeInitPrice() {

	const rangeSliders = document.querySelectorAll('[data-range-price]');

	if (rangeSliders.length) {
		rangeSliders.forEach(rangeSlider => {

			const fromInput = rangeSlider.querySelector('[data-range-from]');			// Выбираем инпут с дата-атрибутом "data-range-from"
			const fromData = Number(fromInput.dataset.rangeFrom);							// Значение "data-range-from" - это минимальное значение диапазона. Переводим в число
			const fromValue = fromInput.value;													// Значение атрибута value - стартовое меньшее значение диапазона (от). Переводим в число

			const toInput = rangeSlider.querySelector('[data-range-to]');				// Выбираем инпут с дата-атрибутом "data-range-to"
			const toData = Number(toInput.dataset.rangeTo);									// Значение "data-range-to" - это максимальное значение диапазона. Переводим в число
			const toValue = toInput.value;														// Значение атрибута value - стартовое большее значение диапазона (до). Переводим в число

			const stepsSlider = rangeSlider.querySelector('[data-range-item]');		// Выбираем див с дата-атрибутом data-range-item - сам ползунок

			const inputs = [fromInput, toInput];												// Добавляем инпуты в отдельный массив (для функции связки инпутов с ползуками)

			// Функция noUiSlider для работы ползунка
			noUiSlider.create(stepsSlider, {

				// Размер шкалы
				range: {
					'min': fromData,
					'max': toData
				},
				// Шаг перемешения ползунка
				step: 500,

				// Стартовая позиция ползунков
				start: [fromValue, toValue],
				// ... должно быть не менее 300 друг от друга
				// margin: 300,
				// ... но не более 600
				// limit: 600,

				// Отображение цветных полос между ползунками
				connect: true,

				// Put '0' at the bottom of the slider (Направление диапазона)
				// direction: 'rtl',
				// orientation: 'vertical',

				// Перемещение соседних ползунков при нажатии на полосу между ними
				// behaviour: 'tap-drag',

				// Показывать подсказки над ползунками. Можно выборочно (tooltips: [true, false],)
				tooltips: true,

				// Числовой формат подсказок (для этого надо подключить дополнительный скрипт, см. в начале файла)
				// decimals: 0 (количество знаков после запятой, без подключения скрипта - 2 знака)
				format: wNumb({
					decimals: 0
				}),

				// Показать шкалу с помощью ползунка
				// pips: {
				// 	mode: 'steps',		// хз для чего
				// 	stepped: true,		// Показывает числа на шкале = шагу ползунка, если включен параметр "step: 500,"
				// 	density: 4			// Чем больше значение, тем крупнее шкала
				// }
			});

			// ==========================================================================================================================

			// Связываем ползунки с инпутами (при перетягивании ползунков меняетя значение инпутов)

			stepsSlider.noUiSlider.on('update', function (values, handle) {
				inputs[handle].value = values[handle];
			});

			// ==========================================================================================================================

			// Связываем инпуты с ползунками (при изменении значение инпута меняется положение позунка)

			// Слушаем события keydown в поле ввода
			inputs.forEach(function (input, handle) {

				input.addEventListener('change', function () {
					stepsSlider.noUiSlider.setHandle(handle, this.value);
				});

				input.addEventListener('keydown', function (e) {

					var values = stepsSlider.noUiSlider.get();
					var value = Number(values[handle]);

					// [[handle0_down, handle0_up], [handle1_down, handle1_up]]
					var steps = stepsSlider.noUiSlider.steps();

					// [down, up]
					var step = steps[handle];

					var position;

					// 13 is enter,
					// 38 is key up,
					// 40 is key down.
					switch (e.which) {

						case 13:
							stepsSlider.noUiSlider.setHandle(handle, this.value);
							break;

						case 38:

							// Get step to go increase slider value (up)
							position = step[1];

							// false = no step is set
							if (position === false) {
								position = 1;
							}

							// null = edge of slider
							if (position !== null) {
								stepsSlider.noUiSlider.setHandle(handle, value + position);
							}

							break;

						case 40:

							position = step[0];

							if (position === false) {
								position = 1;
							}

							if (position !== null) {
								stepsSlider.noUiSlider.setHandle(handle, value - position);
							}

							break;
					}
				});
			});
		});
	}
}());

// ==========================================================================================================================

// Для размеров
(function rangeInitSize() {

	const rangeSliders = document.querySelectorAll('[data-range-size]');

	if (rangeSliders.length) {
		rangeSliders.forEach(rangeSlider => {

			const fromInput = rangeSlider.querySelector('[data-range-from]');			// Выбираем инпут с дата-атрибутом "data-range-from"
			const fromData = Number(fromInput.dataset.rangeFrom);							// Значение "data-range-from" - это минимальное значение диапазона. Переводим в число
			const fromValue = fromInput.value;													// Значение атрибута value - стартовое меньшее значение диапазона (от). Переводим в число

			const toInput = rangeSlider.querySelector('[data-range-to]');				// Выбираем инпут с дата-атрибутом "data-range-to"
			const toData = Number(toInput.dataset.rangeTo);									// Значение "data-range-to" - это максимальное значение диапазона. Переводим в число
			const toValue = toInput.value;														// Значение атрибута value - стартовое большее значение диапазона (до). Переводим в число

			const stepsSlider = rangeSlider.querySelector('[data-range-item]');		// Выбираем див с дата-атрибутом data-range-item - сам ползунок

			const inputs = [fromInput, toInput];												// Добавляем инпуты в отдельный массив (для функции связки инпутов с ползуками)

			// Функция noUiSlider для работы ползунка
			noUiSlider.create(stepsSlider, {

				// Размер шкалы
				range: {
					'min': fromData,
					'max': toData
				},
				// Шаг перемешения ползунка
				// step: 5,

				// Стартовая позиция ползунков
				start: [fromValue, toValue],
				// ... должно быть не менее 300 друг от друга
				// margin: 300,
				// ... но не более 600
				// limit: 600,

				// Отображение цветных полос между ползунками
				connect: true,

				// Put '0' at the bottom of the slider
				// direction: 'rtl',
				// orientation: 'vertical',

				// Перемещение соседних ползунков при нажатии на полосу между ними
				// behaviour: 'tap-drag',

				// Показывать подсказки над ползунками. Можно выборочно (tooltips: [true, false],)
				tooltips: false,

				// Числовой формат подсказок (для этого надо подключить дополнительный скрипт, см. в начале файла)
				// decimals: 0 (количество знаков после запятой, без подключения скрипта - 2 знака)
				format: wNumb({
					decimals: 0
				}),

				// Показать шкалу с помощью ползунка
				// pips: {
				// 	mode: 'steps',		// хз для чего
				// 	stepped: true,		// Показывает числа на шкале = шагу ползунка, если включен параметр "step: 500,"
				// 	density: 4			// Чем больше значение, тем крупнее шкала
				// }
			});

			// ==========================================================================================================================

			// Связываем ползунки с инпутами (при перетягивании ползунков меняетя значение инпутов)

			stepsSlider.noUiSlider.on('update', function (values, handle) {
				inputs[handle].value = values[handle];
			});

			// ==========================================================================================================================

			// Связываем инпуты с ползунками (при изменении значение инпута меняется положение позунка)

			// Слушаем события keydown в поле ввода
			inputs.forEach(function (input, handle) {

				input.addEventListener('change', function () {
					stepsSlider.noUiSlider.setHandle(handle, this.value);
				});

				input.addEventListener('keydown', function (e) {

					var values = stepsSlider.noUiSlider.get();
					var value = Number(values[handle]);

					// [[handle0_down, handle0_up], [handle1_down, handle1_up]]
					var steps = stepsSlider.noUiSlider.steps();

					// [down, up]
					var step = steps[handle];

					var position;

					// 13 is enter,
					// 38 is key up,
					// 40 is key down.
					switch (e.which) {

						case 13:
							stepsSlider.noUiSlider.setHandle(handle, this.value);
							break;

						case 38:

							// Get step to go increase slider value (up)
							position = step[1];

							// false = no step is set
							if (position === false) {
								position = 1;
							}

							// null = edge of slider
							if (position !== null) {
								stepsSlider.noUiSlider.setHandle(handle, value + position);
							}

							break;

						case 40:

							position = step[0];

							if (position === false) {
								position = 1;
							}

							if (position !== null) {
								stepsSlider.noUiSlider.setHandle(handle, value - position);
							}

							break;
					}
				});
			});
		});
	}
}());

// ==========================================================================================================================

//  Как работает

/*
<div id="slider"></div>

// --------------------------------------------

var slider = document.getElementById('slider');

noUiSlider.create(slider, {
	 start: [20, 80],
	 connect: true,
	 range: {
		  'min': 0,
		  'max': 100
	 }
});
*/