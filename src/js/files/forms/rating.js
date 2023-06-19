// Описание кода: https://www.youtube.com/watch?v=H8QnlH6sou0 (14:29)
"use srtict"


// Выбираем все рейтинги (их может быть много)
const ratings = document.querySelectorAll('.rating');
if (ratings.length > 0) {
	// Запускаем основную функцию
	initRatings();
}

// Основная функция
function initRatings() {
	let ratingActive, ratingValue;
	// "Бегаем" по всем рейтингам на странице
	for (let index = 0; index < ratings.length; index++) {
		const rating = ratings[index];										// Каждый рейтинг на странице
		// Вызываем функцию и передаем в нее каждый рейтинг
		initRating(rating);
	}

	// Инициализируем конкретный рейтинг
	function initRating(rating) {
		// Вызываем функцию Инициализации переменных
		initRatingVars(rating);

		// Вызываем функцию просчета ширины активной полосы
		setRatingActiveWidth();

		// Даем возможность указывать рейтинг пользователем (только при наличии класса "rating_set" у родителя ".rating")
		if (rating.classList.contains('rating_set')) {
			// Вызываем функцию изменения рейтинга
			setRating(rating);
		}
	}

	// Вспомагательные функции для initRating
	// Инициализация переменных
	function initRatingVars(rating) {
		// Инициализируем переменные, ранее объявленные
		ratingActive = rating.querySelector('.rating__active');			// Активная желтая полоса (для конкретного рейтинга)
		ratingValue = rating.querySelector('.rating__value');				// Оценка конкретного рейтига
	}
	// Изменяем ширину активных звезд (работаем с активной желтой полосой)
	function setRatingActiveWidth(index = ratingValue.innerHTML) {		// index = ratingValue.innerHTML - функция имеет значние по умолчанию ".rating__value" (которое уже сейчас есть у этого рейтинга)
		const ratingActiveWidth = index / 0.05;								// Вычисление процентов заполнения (0.05 - потому что у нас 5 звезд. Например: 3.7 / 0.05 = 74%)
		ratingActive.style.width = `${ratingActiveWidth}%`;				// Заполняем css-свойство width активной полосы ранее высчитанным значением + добавляем значок процентов
	}
	// Возможность указать оценку
	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.rating__item');	// Получаем массив радио-кнопок (каждого конкретного рейтинга)
		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];								// Каждая радио-кнопка
			// Наводим мышью
			ratingItem.addEventListener("mouseenter", function (e) {
				// Обновление переменных
				initRatingVars(rating);
				// Обновление активных звезд
				setRatingActiveWidth(ratingItem.value);						// Вызываем функцию с параметром "value" радио-кнопки, на которую навели (1,2,3,4,5)
			});
			// Уводим мышь
			ratingItem.addEventListener("mouseleave", function (e) {
				// Обновление активных звезд
				setRatingActiveWidth();
			});
			// Клик
			ratingItem.addEventListener("click", function (e) {
				// Обновление переменных
				initRatingVars(rating);

				if (rating.dataset.ajax) {											// Если рейтинг ".rating" имеет дата-атрибут data-ajax="true"
					// "Отправить" на сервер
					// Вызываем функцию отправки на сервер с параметрами:
					// 1) значение радио-кнопки ".rating__item", на которую кликнули
					// 2) конкретный рейтинг, которым воспользовались
					setRatingValue(ratingItem.value, rating);
				} else {
					// Отобразить указанную оценку
					ratingValue.innerHTML = index + 1;							// Прибавляем к текущему значению ".rating__value" 1
					setRatingActiveWidth();											// Обновляем активные звезды
					// Псоле этого пользователь отправит свою оценку Кнопкой формы "Отправить оценку" (button type="submit")
				}
			});
		}
	}

	// Функция отправки на сервер оценки рейтинга (функция асинхронная, т.к. здесь используется метод fetch)
	// value - значение радио-кнопки ".rating__item", на которую кликнули
	// rating - конкретный рейтинг, которым воспользовались
	async function setRatingValue(value, rating) {
		if (!rating.classList.contains('_rating_sending')) {
			rating.classList.add('_rating_sending');								// Добавляем класс для затемнения рейтинга во время отправки

			// Отправка данных (value) на сервер (делаем запрос в локальный файл rating.json)
			let response = await fetch('/files/rating.json', {
				method: 'GET',																// Используем метод GET, посольку мы запрашиваем json

				// Отправка ра сервер (раскомментировать если есть реальный сервер)
				// body: JSON.stringify({
				// 	userRating: value													// В переменную "userRating" передаем значение value
				// }),
				// headers: {
				// 	'content-type': 'application/json'
				// }

			});

			// Получаем ответ от сервера:
			// Если ответ получен
			if (response.ok) {

				// Получаем json-ответ
				const result = await response.json();								// Получаем файл rating.json

				// Получаем новый рейтинг
				const newRating = result.newRating;									// Получаем значение "newRating" из rating.json

				// Вывод нового среднего результата
				ratingValue.innerHTML = newRating;									// Присваиваем полученное значение элементу ".rating__value"

				// Обновление активных звезд
				setRatingActiveWidth();													// После изменения значения в ".rating__value" меняем ширину активной желтой линии

				// Убираем временный класс
				rating.classList.remove('_rating_sending');

				// Если ответ от серевера НЕ получен
			} else {
				alert("Ошибка отправки");
				rating.classList.remove('_rating_sending');
			}
		}
	}
}



