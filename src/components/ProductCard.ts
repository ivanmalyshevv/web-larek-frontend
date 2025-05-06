import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { productCategory } from '../utils/constants';
import { IProductItem, ICatalogItem, IBasketProduct } from '../types';
import { EventEmitter } from './base/events';

// Базовая карточка товара
export class ProductCard<T> extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _id: string;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Сохраняем ссылки на элементы
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);
		this.container.dataset.id = this._id;
	}

	set id(value: string) {
		this._id = value;
		this.container.dataset.id = value;
	}

	get id(): string {
		return this._id || this.container.dataset.id || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get image() {
		return this._image.src || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description() {
		return this._description.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			Object.values(productCategory).forEach((className) => {
				this._category.classList.remove(className);
			});
			const categoryClass = productCategory[value];
			if (categoryClass) {
				this._category.classList.add(categoryClass);
			}
		}
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price() {
		return this._price.textContent;
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}

//  Карточка товара в каталоге
export class ProductCardCatalog extends ProductCard<ICatalogItem> {
	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		// При клике генерируем событие выбора товара
		this.container.addEventListener('click', () => {
			events.emit('catalog:select', { id: this.id });
		});
	}
}

//  Превью товара
export class ProductCardPreview extends ProductCard<IProductItem> {
	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		// При клике на кнопку добавляем/удаляем из корзины
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('button:status', { id: this.id });
			});
		}
	}
}

//  Товар в корзине
export class ProductCardBasket extends ProductCard<IBasketProduct> {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		// Сохраняем ссылки
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);

		// Обработчик удаления
		this._deleteButton.addEventListener('click', () => {
			events.emit('basket:delete', { id: this.id });
		});
	}

	// Устанавливаем порядковый номер
	set index(value: number) {
		this.setText(this._index, value);
	}
}
