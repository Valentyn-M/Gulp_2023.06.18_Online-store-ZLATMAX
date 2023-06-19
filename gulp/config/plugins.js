import replace from "gulp-replace";    // подключаем плагин "Поиск и замена"
import plumber from "gulp-plumber";    // подключаем плагин "Обработка ошибок"
import notify from "gulp-notify";    	// подключаем плагин "Сообщения (подсказки)"
import browsersync from "browser-sync";// локальный сервер
import newer from "gulp-newer";			// плагин проверки обновления файлов
import ifPlugin from "gulp-if";			// условное вевление

// Экспортируем объект
export const plugins = {
	replace: replace,
	plumber: plumber,
	notify: notify,
	browsersync: browsersync,
	newer: newer,
	if: ifPlugin
}