// Подключаем плагины для работы со шрифтами
import fs from 'fs';								// плагин Node, который работает с файловой системой (он уже установлен автоматически вместе с Node.js)
import fonter from 'gulp-fonter';			// преобразовывает шрифты из формата otf в форматы ttf и woff
import ttf2woff2 from 'gulp-ttf2woff2';	// делает остальную работу со шрифтами: преобразует из ttf в woff2

// Задача №1 - конвертация из otf в ttf
export const otfToTtf = () => {
	// Ищем файлы шрифтов .otf
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})	// ищем в папке с исходниками только файлы otf
		.pipe(app.plugins.plumber(													// (обработка ошибок и уведомление о таковых) обращаемся к плагину plumber
			app.plugins.notify.onError({												// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "FONTS",
				message: "Error: <%= error.message %>"
			})
		))
		// Конвертируем в .ttf
		.pipe(fonter({																	// с помощью плагина fonter формируем формат ttf
			formats: ['ttf']
		}))
		// Выгружаем в исходную папку
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))				// выгружаем полученный ttf-шрифт ОБРАТНО в папку с исходниками srcFolder
}

// Задача №2 - конвертация из ttf в woff и woff2
export const ttfToWoff = () => {
	// Ищем файлы шрифтов .ttf
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})	// ищем в папке с исходниками только файлы ttf
		.pipe(app.plugins.plumber(													// (обработка ошибок и уведомление о таковых) обращаемся к плагину plumber
			app.plugins.notify.onError({												// внутри него обращаемся к плагину notify. При возникновении ошибок будем выводить сообщение...
				title: "FONTS",
				message: "Error: <%= error.message %>"
			})
		))
		// Конвертируем в .woff
		.pipe(fonter({																	// с помощью плагина fonter формируем формат woff
			formats: ['woff']
		}))
		// Выгружаем в папку с результатом
		.pipe(app.gulp.dest(app.path.build.fonts))							// выгружаем полученные шрифты woff в папку с результатом
		// Ищем файлы .ttf
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))			// снова ищем в папке с исходниками только файлы ttf
		// Конвертируем в .woff2
		.pipe(ttf2woff2())															// с помощью плагина ttf2woff2 формируем формат woff2
		// Выгружаем в папку с результатом
		.pipe(app.gulp.dest(app.path.build.fonts))							// выгружаем полученные шрифты woff2 в папку с результатом
}

// Задача №3 - записывает подключение файлов шрифтов в файл стилей
export const fontsStyle = () => {
	// Файл стилей подключения шрифтов
	let fontsFile = `${app.path.srcFolder}/scss/fonts/fonts.scss`;						// получаем в переменную fontsFile путь к файлу fonts.scss, куда мы будет все это записывать
	// Проверяем существуют ли файлы шрифтов
	fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			// Проверяем существует ли файл стилей (fonts.scss) для подключения шрифтов
			if (!fs.existsSync(fontsFile)) {
				// Если файла (fonts.scss) нет, создаем его
				fs.writeFile(fontsFile, '', cb);								// создаем файл
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {			// бегаем по всем файлам шрифтов, чтобы их записать
					// Записываем подключения шрифтов в файл стилей
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
						if (fontWeight.toLowerCase() === 'thin') {
							fontWeight = 100;
						} else if (fontWeight.toLowerCase() === 'extralight') {
							fontWeight = 200;
						} else if (fontWeight.toLowerCase() === 'light') {
							fontWeight = 300;
						} else if (fontWeight.toLowerCase() === 'medium') {
							fontWeight = 500;
						} else if (fontWeight.toLowerCase() === 'semibold') {
							fontWeight = 600;
						} else if (fontWeight.toLowerCase() === 'bold') {
							fontWeight = 700;
						} else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
							fontWeight = 800;
						} else if (fontWeight.toLowerCase() === 'black') {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				// Если файл есть, выводим сообщение. Файл стилей (fonts.scss) не будет обновлен. Сделано для того, что если мы будем вность вручную правки в Файл стилей (fonts.scss), то при запуске gulp чтобы его не обновляло (Например сюда надо вручную доавить стиль шрифта "Италик")
				console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!");
			}
		}
	});

	return app.gulp.src(`${app.path.srcFolder}`);
	function cb() { }
}