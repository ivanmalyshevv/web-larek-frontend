import { ValidationErrors, IAppModel, IOrder, IProductItem } from '../types';
import { IEvents } from '../components/base/events';

// Класс состояния
export class AppState<T> implements IAppModel {
	catalog: IProductItem[] = []; // Каталог товаров
	preview: string | null; // Предпросмотр товара
	basket: IProductItem[] = []; // Корзина
	order: IOrder = {
		// Информация о заказе
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	formErrors: ValidationErrors = {}; // Ошибки формы

	// Конструктор принимает начальные данные и событие
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	// Устанавливает каталог и генерирует событие обновления
	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.events.emit('products:changed', { catalog: this.catalog });
	}

	// Устанавливает предпросмотр товара
	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}

	// Возвращает товар по id
	getProduct(id: string) {
		return this.catalog.find((item) => item.id === id);
	}

	// Добавляет товар в корзину
	addProductToBasket(item: IProductItem) {
		this.basket.push(item);
		this.events.emit('basket:changed');
	}

	// Удаляет товар из корзины
	deleteProductFromBasket(item: IProductItem) {
		this.basket = this.basket.filter((product) => product.id !== item.id);
		this.events.emit('basket:changed');
	}

	// Переключает наличие товара в корзине
	isAddedToBusket(item: IProductItem) {
		if (!this.basket.some((product) => product.id === item.id)) {
			return this.addProductToBasket(item);
		} else {
			return this.deleteProductFromBasket(item);
		}
	}

	// Возвращает текст кнопки "Купить" или "Удалить"
	getButtonText(item: IProductItem) {
		if (!item.price) {
			return 'Не продается';
		}

		if (!this.basket.some((product) => product.id === item.id)) {
			return 'Купить';
		} else {
			return 'Удалить из корзины';
		}
	}

	// Сумма товаров в корзине
	getBasketTotal() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	// Количество товаров в корзине
	getBasketCount() {
		return this.basket.length;
	}

	// Индекс товара в корзине
	getProductIndex(item: IProductItem) {
		return this.basket.indexOf(item) + 1;
	}

	// Обновление поля заказа
	setOrderField(field: keyof IOrder, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

	// Установка способа оплаты
	setOrderPayment(value: string) {
		this.order.payment = value;
	}

	// Получение данных заказа
	getOrderData() {
		return {
			...this.order,
			items: this.basket.map((item) => item.id),
			total: this.getBasketTotal(),
		};
	}

	// Валидация формы заказа
	validateOrder(): boolean {
		const errors: ValidationErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!this.order.email.includes('@')) {
			errors.email = 'Некорректный email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!/^\+?\d+$/.test(this.order.phone)) {
			errors.phone = 'Некорректный формат телефона';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:changed', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Очистка корзины
	clearBasket() {
		this.basket = [];
		this.events.emit('basket:changed');
	}

	// Очистка данных заказа
	clearOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.events.emit('order:changed');
	}
}
