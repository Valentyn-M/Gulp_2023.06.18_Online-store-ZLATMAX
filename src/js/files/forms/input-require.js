"use strict"

// Проверяем ввод email, выводим ошибку
const requireInputs = document.querySelectorAll('[data-required]');		// Все элементы с атрибутом "data-required"
if (requireInputs.length > 0) {

	for (let index = 0; index < requireInputs.length; index++) {
		const requireInput = requireInputs[index];								// Каждый инпут (с ним и будем работать далее)

		const dataInputType = requireInput.dataset.required;					// Получаем значение дата-атрибута data-required каждого элемента
		const dataInputText = requireInput.dataset.error;						// Получаем значение дата-атрибута data-error каждого элемента
		const form = requireInput.closest("form");								// Получаем форму-родителя каждого инпута

		// Событие отправки формы
		form.addEventListener("submit", function (event) {

			// Проверка только для Email
			if (dataInputType === 'email') {
				if (emailTest(requireInput)) {										// Если проверка не пройдена
					addError(requireInput);												// Вызываем функцию для добавления ошибки
					event.preventDefault();												// Запрещаем отправку
				};
				// Вешаем прослушку на Инпут: событие - фокус (пользователь хочет исправить ошибку)
				requireInput.addEventListener("focus", removeErrorInput);
				// Вешаем прослушку на Форму: событие - потеря фокуса
				form.addEventListener("focusout", removeErrorForm);
			}

			// Проверка чекбоксов (не должно быть пустым)
			else if (dataInputType === 'checkbox') {
				if (requireInput.checked === false) {
					addError(requireInput);
					event.preventDefault();
				}
				// Вешаем прослушку на Инпут: событие - фокус (пользователь хочет исправить ошибку)
				requireInput.addEventListener("focus", removeErrorInput);
				// Вешаем прослушку на Форму: событие - потеря фокуса
				form.addEventListener("focusout", removeErrorForm);
			}

			// Проверка текстовых полей (не должно быть пустым)
			else {
				if (requireInput.value === "") {										// Если инпут или текстовое поле пустое
					addError(requireInput);
					event.preventDefault();
				};
				// Вешаем прослушку на Инпут: событие - фокус (пользователь хочет исправить ошибку)
				requireInput.addEventListener("focus", removeErrorInput);
				// Вешаем прослушку на Форму: событие - потеря фокуса
				form.addEventListener("focusout", removeErrorForm);
			}

			// ==========================================================================================================================

			//  Дополнительные функции

			// Функция добавления ошибки (в параметре передаем каждый инпут)
			function addError(input) {
				if (!input.classList.contains("_input-error")) {							// Если еще нет класса ошибки
					input.classList.add("_input-error");										// Добавляем класс ошибки
					const inputParent = input.parentElement;									// Берем родителя-оболочку этого инпута
					inputParent.insertAdjacentHTML(												// Выводим html-блок в родительский элемент
						"beforeend",
						`<div class="_form-error">${dataInputText}</div>`
					);
					const addedBlock = inputParent.querySelector('._form-error');		// Выбираем добаленный блок с ошибкой
					addedBlock.style.display = "none";											// По умолчанию скрываем добавленный блок (ели нужно показать, подключаем отделные стили)
					addedBlock.parentNode.style.position = "relative";						// Добавляем позиционирование для родителя блока с ошибкой (т.к. в тилях он абсолютно позиционируется)
				}
			}

			// Функция потери фокуса инпута
			function removeErrorInput(event) {
				if (requireInput.classList.contains("_input-error")) {
					requireInput.classList.remove("_input-error");						// Удаляем класс ошибки, если он есть
					const addedBlock = form.querySelector('._form-error');			// Выбираем добаленный блок с ошибкой
					addedBlock.remove();
					requireInput.removeEventListener("focus", removeErrorInput);	// Удаляем прослушку
				}
			}

			// Функция потери фокуса формы
			function removeErrorForm(event) {
				// Если фокус все еще находится на форме, то ничего не происходит 
				if (form.contains(event.relatedTarget)) return;
				// В противном случае удаляем класс ошибки, если он есть
				if (requireInput.classList.contains("_input-error")) {
					requireInput.classList.remove("_input-error");
					const addedBlock = this.querySelector('._form-error');
					addedBlock.remove();
					requireInput.removeEventListener("focus", removeErrorForm);
				}
			}

			// Функция проверки email
			function emailTest(input) {
				return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
			}
		});
	}
}



