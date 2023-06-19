const tooltipElements = document.querySelectorAll('[data-tooltip]');					// Все элементы с атрибутом "data-tooltip"
if (tooltipElements.length) {
	document.addEventListener("mouseover", documentHover);								// Один обработчик на все события "hover"
	function documentHover(e) {
		const targetElement = e.target;															// Элемент, на который навели мышкой
		if (targetElement.closest('[data-tooltip]')) {
			const tooltipElement = targetElement.closest('[data-tooltip]');			// Конкретный элемент с атрибутом "data-tooltip", на кторый навели
			// Вызываем функцию показ подсказки и передаем ей аргумент - элемент с атрибутом "data-tooltip"
			showTooltip(tooltipElement);
		}
	}
};

// Функция показа подсказки
function showTooltip(tooltipElement) {
	const tooltipText = tooltipElement.dataset.tooltip;									// Получаем текст подсказки
	tooltipElement.insertAdjacentHTML(															// Выводим html-блок внутри наешго блока с подсказкой
		"beforeend",
		`<span class="tooltip">${tooltipText}</span>`
	);
	tooltipElement.addEventListener("mouseout", hideTooltip);							// Вешаем прослушку для удаления подсказки

	// Функция скрытия подсказки
	function hideTooltip(event) {
		tooltipElement.querySelector('.tooltip').remove();									// Удаляем подсказку
		tooltipElement.removeEventListener("mouseout", hideTooltip);					// Удаляем прослушку
	}
}

// ==========================================================================================================================

// Если нужео поработать с подсказаки (рассомментировать код)
// tooltipElements.forEach(tooltipElement => {
// 	const tooltipText = tooltipElement.dataset.tooltip;
// 	tooltipElement.insertAdjacentHTML(															// Выводим html-блок внутри наешго блока с подсказкой
// 		"beforeend",
// 		`<span class="tooltip">${tooltipText}</span>`
// 	);
// });




