// Добавляем плагины, чтобы сжимать изображения, оптимизировать и преобразовывать в формат webp
import webp from "gulp-webp";
import imagemin from "gulp-imagemin";

// Функция, которая будет выполнять нужное копирование файлов
export const images = () => {
	return app.gulp.src(app.path.src.images)				// получаем достум к файлам изображений (всем, что в папке img)
		.pipe(app.plugins.plumber(									// (обработка ошибок и уведомление о таковых) обращаемся к плагину plumber
			app.plugins.notify.onError({								// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "IMAGES",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(app.plugins.newer(app.path.build.images))		// добавляем пайп, в котором вызываем наш newer, и проверяем картинки в папке с результатом (чтобы обрабатывать только новые картинки или те, ктороые обвились)
		.pipe(															// вызываем плагин webp для создания изображений webp
			app.plugins.if(												// обращаемся к плагину if...
				app.isBuild,													// и проверяем, если это режим Продакшн, то...
				webp()															// применяем плагин gulp-webp
			)
		)
		.pipe(															// выгружаем полученные картинки webp в папку с результатом
			app.plugins.if(												// обращаемся к плагину if...
				app.isBuild,													// и проверяем, если это режим Продакшн, то...
				app.gulp.dest(app.path.build.images)					// выгружаем картинки
			)
		)
		.pipe(															// далее нам нужно опять получить доступ к изображениям в папке с исходниками
			app.plugins.if(												// обращаемся к плагину if...
				app.isBuild,													// и проверяем, если это режим Продакшн, то...
				app.gulp.src(app.path.src.images)						//получаем доступ к изображениям
			)
		)
		.pipe(															// и снова проверить их на обновления
			app.plugins.if(												// обращаемся к плагину if...
				app.isBuild,													// и проверяем, если это режим Продакшн, то...
				app.plugins.newer(app.path.build.images)				// проверяем на обновления
			)
		)
		.pipe(															// создаем задачу, с помощью которой будем картинки сжимать. Для этого вызываем плагин imagemin и передаем некоторые настройки...
			app.plugins.if(												// обращаемся к плагину if...
				app.isBuild,													// и проверяем, если это режим Продакшн, то...
				imagemin({														// применяем плагин gulp-imagemin
					progressive: true,
					svgoPlugins: [{ removeViewBox: false }],
					interlaced: true,
					optimizationLevel: 3										// уровесть сжатия - 3. Может быть в диапазоне "0 to 7"
				})
			)
		)
		.pipe(app.gulp.dest(app.path.build.images))			// выгружаем оптимизированные обычные картинки в папку с результатом
		.pipe(app.gulp.src(app.path.src.svg))					// получаем доступ к svg-изображениям в папке исходников
		.pipe(app.gulp.dest(app.path.build.images))			// далле копируем эти svg-изображения в папку с результатом
		.pipe(app.plugins.browsersync.stream());				// обновляем браузер
}