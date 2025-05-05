import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс данных для экрана успеха
interface ISuccess {
	total: number;
}

// Класс успешного заказа
export class Success extends Component<ISuccess> {
	protected _description: HTMLElement; // Текстовое описание общей суммы
	protected _closeButton: HTMLButtonElement; // Кнопка "За новыми покупками"

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Находим элементы
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		// При клике закрываем окно
		this._closeButton.addEventListener('click', () => {
			this.events.emit('order:finished');
		});
	}

	// Устанавливаем сумму заказа
	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
