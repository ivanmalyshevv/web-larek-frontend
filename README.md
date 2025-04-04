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
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
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
interface OrderConfirmation {
  id: string;
  total: number;
}
```

### Интерфейс для модели данных карточек:

```
export interface IProductData {
	cards: IProduct[];
	preview: string | null;
}
```

### Тип карточки на главной странице:


```
type CatalogItem = Omit<ProductItem, 'description'>;

```

### Тип карточки в корзине:


```
type BasketItem = Pick<IProductItem, 'id' | 'name' | 'price'>;

```

### Тип данные в корзине:


```
type BasketItem {
  id: string;
  title: string;
  price: number | null;
}


```

### Типы варианты оплаты:


```
type Payment = 'card' | 'cash' | '';

```

### Тип данных для формы оплаты и адреса:


```
type OrderPayment = Pick<IOrder, 'payment' | 'address'>;

```

### Тип данных для контактной информации:


```
type Contacts = Pick<IOrder, 'email' | 'phone'>;

```

### Тип ошибок валидации форм:


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
- Управление каталогом (`setCatalog`, `setPreview`)
- Работа с корзиной (`add/deleteProduct`, `getBasketTotal`)
- Оформление заказа (`setOrderField`, `validateOrder`)
- Очистка данных (`clearBasket`, `clearOrder`)

## Слой представления (View)

### Основные компоненты
1. **`Modal`** — базовое модальное окно:
  - `open()`, `close()`
  - Управление содержимым

2. **`ProductCard` и производные:**
  - `ProductCardCatalog` — карточка в каталоге
  - `ProductCardPreview` — детальный просмотр
  - `ProductCardBasket` — товар в корзине

3. **`Page`** — главная страница:
  - Каталог, кнопка корзины, счетчик

4. **`Basket`** — корзина товаров:
  - Список, сумма, оформление

5. **`Success`** — подтверждение заказа

6. **`Form` и производные:**
  - `PaymentForm` — оплата и адрес
  - `ContactsForm` — контактные данные

## Слой коммуникации

### Класс `ApiService`
Наследует `Api`, реализует:
  - Получение каталога товаров
  - Отправка заказа
-   Формирование URL изображений

## Взаимодействие компонентов

**Ключевые события:**
  - `products:changed` - обновление каталога
  - `preview:changed` - просмотр товара
  - `modal:open/close` - модальные окна
  - `basket:changed` -  изменение корзины
  - `product:select`, `basket:open` — действия
  - `order:changed`, `formErrors:change` — формы
