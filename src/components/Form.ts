import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

// Интерфейс, описываем состояние формы: валидность и ошибки
interface IForm {
	valid: boolean;
	errors: string[];
}

// Абстрактный класс Form
export abstract class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement; // Кнопка отправки формы
	protected _errors: HTMLElement; // Элемент для отображения ошибок
	protected _buttons: HTMLButtonElement[]; // Дополнительные кнопки (например, способы оплаты)

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container);

		// Находим элементы формы
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._buttons = Array.from(
			container.querySelectorAll<HTMLButtonElement>('.button_alt')
		);

		// Слушаем события ввода
		container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		// Слушаем отправку формы
		container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	// Метод вызывается при изменении любого поля формы
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`input:change`, {
			field,
			value,
		});
	}

	// Устанавливает доступность кнопки отправки
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// Устанавливает текст ошибок
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Отрисовка формы с текущим состоянием
	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
