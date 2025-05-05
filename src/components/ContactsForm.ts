import { Form } from './Form';
import { EventEmitter } from './base/events';
import { Contacts } from '../types';

// Класс формы контактов
export class OrderContacts extends Form<Contacts> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);

		// Получаем ссылки на элементы формы
		this._email = container.elements.namedItem('email') as HTMLInputElement;
		this._phone = container.elements.namedItem('phone') as HTMLInputElement;
	}

	// Устанавливаем значение email
	set email(value: string) {
		this._email.value = value;
	}

	// устанавливаем значение телефона
	set phone(value: string) {
		this._phone.value = value;
	}
}
