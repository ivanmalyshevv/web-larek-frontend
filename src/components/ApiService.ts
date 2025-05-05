import { Api, ApiListResponse } from './base/api';
import {
	IApiService,
	IProductItem,
	OrderConfirmation,
	OrderDataResult,
} from '../types';

// Для взаимодействия с API
export class ApiService extends Api implements IApiService {
	readonly cdn: string;

	// Конструктор принимает CDN URL и основной URL API
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl); // Вызываем конструктор родительского класса Api
		this.cdn = cdn; // URL для изображений
	}

	// Получение одного товара по Id
	getProductItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image, // Добавляем полный путь к изображению
		}));
	}

	// Получение списка товаров
	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
		);
	}

	// Отправка заказа
	orderItems(order: OrderConfirmation): Promise<OrderDataResult> {
		return this.post('/order', order).then((data: OrderDataResult) => data);
	}
}
