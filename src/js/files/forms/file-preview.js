// Выбираем все блоки, предназначенные для добавления изображения с превью
const fileBlocks = document.querySelectorAll('[data-preview]');
if (fileBlocks.length) {
	fileBlocks.forEach(fileBlock => {
		const fileInput = fileBlock.querySelector('.file__input');		// Выбираем инпут 
		const filePreview = fileBlock.querySelector('.file__preview');		// Выбираем блок, куда будем выводить инпут

		// Слушаем изменения в инпуте file
		fileInput.addEventListener("change", () => {
			uploadFile(fileInput.files[0]);										// Вызываем функцию и передаем ей файл, который выбран пользователем (файл только 1, если добавить для инпута multiple, то превью будет только для 1-го файла)
		});

		function uploadFile(file) {
			// Проверяем типа загружаемого файла (чтобы пользователь не смог загрузить что-то, кроме изображения)
			if (!['image/jpg', 'image/jpeg', 'image/png', 'image/gif',].includes(file.type)) {
				alert("Разрешено Загружать только изображения");
				fileInput.value = '';
				return;
			}

			// Проверяем размер загружаемого файла (<2 МБ)
			if (file.size >= 2 * 1024 * 1024) {
				alert("Файл не должен превышать 2 МБ");
				return;
			}

			// Выводим загруженный файл в качестве превью
			let reader = new FileReader();											// Объект FileReader позволяет веб-приложениям асинхронно читать содержимое файлов, хранящиеся на компьютере пользователя
			reader.onload = function (e) {											// Когда файл загружен вызываем функцию
				filePreview.innerHTML = `<img src="${e.target.result}" alt="Изображение">`;		// Добавляем загруженную картинку в блок для превью
			};
			reader.onerror = function (e) {
				alert("Ошибка");
			};
			reader.readAsDataURL(file);												// Продолжаем работу (Метод readAsDataURL используется для чтения содержимого указанного Blob или File. Когда операция закончится, readyState примет значение DONE, и будет вызвано событие loadend. В то же время, атрибут result будет содержать данные как URL, представляющий файл, кодированый в base64 строку.)
		}
	});
} 