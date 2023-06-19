// Импортируем два модуля
import { deleteAsync } from "del";	// импортируем модуль del, который мы ранее установили
import zipPlugin from "gulp-zip";	// импортируем модуль для архивации нашей сборки

// Функция, которая будет копировать (выполнять, обрабатывать) файлы html из src в dist
export const zip = () => {
	deleteAsync(`./${app.path.rootFolder}.zip`);								// сначала удаляем zip-архив, который возможно существует (с помощью модуля "del")
	return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})	// обращаемся к папке с результатом и получаем абсолютно все файлы любого уровня вложенности
		.pipe(app.plugins.plumber(												// обращаемся к плагину plumber
			app.plugins.notify.onError({											// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "ZIP",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(zipPlugin(`${app.path.rootFolder}.zip`))					// вызываем модуль gulp-zip и получаем имя рут-папки. С таким же названием (имя корневой папки) создастся архив
		.pipe(app.gulp.dest('./'));					       				// выгружаем готовый архив в корень нашего проекта
}