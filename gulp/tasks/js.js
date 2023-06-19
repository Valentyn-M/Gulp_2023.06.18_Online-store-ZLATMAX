// Подключаем специальный модуль
import webpack from "webpack-stream";

// Функция, которая будет выполнять нужное копирование файлов
export const js = () => {
	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })		// получаем достум к файлу (app.js), sourcemaps (карта исходников) - чтобы видеть в каком js-файле ошибка. app.isDev - применяем карты только в режиме Разработчика (сли мы в режиме Разоаботчика, значит там будет { sourcemaps: true })
		.pipe(app.plugins.plumber(													// (обработка ошибок и уведомление о таковых) обращаемся к плагину plumber
			app.plugins.notify.onError({												// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "JS",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(webpack({																// вызываем webpack с некоторыми настройками...
			mode: app.isBuild ? 'production' : 'development',					// если мы в режиме Продашин - указываем "production", если нет - указываем "development"
			output: {																		// указываем файл результатов...
				filename: 'app.min.js',														// и называем его "app.min.js" 
			}
		}))
		.pipe(app.gulp.dest(app.path.build.js))								// выгружаем полученный файл стилей в папку с результатом
		.pipe(app.plugins.browsersync.stream());								// обновляем браузер
}