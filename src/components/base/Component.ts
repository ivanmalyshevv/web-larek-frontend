// Абстрактный базовый класс для всех компонентов приложения
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Переключаем CSS-класс у элемента
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Устанавливаем текстовое содержимое элемента
	protected setText(element: HTMLElement, value: unknown): void {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Скрываем элемент
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показываем элемент
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Включаем или выключаем атрибут disabled у элемента
	setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Устанавливаем изображение у элемента
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Принимаем данные, обновляет поля класса и возвращает корневой элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
