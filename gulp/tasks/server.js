export const server = (done) => {				// фукнция называется "server"
	app.plugins.browsersync.init({					// обращаемся к глобальной переменной plugins, там находим browsersync и инициализируем его (init), т.е. запускаем
		server: {
			baseDir: `${app.path.build.html}`			// baseDir - базовая папка, откуда нам нужно запустить файлы. app.path.build.html - папка с результатом проекта (отслеживаем мы там именно html-файлы)
		},
		notify: false,											// убираем сообщения в браузере, чтобы они нам не мешали
		port: 3000,												// указываем порт для нашего локального сервера
	});
}