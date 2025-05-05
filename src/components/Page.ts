import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

// Класс главной страницы
export class Page extends Component<HTMLElement> {
	protected _gallery: HTMLElement; // Галерея товаров
	protected _basketCounter: HTMLElement; // Счетчик товаров в корзине
	protected _basketButton: HTMLButtonElement; // Кнопка корзины в хедере

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Получаем ссылки на элементы DOM
		this._gallery = ensureElement<HTMLElement>('.gallery', this.container);
		this._basketCounter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.container
		);
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.container
		);

		// При клике открываем корзину
		this._basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Устанавливаем список карточек товаров в галерею
	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	// Устанавливаем значение счетчика корзины
	set counter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	// Блокируем или разблокируем интерфейс
	set locked(value: boolean) {
		if (value) {
			this.container.classList.add('page__wrapper_locked');
		} else {
			this.container.classList.remove('page__wrapper_locked');
		}
	}
}
