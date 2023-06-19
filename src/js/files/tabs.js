const tabsElements = document.querySelectorAll('[data-tabs]');
if (tabsElements.length) {
	tabsElements.forEach(tabs => {
		const tabsTitlesBlock = tabs.querySelector('.tabs__navigation');		// Блок с заголовками табов
		const tabsTitles = tabs.querySelectorAll('.tabs__title');				// Массив с заголовками (нужен при динамическом адаптиве, т.к. мы не привязываемся к родителю при выборке этих элементов)
		const tabsBodiesBlock = tabs.querySelector('.tabs__content');			// Блок с содержимым табов (нужен при превращении в спойлеры)
		const tabsBodies = tabs.querySelectorAll('.tabs__body');					// Массив с содержимым табов
		const tabsLength = tabsBodies.length;											// Длина коллекции (количество вкладок). Определяем по количеству владок с текстом (body)

		// Запускаем функцию инициализации обычных табов
		initTabs();

		// Получаем значения дата-атрибута
		const daValue = tabs.getAttribute('data-tabs');
		// Если значение в дата атрибуте есть, то рабоатем и с табами, и со спойлерами
		if (daValue != '') {
			const daArray = daValue.split(',');											// Создаем массив из значений атрибута "data-tabs"
			const daBreakpoint = daArray[0] ? daArray[0].trim() : '2000';		// Если не указано, по умолчанию 2000px (с запасом)
			const daType = daArray[1] ? daArray[1].trim() : null;					// Если нужен тип спойлера - один активный спойлер, то ожидаем здесь получить значение "one"

			// При загрузке страницы: добавляем дата-атрибуты заголовкам табов - для Динамического адаптива (для переноса)
			for (let i = 0; i < tabsLength; i++) {
				const tabTitle = tabsTitles[i];
				tabTitle.dataset.da = `tabs__content,${i},${daBreakpoint}`;
			}

			// При загрузке страницы: добавляем дата-атрибуты Блоку с содержимым табов - для преврещения их в Спойлеры
			tabsBodiesBlock.dataset.spollers = `${daBreakpoint}`;
			if (daType === "one") {															// Если заполнено второе значение дата-атрибута
				tabsBodiesBlock.setAttribute('data-one-spoller', '');
			}

			// При загрузке страницы: Заголовкам табов - для преврещения их в Спойлеры
			for (let i = 0; i < tabsLength; i++) {
				const tabTitle = tabsTitles[i];
				tabTitle.setAttribute('data-spoller', '');
				// Синхронизация между активным табом (класс _tab-active) и активным спойлером (класс _spoller-active)
				if (tabTitle.classList.contains('_tab-active') && !tabTitle.classList.contains('_spoller-active')) {
					tabTitle.classList.add('_spoller-active');
				}
			}

			// При загрузке страницы: если ширина экрана меньше установленного значания в дата-атрибуте), то отменяем Обычные табы
			if (window.innerWidth <= daBreakpoint) {
				cancelTabs();
			}

			// Далее начинаем слушать изменение ширины экрана
			// Вместо того, чтобы слушать все время изменение размера окна (window.addEventListener("resize", funtcion)), мы будем слушать изменение размера окна ТОЛЬКО в точке брейкпоинта (window.matchMedia). Это снижаем нагрузку на браузер
			const mql = window.matchMedia("(" + "max-width: " + (daBreakpoint / 16) + "rem)");
			mql.addEventListener("change", () => {
				// Если условие НЕ выполняется (т.е. ширина экрана больше установленного значания в дата-атрибуте), то применяем Обычные табы
				if (!mql.matches) {
					// Синхронизация (обратная) между активным спойлером (класс _spoller-active) и активным табом (класс _tab-active)
					let counter = 0;
					for (let i = 0; i < tabsLength; i++) {
						const tabTitle = tabsTitles[i];
						if (tabTitle.classList.contains('_spoller-active')) {
							tabTitle.classList.add('_tab-active');
							break;															// Берем первый попашийся активный спойлер и синхронизируем
						} else {
							counter++;														// Увеличиваем счетчик, если не активный спойлер
						}
					}
					// Если нет ни одного активного спойлера, активируем первую вкладку
					if (counter === tabsLength) {
						tabsTitles[0].classList.add('_tab-active');
					}
					initTabs();
				}
				// В противном случае отменяем обычные табы, т.к. будут работать спойлеры
				else {
					// Убираем активности у всех спойлеров, которые ранее могли быть активированы
					for (let i = 0; i < tabsLength; i++) {
						const tabTitle = tabsTitles[i];
						if (tabTitle.classList.contains('_spoller-active')) {
							tabTitle.classList.remove('_spoller-active');
						}
					}
					// Синхронизация между активным табом (класс _tab-active) и активным спойлером (класс _spoller-active)
					for (let i = 0; i < tabsLength; i++) {
						const tabTitle = tabsTitles[i];
						if (tabTitle.classList.contains('_tab-active')) {
							tabTitle.classList.add('_spoller-active');
						}
					}
					cancelTabs();
				}
			});
		}

		// ==========================================================================================================================

		// Обычные табы (инициализация)
		function initTabs() {

			// При загрузке страницы скрываем все табы кроме активного
			tabsActivation();

			// При клике на вкладку-заголовок таба
			tabsTitlesBlock.onclick = tabsActualizationClass;

			// Функция актуализации классов
			function tabsActualizationClass(event) {									// Прослушка на всем блоке заголовков
				const targetElement = event.target;										// Элемент на которм сделан клик
				if (targetElement.closest('button') && !targetElement.closest('._tab-active')) {
					// Пробегаем циклом по всем заголовкам и забираем класс активности у того, у кого он есть
					for (let i = 0; i < tabsLength; i++) {
						const tabTitle = tabsTitles[i];
						if (tabTitle.classList.contains('_tab-active')) {
							tabTitle.classList.remove('_tab-active');
						}
					}
					targetElement.classList.add('_tab-active');						// Добавляем класс активности тому заголовку, на ктором сделан клик
					tabsActivation();															// Вызываем функцию отображения активного таба и скрытия неактивных
				}
			}

			// Функция отображения активного таба и скрытия неактивных
			function tabsActivation() {
				for (let i = 0; i < tabsLength; i++) {
					const tabTitle = tabsTitles[i];
					const tabBody = tabsBodies[i];
					if (tabTitle.classList.contains('_tab-active')) {
						// tabBody.style.display = "block";
						tabBody.removeAttribute('hidden');
					} else {
						// tabBody.style.display = "none";
						tabBody.setAttribute('hidden', 'hidden')
					}
				}
			}
		}

		//-------------------------------------------------------------------

		// Удаление функции табов
		function cancelTabs() {
			// Удаляем прослушку с заголовков табов
			tabsTitlesBlock.onclick = null;
			// Удаляем класс активного таба
			for (let i = 0; i < tabsLength; i++) {
				const tabTitle = tabsTitles[i];
				if (tabTitle.classList.contains('_tab-active')) {
					tabTitle.classList.remove('_tab-active');
				}
			}
		}

		// ==========================================================================================================================

	});
}