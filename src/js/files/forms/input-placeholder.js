// При клике скрываем плейсхолдер инпута

const formInputs = document.querySelectorAll('[data-placeholder]');
if (formInputs.length > 0) {
	for (let index = 0; index < formInputs.length; index++) {
		const formInput = formInputs[index];
		const formInputsPlaceholder = formInput.placeholder;

		// Вешаем прослушку на инпут: событие - фокус
		formInput.addEventListener("focus", function (event) {
			formInput.placeholder = "";
		});
		// Вешаем прослушку на инпут: событие - потеря фокуса
		formInput.addEventListener("blur", function (event) {
			formInput.placeholder = formInputsPlaceholder;
		});
	}
}

