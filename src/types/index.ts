// Интерфейс товара
export interface IProductItem {
	id: string;
	image: string;
	title: string;
	description: string;
	category: string;
	price: number | null;
	button: string;
}

// Интерфейс заказа
export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс подтверждения заказа
export interface OrderConfirmation extends IOrder {
	total: number;
	items: string[];
}

// Интерфейс данных о товарах
export interface IProductData {
	total: number;
	items: IProductItem[];
}

// Тип элемента каталога
export type ICatalogItem = Omit<IProductItem, 'description'>;

// Тип товара в корзине
export type IBasketProduct = Pick<IProductItem, 'id' | 'title' | 'price'>;

// Тип категорий товаров
export type IProductCategory = { [key: string]: string };

// Тип корзины
export type IBasketItem = {
	items: IBasketItem[];
	total: number | null;
};

// Интерфейс результата заказа
export interface OrderDataResult {
	id: string;
	total: number;
}

// Тип способа оплаты
export type Payment = 'card' | 'cash' | '';

// Тип данных для оплаты
export type OrderPayment = Pick<IOrder, 'payment' | 'address'>;

// Тип контактных данных
export type Contacts = Pick<IOrder, 'email' | 'phone'>;

// Тип ошибок валидации
export type ValidationErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс модели приложения
export interface IAppModel {
	catalog: IProductItem[];
	preview: string | null;
	basket: IProductItem[];
	order: IOrder | null;
	formErrors: ValidationErrors;

	setCatalog(items: IProductItem[]): void;
	setPreview(item: IProductItem): void;
	getProduct(id: string): IProductItem;
	addProductToBasket(item: IProductItem): void;
	deleteProductFromBasket(item: IProductItem): void;
	isAddedToBusket(item: IProductItem): void;
	getButtonText(item: IProductItem): void;
	getBasketTotal(): number;
	getBasketCount(): number;
	getProductIndex(item: IProductItem): number;
	setOrderField(field: keyof IOrder, value: string): void;
	setOrderPayment(value: string): void;
	getOrderData(): void;
	validateOrder(): boolean;
	clearBasket(): void;
	clearOrder(): void;
}

// Интерфейс API сервиса
export interface IApiService {
	getProductItem: (id: string) => Promise<IProductItem>;
	getProductList: () => Promise<IProductItem[]>;
	orderItems(order: OrderConfirmation): Promise<OrderDataResult>;
}
