const quantityItems = document.querySelectorAll('.quantity');

if (quantityItems.length) {
	quantityItems.forEach(quantityItem => {
		const buttonMinus = quantityItem.querySelector('.quantity__button_minus');
		const buttonPlus = quantityItem.querySelector('.quantity__button_plus');
		const input = quantityItem.querySelector('.quantity__input').children[0];

		const price = document.querySelector('.actions-product__price');					// Выбираем цену
		const priceValue = parseInt(price.textContent.replace(/ /g, ''), 10);			// Получем значение цены: методом replace() убираем все пробелы, а методом parseInt() пеерводим строку в число

		// Кнопка +
		buttonPlus.addEventListener("click", increaseValue);

		// Кнопка -
		buttonMinus.addEventListener("click", decreaseValue);

		// Клавиша "Стелка вниз"
		input.addEventListener('keydown', function (event) {
			if (event.code === 'ArrowDown') {
				decreaseValue();
			}
		});

		// Клавиша "Стрелка вверх"
		input.addEventListener('keydown', function (event) {
			if (event.code === 'ArrowUp') {
				increaseValue();
			}
		});

		// Ввод значения вручную
		input.addEventListener('change', valueRecalculation);

		// Увеличиваем значение
		function increaseValue() {
			let inputValue = parseInt(input.value, 10);											// Получаем значение input.value именно в момент клика. На всякий случай переводим в число
			if (isNaN(inputValue)) {																	// Если пользователь ввел символы, которые функция parseInt() не смогла перевести вчисло...
				input.value = 1;																			// устанавливаем значение 1
			} else {
				if (inputValue > 0) {
					inputValue++;
					input.value = inputValue;
				} else {
					input.value = 1;
				}
			}
			// Меняем цену
			if (price) {
				let priceCalculated = input.value * priceValue;											// Расчитываем цену
				let priceTotal = new Intl.NumberFormat('ru-RU').format(priceCalculated);		// Объект Intl.NumberFormat является конструктором объектов, включающих языка-зависимое форматирование чисел
				price.textContent = priceTotal;																// Заносим в блок новую отформатированную цену
			}
		}

		// Уменьшаем значение
		function decreaseValue() {
			let inputValue = parseInt(input.value, 10);											// Функция parseInt() принимает строку в качестве аргумента и возвращает целое число в соответствии с указанным основанием системы счисления.  В основном пользователи используют десятичную систему счисления и указывают 10.
			if (isNaN(inputValue)) {
				input.value = 1;
			} else {
				if (inputValue > 1) {
					inputValue--;
					input.value = inputValue;
				} else {
					input.value = 1;
				}
			}
			// Меняем цену
			if (price) {
				let priceCalculated = input.value * priceValue;											// Расчитываем цену
				let priceTotal = new Intl.NumberFormat('ru-RU').format(priceCalculated);		// Объект Intl.NumberFormat является конструктором объектов, включающих языка-зависимое форматирование чисел
				price.textContent = priceTotal;																// Заносим в блок новую отформатированную цену
			}
		}

		// Пересчитываем значение
		function valueRecalculation() {
			let inputValue = parseInt(input.value, 10);
			if (isNaN(inputValue)) {
				input.value = 1;
			}
			else if (inputValue < 1) {
				input.value = 1;
			}
			else {
				input.value = inputValue;
			}
			// Меняем цену
			if (price) {
				let priceCalculated = input.value * priceValue;
				let priceTotal = new Intl.NumberFormat('ru-RU').format(priceCalculated);
				price.textContent = priceTotal;
			}
		}
	});
}
