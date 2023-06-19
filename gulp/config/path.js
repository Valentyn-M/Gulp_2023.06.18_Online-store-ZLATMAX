// Получаем имя мамки проекта
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;       // путь к папке с результатами сборки. Вместо dist также можно использовать rootFolder - это название текущего проекта
const srcFolder = `./src`;          // путь к папке с исходниками

// Создаем общий объект path, в котором будет храниться вся информация о пути к тому или иному файлу или папке
export const path = {
	build: {                    // объект путей к папке с результатом
		js: `${buildFolder}/js/`,				 	 // выгружаем наш файл js в папку с рузальтатом и в папку js
		css: `${buildFolder}/css/`,				 // выгружаем наши стили из src в папку с результатом
		html: `${buildFolder}/`,                // корневая папка результатов сборки (именно сюда мы будем помещать наши html-файлы)
		images: `${buildFolder}/img/`,          // создаем общую папку с результатом для всех изображений и svg-файлов
		fonts: `${buildFolder}/fonts/`,         // нажен только один путь - папка с результатом / fonts
		files: `${buildFolder}/files/`,         // в это место мы переносим файлы и папки из src
	},
	src: {                      // объкт путей к исходным файлам
		js: `${srcFolder}/js/app.js`,				 // указываем путь только к одному джаваскипт-файлу
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,	// путь к изображениям с любым разешением
		svg: `${srcFolder}/img/**/*.svg`,		 // путь к svg-файлам
		scss: `${srcFolder}/scss/style.scss`,	 // путь к нашему исходному файлу style.scss
		html: `${srcFolder}/*.html`,            // путь к папке к файлу html с любым именем
		files: `${srcFolder}/files/**/*.*`,     // путь к папке с файлами, которые мы хотим копировать
		svgicons: `${srcFolder}/svgicons/*.svg`,// путь к svg-файлам (svg-спрайты)
	},
	watch: {                    // в этом объкте указываем пути к файлам и папкам, за которыми должен следить gulp и при любых изменения выполнять определенные действия
		js: `${srcFolder}/js/**/*.js`,    	 	 // наблюдаем за всеми js-файлам, которые будут находиться в папке с исходниками src/js/
		scss: `${srcFolder}/scss/**/*.scss`,    // наблюдаем за всеми файлами scss, которые будут находиться в папке с исходниками src/scss/
		html: `${srcFolder}/**/*.html`,         // наблюдаем за любыми html-файлы, которые находятся ив папке src и в подпапках
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,	// наблюдаем за абсолютно всеми файлами изображений
		files: `${srcFolder}/files/**/*.*`,     // путь к папке с исходными папками и файлами
	},
	clean: buildFolder,         // clean равна папке с результатом
	buildFolder: buildFolder,   // сама папка с результатом
	srcFolder: srcFolder,       // папка с исходниками
	rootFolder: rootFolder,     // название текущей папки проекта
	ftp: ``                     // здесь мы можем указывать папку на удаленном фтп-сервере
}