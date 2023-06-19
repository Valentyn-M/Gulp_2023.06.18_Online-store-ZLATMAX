// Подключаем плагин del
import { deleteAsync } from "del";		// правильное его подключение было под видеороликом https://www.youtube.com/watch?v=jU88mLuLWlk&list=PLM6XATa8CAG5r23rupAHv2g9cq-NUv_Ux&index=28

// Функция, которая будет удалять папку с результатами - dist
export const reset = () => {
	return deleteAsync(app.path.clean);
}