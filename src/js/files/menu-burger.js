// Активация бургера

"use strict";

const iconMenu = document.querySelector('.icon-menu');		// выбираем нашу иконку меню
if (iconMenu) {     														// проверяем существует ли такой объект
	const menuBody = document.querySelector('.menu');       	// выбираем наше меню

	iconMenu.addEventListener("click", function () {			// событие "клик" по иконке

		// Если меню активно (открыто)
		if (iconMenu.classList.contains('_active')) {
			iconMenu.classList.remove('_active');					// удаляем класс
			menuBody.classList.remove('_active');					// удаляем класс
			document.body.classList.remove('_lock');				// удаляем класс для body
		} else {
			// Показываем меню
			iconMenu.classList.add('_active');						// добавляем класс
			menuBody.classList.add('_active');						// добавляем класс
			document.body.classList.add('_lock');					// добавляем класс для body

			// Вешаем прослушку (по клику) на весь документ
			document.addEventListener("click", closeMenu);

			// Вешаем прослушку (по нажатию клавиш) на весь документ
			document.addEventListener("keyup", closeMenuEscape);

			// Функция для скрытия основного меню
			function closeMenu(event) {
				// Если клик сделан НЕ по меню И (&&) НЕ по иконке мобильного меню (крестик)
				if (!event.target.closest('.menu') && !event.target.closest('.icon-menu')) {
					iconMenu.classList.remove('_active');
					menuBody.classList.remove('_active');
					document.body.classList.remove('_lock');
					// Удаляем текущую прослушку со всего документа
					document.removeEventListener("click", closeMenu);
					document.removeEventListener("keyup", closeMenuEscape);
				}
			}

			// Функция скрытия окна (нажатие клавиши)
			function closeMenuEscape(event) {
				// Если нажата клавиша Escape
				if (event.code === 'Escape') {
					iconMenu.classList.remove('_active');
					menuBody.classList.remove('_active');
					document.body.classList.remove('_lock');
					// Удаляем текущую прослушку со всего документа
					document.removeEventListener("keyup", closeMenuEscape);
					document.removeEventListener("click", closeMenu);
				}
			}
		}
	});
}
