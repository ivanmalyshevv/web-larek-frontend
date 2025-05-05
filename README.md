# Проектная работа "Веб-ларек"

## Стек: `HTML, SCSS, TS, Webpack`

**Структура проекта:**
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

**Важные файлы:**
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
---

# Описание проекта:

"Веб-ларек" – это онлайн-магазин для разработчиков, 
 предлагающий удобный интерфейс для просмотра товаров, 
 управления корзиной и оформления заказов.

 ## Основные функции проекта:

1. **Главная страница**:
   - Отображение каталога товаров.
   - Информация о товаре в модальном окне.
   - Быстрый доступ к корзине через иконку.

2. **Взаимодействие с товарами**:
   - Добавление/удаление товаров из корзины.
   - Подсчет общей стоимости.

3. **Оформление заказа**:
   - 1 этап: Выбор оплаты и ввод адреса.
   - 2 этап: Ввод контактов и подтверждение.
   - Валидация полей перед отправкой.

4. **Общие требования**:
   - Модальные окна закрываются при клике вне их области или по кнопке.
   - Кнопки активируются только после заполнения обязательных полей.

---

# Архитектура проекта:

Проект построен по принципам `MVP (Model-View-Presenter)` с использованием брокера событий для связи между компонентами.
 1. `Model (AppState)` - хранение и обработка данных
 2. `View (Компоненты)` - отображение интерфейса
 3. `Presenter (EventEmitter)` - связующий слой

## Типы данных:

### Для Карточек:
```
interface IProductItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  button: string;
}
```

### Для Заказа:

```
interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```
### Потверждение заказа:
```
export interface OrderConfirmation extends IOrder {
  total: number;
  items: string[];
}
```

### Интерфейс для модели данных карточек:

```
interface IProductData {
  total: number;
  items: IProductItem[];
}
```

### Тип элемента каталога:


```
type ICatalogItem = Omit<IProductItem, 'description'>;

```

### Тип карточки в корзине:


```
type IBasketProduct = Pick<IProductItem, 'id' | 'title' | 'price'>;

```

### Тип карточки в корзине:


```
type IProductCategory = { [key: string]: string };

```

### Тип корзины:


```
type IBasketItem {
  items: IBasketItem[];
  total: number | null;
}


```

### Интерфейс результата заказа:


```
interface OrderDataResult {
  id: string;
  total: number;
}


```

### Тип способа оплаты:


```
type Payment = 'card' | 'cash' | '';

```

###  Тип данных для оплаты:


```
type OrderPayment = Pick<IOrder, 'payment' | 'address'>;

```

### Тип контактных данных:


```
type Contacts = Pick<IOrder, 'email' | 'phone'>;

```

### Тип ошибок валидации:


```
type ValidationErrors = Partial<Record<keyof IOrder, string>>;

```
## Базовые классы

### 1. `EventEmitter`
Брокер событий (реализует `IEvents`):
   - `on(event: string, callback: Function)` — подписка на событие
   - `emit(event: string, ...args: any[])` — генерация события
   - `trigger(event: string)` — возвращает функцию-триггер

### 2. `Api`
Базовый класс для HTTP-запросов:
   - `get(endpoint: string)` — GET запрос
   - `post(endpoint: string, data: object, method = 'POST')` — POST/PUT запросы

### 3. `Component<T>`
Базовый компонент представления:
   - `toggleClass()`, `setText()`, `setDisabled()` — утилиты
   - `render(data: T)` — обновление представления

## Слой данных (Model)

### Класс `AppState`
Хранит состояние приложения:
   - `catalog: IProductItem[]` — товары
   - `preview: string | null` — просматриваемый товар
   - `basket: IProductItem[]` — корзина
   - `order: IOrder | null` — заказ
   - `formErrors: ValidationErrors` — ошибки

**Методы:**
   - Устанавливает каталог и генерирует событие (`setCatalog(items)`)
   - Устанавливает предпросмотр (`setPreview(item)`)
   - Возвращает товар по ID. (`getProduct(id)`)
   - Добавляет товар в корзину (`addProductToBasket(item)`)
   - Удаляет товар из корзины (`deleteProductFromBasket(item)`)
   - Проверяет наличие товара в корзине (`isAddedToBusket(item)`)
   - Возвращает текст кнопки "Купить" или "Удалить". (`getButtonText(item)`)
   - Возвращает количество товаров в корзине (`getBasketTotal()`)
   - Возвращает индекс товара в корзине (`getProductIndex(item)`)
   - Обновляет поле заказа (`setOrderField(field, value)`)
   - Устанавливает способ оплаты (`setOrderPayment(value)`)
   - Возвращает данные заказа (`getOrderData()`)
   - Валидирует форму заказа (`validateOrder()`)
   - Очищает корзину (`clearBasket()`)
   - Очищает данные заказа (`clearOrder()`)

## Слой представления (View)

### Основные компоненты
1. **`Modal`** — базовое модальное окно:

      ***`Поля:`***
         - `container: HTMLElement`- контейнер модального окна
         - `closeButton: HTMLButtonElement` - кнопка закрытия
         - `content: HTMLElement` - контейнер для контента

      ***`Методы:`***
         - `open()`- открытие модального окна
         - `close()` - закрытие модального окна
         - `render(data)` - отрисовывает и открывает модальное окно

      ***`Обработчики событий:`***
         - `click` на `closeButton` - закрытие модального окна
         - `click` вне контента - закрытие модального окна

2. **`ProductCard`** - Базовый класс карточки товара
   **`ProductCardCatalog`** - Карточка товара в каталоге.
   **`ProductCardPreview`** - Подробное описание товара.
   **`ProductCardBasket`** - товар в корзине с возможностью удаления.

      ***`Поля:`***
         - `element: HTMLElement`- DOM-элемент карточки
         - `button: HTMLButtonElement` - кнопка действия (добавить/удалить)
         - `title: HTMLElement` - заголовок товара
         - `price: HTMLElement` - цена товара
         - `image: HTMLImageElement` - изображение товара
         - `category: HTMLElement` - категория товара
         - `description: HTMLElement` - описание товара

      ***`Методы:`***
         - `set title(value)`- Устанавливает название товара
         - `set price(value)`- Устанавливает цену товара
         - `set image(value)`- Устанавливает изображение товара
         - `set category(value)`- Устанавливает категорию товара
         - `set description(value)`- Устанавливает описание товара
         - `set button(value)`- Устанавливает текст кнопки.

      ***`Обработчики событий:`***
         - `click` на карточке - выбор товара (для галереи)
         - `click` на кнопке - действие с товаром (добавить/удалить)
         - `click` на кнопке удаления (deleteButton) - удаление товара из корзины (вызов метода класса карточки)
3. **`Page`** — главная страница:

      ***`Поля:`***
         - `gallery: HTMLElement`- контейнер галереи товаров
         - `basketButton: HTMLButtonElement` - кнопка корзины
         - `basketCounter: HTMLElement` - счетчик товаров в корзине

      ***`Методы:`***
         - `set catalog(items)`- Устанавливает список товаров в галерее
         - `set counter(value)`- Устанавливает счетчик товаров в корзине
         - `set locked(value)`- Блокирует/разблокирует интерфейс

      ***`Обработчики событий:`***
         - `click` на `basketButton` - открытие корзины

4. **`Basket`** — корзина товаров:

      ***`Поля:`***
         - `list: HTMLUListElement`- список товаров
         - `total: HTMLSpanElement` - общая стоимость
         - `button: HTMLButtonElement` - кнопка оформления заказа

      ***`Методы:`***
         - `set items(items)`- Устанавливает элементы корзины
         - `set total(total)`- Устанавливает общую сумму
         - `set selected(count)`- Блокирует кнопку, если нет товаров

      ***`Обработчики событий:`***
         - `click` на `HTMLButtonElement` - переход к оформлению заказа

5. **`Success`** — успешный заказ

      ***`Поля:`***
         - `closeButton: HTMLButtonElement`- кнопка закрытия
         - `description: HTMLElement` - описание заказа

      ***`Методы:`***
         - `set total(value)`- установка суммы заказа

      ***`Обработчики событий:`***
         - `click` на `closeButton` - закрытие окна

6. **`OrderForm`** - Форма заказа

   ***`Поля:`***
         - `cashButton: HTMLButtonElement[]` - кнопки выбора оплаты
         - `address: HTMLInputElement` - поле адреса
         - ` cardButton: HTMLButtonElement` - кнопки выбора оплаты

      ***`Методы:`***
         - `togglePayment(value)`- переключает активный стиль кнопок
         - `clearPayment()`- сбрасывает выбор способа оплаты

      ***`Обработчики событий:`***
         - `click` на `_cardButton` - выбор способа оплаты
         - `input` на `_address` - ввод адреса
         - `click` на `_cashButton` - выбор способа оплаты

7. **`ContacntsForm`** -  форма контактов 

      ***`Поля:`***
         - `form: HTMLFormElement`- форма контактов
         - `emailInput: HTMLInputElement` - поле email
         - `phoneInput: HTMLInputElement` -  поле телефона
         - `submitButton: HTMLButtonElement` -  кнопка отправки

      ***`Методы:`***
         - `render(data: Contacts)`- отображение формы
         - `setErrors(errors: ValidationErrors)`- отображение ошибок

      ***`Обработчики событий:`***
         - `input` на полях формы - ввод данных
         - `submit` формы - отправка данных

 8. **`Form`** -  отображение общих элементов форм заказа

      ***`Поля:`***
         - `form: HTMLFormElement`- форма контактов
         - `emailInput: HTMLInputElement` - поле email
         - `phoneInput: HTMLInputElement` -  поле телефона
         - `submitButton: HTMLButtonElement` -  кнопка отправки

      ***`Методы:`***
         - `onInputChange(field: keyof T, value: string)`- Обработчик изменения поля
         - `valid = boolean`- установка доступности кнопки отправки
         - `errors = string`- установка текста ошибок

      ***`Обработчики событий:`***
         - `input` на полях формы - ввод данных
         - `submit` формы - отправка данных        

## Слой коммуникации

### Класс `ApiService`
Наследует `Api`, реализует:
   - Получение каталога товаров
   - Отправка заказа
   - Формирование URL изображений

## Взаимодействие компонентов

**Ключевые события:**
   - `products:changed` - обновление каталога
   - `catalog:select` - выбор товара в каталоге
   - `preview:changed` - просмотр товара
   - `modal:open/close` - открытие/закрытие модального окна
   - `basket:changed` -  изменение корзины
   - `product:select`, `basket:open` — действия
   - `order:open` — открытие формы заказа
   - `button:status` —  изменение статуса кнопки (добавить/удалить)
   - `basket:open` — открытие корзины
   - `basket:delete` — удаление товара из корзины
   - `input:change` — изменение полей формы
   - `order:submit` — отправка формы заказа
   - `contacts:submit` — отправка контактных данных
   - `order:finished` — завершение заказа