import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

// Класс корзины
export class Basket extends Component<HTMLElement> {
	protected _list: HTMLElement; // Список товаров
	protected _total: HTMLElement; // Общая сумма
	protected _button: HTMLButtonElement; // Кнопка оформления

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Получаем элементы
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		// Открытие формы заказа
		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	// Установка элементов корзины
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.textContent = 'Корзина пуста';
		}
	}

	// Установка общей суммы
	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	// Блокировка кнопки, если нет товаров
	set selected(count: number) {
		this.setDisabled(this._button, count === 0);
	}
}
