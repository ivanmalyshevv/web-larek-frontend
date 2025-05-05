import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс данных для модального окна
interface ModalComponent {
	content: HTMLElement;
}

// Класс модального окна
export class Modal extends Component<ModalComponent> {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Находим элементы внутри модального окна
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);

		// Добавляем обработчики событий
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Устанавливает новое содержимое модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Открываем модальное окно
	open(): void {
		this.container.classList.add('modal_active');
		document.body.style.overflow = 'hidden';
		document.body.style.width = '100%';
		this.events.emit('modal:open');
	}

	// Закрываем модальное окно
	close(): void {
		this.container.classList.remove('modal_active');
		document.body.style.overflow = '';
		document.body.style.width = '';
		this._content.replaceChildren();
		this.events.emit('modal:close');
	}

	// Отрисовываем модальное окно и открываем его
	render(data: ModalComponent): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
