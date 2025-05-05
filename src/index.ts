import './scss/styles.scss';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { ApiService } from './components/ApiService';
import { API_URL, CDN_URL } from './utils/constants';
import {
	ProductCardCatalog,
	ProductCardPreview,
	ProductCardBasket,
} from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { OrderContacts } from './components/ContactsForm';
import { Success } from './components/Success';
import { IProductItem, IOrder } from './types';

// Создаем экземпляры
const events = new EventEmitter();
const api = new ApiService(CDN_URL, API_URL);

// Шаблоны из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты UI
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(
	cloneTemplate(contactsTemplate),
	events
);
const success = new Success(cloneTemplate(successTemplate), events);

// Модель данных
const appState = new AppState({}, events);

// Загружаем список товаров
api
	.getProductList()
	.then((items) => {
		appState.setCatalog(items);
	})
	.catch((error) => {
		console.error('Ошибка загрузки товаров:', error);
	});

// События
// При обновлении товаров — обновить галерею
events.on('products:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const productCardCatalog = new ProductCardCatalog(
			cloneTemplate(cardCatalogTemplate),
			events
		);
		return productCardCatalog.render(item);
	});
});

// При выборе товара в каталоге — показать превью
events.on('catalog:select', ({ id }: { id: string }) => {
	const item = appState.getProduct(id);
	appState.setPreview(item);
});

// Обновление превью товара
events.on('preview:changed', (item: IProductItem) => {
	const productCardPreview = new ProductCardPreview(
		cloneTemplate(cardPreviewTemplate),
		events
	);
	modal.render({
		content: productCardPreview.render({
			...item,
			button: appState.getButtonText(item),
		}),
	});
});

// Добавление/удаление товара из корзины
events.on('button:status', ({ id }: { id: string }) => {
	const item = appState.getProduct(id);
	appState.isAddedToBusket(item);
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Обновление корзины
events.on('basket:changed', () => {
	page.counter = appState.getBasketCount();
	basket.total = appState.getBasketTotal();
	basket.items = appState.basket.map((item) => {
		const productCardBasket = new ProductCardBasket(
			cloneTemplate(cardBasketTemplate),
			events
		);
		productCardBasket.index = appState.getProductIndex(item);
		return productCardBasket.render({
			...item,
		});
	});
});

// Удаление товара из корзины
events.on('basket:delete', ({ id }: { id: string }) => {
	const item = appState.getProduct(id);
	appState.deleteProductFromBasket(item);
});

// Открытие формы заказа
events.on('order:open', () => {
	orderForm.clearPayment();
	modal.render({
		content: orderForm.render({
			payment: appState.order.payment,
			address: appState.order.address,
			valid: appState.validateOrder(),
			errors: [],
		}),
	});
});

// Изменение полей формы
events.on(
	'input:change',
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appState.setOrderField(data.field, data.value);
	}
);

// Изменение способа оплаты
events.on(
	'payment:change',
	(data: { payment: keyof Pick<IOrder, 'payment'>; button: HTMLElement }) => {
		orderForm.togglePayment(data.button);
		appState.setOrderPayment(data.payment);
		appState.validateOrder();
	}
);

// Обновление ошибок валидации
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	const createValidationError = (
		errorsObject: Record<string, string>
	): string =>
		Object.values(errorsObject)
			.filter((i) => !!i)
			.join(' и ');

	orderForm.valid = !payment && !address;
	orderForm.errors = createValidationError({ payment, address });
	orderContacts.valid = !email && !phone;
	orderContacts.errors = createValidationError({ email, phone });
});

// Переход к форме контактов
events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			email: appState.order.email,
			phone: appState.order.phone,
			valid: appState.validateOrder(),
			errors: [],
		}),
	});
});

// Отправка заказа
events.on('contacts:submit', () => {
	api
		.orderItems(appState.getOrderData())
		.then(() => {
			modal.render({
				content: success.render({
					total: appState.getBasketTotal(),
				}),
			});
			appState.clearBasket();
			appState.clearOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Закрытие успешного заказа
events.on('order:finished', () => {
	modal.close();
});

// Блокировка страницы при открытом модальном окне
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
