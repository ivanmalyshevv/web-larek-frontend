import { Form } from './Form';
import { EventEmitter } from './base/events';
import { OrderPayment } from '../types';

// Класс выбора способа оплаты и адреса
export class OrderForm extends Form<OrderPayment> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container, events);

		// Получаем элементы формы
		this._cardButton = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cashButton = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._address = container.elements.namedItem('address') as HTMLInputElement;

		// Обработчики нажатий на кнопки способов оплаты
		if (this._cardButton) {
			this._cardButton.addEventListener('click', () => {
				events.emit('payment:change', {
					payment: this._cardButton.name,
					button: this._cardButton,
				});
			});
		}

		if (this._cashButton) {
			this._cashButton.addEventListener('click', () => {
				events.emit('payment:change', {
					payment: this._cashButton.name,
					button: this._cashButton,
				});
			});
		}
	}

	// Устанавливаем значение адреса
	set address(value: string) {
		this._address.value = value;
	}

	// Переключаем активный стиль у кнопок способа оплаты
	togglePayment(value: HTMLElement) {
		this.clearPayment(); // Сначала убираем активность со всех
		this.toggleClass(value, 'button_alt-active', true); // Затем ставим на текущую
	}

	// Сбрасываем выбор способа оплаты
	clearPayment() {
		this.toggleClass(this._cardButton, 'button_alt-active', false);
		this.toggleClass(this._cashButton, 'button_alt-active', false);
	}
}
