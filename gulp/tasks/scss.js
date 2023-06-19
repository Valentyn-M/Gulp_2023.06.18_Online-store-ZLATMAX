// добавляем два плагина, которые необходимы для компиляции scss в css
import dartSass from 'sass';			// сам перпроцессор sass
import gulpSass from 'gulp-sass';	// плагин для запуска этого препроцессора
import rename from 'gulp-rename';	// плагин для переименования файлов

import cleanCss from 'gulp-clean-css';										// сжатие css-файла
import webpCss from 'gulp-webpcss';											// вывод webp-изображений
import autoprefixer from 'gulp-autoprefixer';							// добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries';	// группировка медиа-запросов

const sass = gulpSass(dartSass);		// в константе sass мы делаем вызов из плагина gulp-sass с передачей непосредственного компилятора 

// Функция, которая будет выполнять нужное копирование файлов
export const scss = () => {
	return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })	// получаем достум к файлу (style.scss), sourcemaps (карта исходников) - чтобы видеть в каком файле написан тот или иной стиль (т.к. файл стилей мы будем собирать из разных частей). app.isDev - применяем карты только в режиме Разработчика (сли мы в режиме Разоаботчика, значит там будет { sourcemaps: true })
		.pipe(app.plugins.plumber(													// (обработка ошибок и уведомление о таковых) обращаемся к плагину plumber
			app.plugins.notify.onError({												// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "SCSS",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(sass({																	// создаем задачу и внутри нее будем вызывать наш компилятор
			outputStyle: 'expanded'														// указываем изначальный стиль готового файла (он может быть сжат, может быть не сжат)
		}))
		.pipe(app.plugins.replace(/@img\//g, '../img/'))   					// (обработка алиасов(псевонмов)) применяем плагин Поиска и замены: согласно шаблону меняем "@img" на "../img/"
		.pipe(																			// вызываем функцию groupCssMediaQueries
			app.plugins.if(																// обращаемся к плагину if...
				app.isBuild,																	// и проверяем, если это режим Продакшн, то...
				groupCssMediaQueries()														// применяем плагин gulp-group-css-media-queries
			)
		)
		.pipe(																			// вызываем функцию для изображений webp (для работы это го плагина будет добавлен javascript-код, также надо установить webp-converter@2.3.3)
			app.plugins.if(																// обращаемся к плагину if...
				app.isBuild,																	// и проверяем, если это режим Продакшн, то...
				webpCss({																		// применяем плагин gulp-webpcss
					webpClass: ".webp",															// если браузер поддерживает webp-изображения, то будет добавляться класс "webp" и по этому классу будет выводиться соответствующее изображение
					noWebpClass: ".no-webp"														// если браузер НЕ поддерживает webp-изображения, то будет соотвтствующий класс "no-webp"
				})
			)
		)
		.pipe(																			// добавляем автопрефиксер
			app.plugins.if(																// обращаемся к плагину if...
				app.isBuild,																	// и проверяем, если это режим Продакшн, то...
				autoprefixer({																	// применяем плагин gulp-autoprefixer с некоторыми настройками...
					grid: true,																		// добавляем поддержку grid (чтобы grid-свойства обрабатывались автопрефиксером)
					overrideBrowserslist: ["last 3 versions"],							// количество версий у браузера (от современной и назад)
					cascade: true
				})
			)
		)
		.pipe(app.gulp.dest(app.path.build.css))								// выгружаем НЕ сжатый файл стилей в папку с результатом (чтобы заказчику легче было работать с проектом дальше, если мы не отдаем заказчику целую сборку). Если такой файл не нужен, то просто надо закоментировать эту сторку
		.pipe(																			// перед переименованием style.css вызываем сжатие файла стилей
			app.plugins.if(																// обращаемся к плагину if...
				app.isBuild,																	// и проверяем, если это режим Продакшн, то...
				cleanCss()																		// применям плагин gulp-clean-css
			)
		)
		.pipe(rename({																	// вызываем плагин gulp-rename для переименовывания файл стилей (перед запуском сборки)...
			extname: ".min.css"															// в "style.min.css"
		}))
		.pipe(app.gulp.dest(app.path.build.css))								// выгружаем полученный файл стилей в папку с результатом
		.pipe(app.plugins.browsersync.stream());								// обновляем браузер

}