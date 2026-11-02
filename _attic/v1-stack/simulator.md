# 🧪 Виртуальный тренажёр: ИИ-Конструктор задач

Этот модуль позволяет учителю отработать навыки создания задач прямо во время выступления на площадке.

---

## 🎛️ Интерактивный Конструктор Промптов

<div class="simulator-box">
  <form id="prompt-builder">
    <label>1. Выберите язык программирования:</label>
    <select id="lang">
      <option value="Python 3">Python 3</option>
      <option value="C++">C++</option>
      <option value="Паскаль (FreePascal)">Паскаль</option>
    </select>

    <label>2. Тема из курса информатики:</label>
    <select id="topic">
      <option value="Циклы и условия (while/for)">Циклы и условия (while/for)</option>
      <option value="Обработка символьных строк">Обработка символьных строк</option>
      <option value="Двумерные массивы / Матрицы">Двумерные массивы</option>
      <option value="Словари и списки">Словари и списки</option>
    </select>

    <label>3. Историко-патриотический контекст:</label>
    <select id="context">
      <option value="История освоения Ямала и Северного морского пути">Освоение Ямала и СМП</option>
      <option value="Первые советские ЭВМ (МЭСМ, БЭСМ С.А. Лебедева)">Великие ученые: ЭВМ Лебедева</option>
      <option value="Географические открытия и экспедиции России">Географические открытия России</option>
      <option value="Культурное наследие и ремесла народов Севера">Культура и ремесла народов Севера</option>
    </select>

    <button type="button" class="btn-generate" onclick="generatePrompt()">🚀 Сгенерировать Промпт для ИИ</button>
  </form>
</div>

### 📋 Готовый запрос для отправки в GigaChat / YandexGPT:

```text id="output-prompt"
// Нажмите кнопку выше, чтобы сформировать промпт...
```

<button class="btn-copy" onclick="copyPrompt()">📋 Скопировать промпт в буфер</button>

---

## 💻 Онлайн-песочница для тестирования кода

Ниже вы можете протестировать сгенерированный ИИ код задачи:

```python
# Задание: Расчет провизии для арктической экспедиции (Пример)
# Данные о температуре на станциях Ямала
temperatures = [-28, -32, -35, -20, -15, -40, -38]

# Напишите алгоритм поиска самого холодного дня
min_temp = temperatures[0]
for t in temperatures:
    if t < min_temp:
        min_temp = t

print(f"Минимальная температура за экспедицию: {min_temp}°C")
```

<div class="interactive-console">
  <button class="btn-run">▶️ Запустить код</button>
  <div class="console-output">
    [SYSTEM]: Код успешно выполнен. Вывод:
    Минимальная температура за экспедицию: -40°C
  </div>
</div>
