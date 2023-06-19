// Импортируем плагины
import fileInclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

// Функция, которая будет копировать (выполнять, обрабатывать) файлы html из src в dist
export const html = () => {
	return app.gulp.src(app.path.src.html)         // получили файлы
		.pipe(app.plugins.plumber(								// обращаемся к плагину plumber
			app.plugins.notify.onError({							// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "HTML",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(fileInclude())                            // собрали все файлы в один html
		.pipe(app.plugins.replace(/@img\//g, 'img/'))   // применяем плагин Поиска и замены: согласно шаблону меняем @img/ на img/
		.pipe(														// вызов плагина для преобразования изображений в формат webp
			app.plugins.if(											// обращаемся к плагину if...
				app.isBuild,												// и проверяем, если это режим Продакшн, то...
				webpHtmlNosvg()											// применяем плагин gulp-webp-html-nosvg
			)
		)
		.pipe(														// интегрируем плагин gulp-version-number для сброса кеша в браузере
			app.plugins.if(											// обращаемся к плагину if...
				app.isBuild,												// и проверяем, если это режим Продакшн, то...
				versionNumber({											// применяем плагин gulp-version-number
					'value': '%DT%',											// добавляем к адресу наших подключаемых стилей и JS-файлов текущую дату и время	
					'append': {
						'key': '_v',
						'cover': 0,
						'to': [
							'css',
							'js',
						]
					},
					'output': {
						'file': 'gulp/version.json'						// будет создаваться файл в папке gulp, где будет храниться этот ключ
					}
				})
			)
		)
		.pipe(app.gulp.dest(app.path.build.html))       // перенесли (скопировали) созданные и обработанные html файлы
		.pipe(app.plugins.browsersync.stream());			// обращаемся к глобальной переменной plugins, там находим browsersync и выполняем stream (т.е. обновление)

}