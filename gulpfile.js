// Основной модуль
import gulp from "gulp";        // имортируем сам gulp из пакета gulp

// Импорт путей
import { path } from "./gulp/config/path.js";        // импортируем константу path из gulp/config/path.js

// Импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js";

// Передаем значения в глюбальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),		// если переменная хранит в себе флаг "build", то мы работаем в режиме Продакшн
	isDev: !process.argv.includes('--build'),			// если переменная НЕ хранит флаг "build", то это у нас режим Разработчика
	path: path,
	gulp: gulp,
	plugins: plugins
}

// Импорт задач
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";	// импортируем сразу 3 задачи, чтобы соблодать их порядок выполнения
import { svgSprive } from "./gulp/tasks/svgSprive.js";	// импортируем задачу svgSprive
import { zip } from "./gulp/tasks/zip.js";					// импортируем задачу по архивации проекта

// Наблюдатель за изменениями в файлах
function watcher() {
	gulp.watch(path.watch.files, copy);        // 1 - путь к файлам за которыми надо следить. 2 - действия (выполняемая задача)
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);
}

export { svgSprive }; 												// и сразу же экспортируем нашу задачу svgSprive, чтобы отдельно запускать эту задачу. Потому что это делается один раз (кгда мы подготовим все иконкии нам просто нужен gulp для того, чтобы он нам сконвертировал эти иконки). Задача svgSprive не будет включена в стандартный сценарий при выполнении в режме разработчика или в режиме продакш, а просто когда нужно, тогда вызываем эту команду и сформируем себе срайт

// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);		// создаем отдельную константу fonts, чтобы с помощью series последовательно выполнить все 3 задачи

// Основные задачи. Создаем константу для перечисления задач, которые нам нужно одновлеменно (паралельно) выполнить
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images, svgSprive));
// copy - копирует нужные файлы из исходной папки files в аналогичную папку сборки (согласно задачи copy.js)
// html - обработка html-файлов, в особоенности копирование файлов html из src в dist (согласно задачи html.js)
// scss - обработка scss-файлов (собираем все файлы scss в один, компилируем из scss в css, переименовываем в style.min.css...) (согласно задачи html.js)
// js - обработка js-файлов (согласно задачи js.js)
// images - обработка файлов изображений (согласно задачи images.js)
// svgSprive - пришлось добавить эту задачу в mainTasks, так как запуск gulp очищает всю папку dist и ранее созданный спрайт удаляется

// Построение сценариев выполненя задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
// reset - удаляется папка с результатом
// mainTasks - выполняются стандартные действия
// gulp.parallel(watcher, server)) - паралельно запускаются наблюдатель (watcher) и сервер (server)
const build = gulp.series(reset, mainTasks);					// константа build будет содержать в себе только те задачи, которые нужны в режиме Продакшн (наблюдатель и сервер в этом режиме нам не нужны)
const deployZIP = gulp.series(reset, mainTasks, zip);		// отдельный сценарий по созданию и архивации проекта

// Экспорт сценариев (чтобы  их было видно извне)
export { dev }
export { build }
export { deployZIP }

// Выполнение сценария по умолчанию
gulp.task('default', dev);
