import svgSprite from "gulp-svg-sprite";

// Функция, которая будет выполнять нужное копирование файлови формировать спрайт
export const svgSprive = () => {
	return app.gulp.src(app.path.src.svgicons, {})		// получаем достум к svg-сконкам в папке svgicons, чтобы создать из них спрайт
		.pipe(app.plugins.plumber(									// (обработка ошибок и уведомление о таковых) обращаемся к плагину plumber
			app.plugins.notify.onError({								// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "SVG",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(svgSprite({												// вызываем плагин svgSprite с некоторыми накстройками...
			mode: {
				stack: {
					sprite: `../icons/icons.svg`,						// наш готовый спрайт (icons.svg) создастся в папке img/icons
					example: true											// создаем страницу с перечнем иконок - это html-файл с превью всех этих иконок 
				}
			},
		}))
		.pipe(app.gulp.dest(app.path.build.images))			// выгружаем полученный svg-спрайт стилей в папку с результатом
}