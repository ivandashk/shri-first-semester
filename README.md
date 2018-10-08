# ШРИ 2018-2. Домашнее задание

## Задание 1. Адаптиваная верстка

**Задача:** Нужно сверстать страницу ленты событий умного дома. Предоставляется базовый дизайн ленты для экрана. Изменения размеров и компоновки карточек на других размерах экрана необходимо придумать и реализовать самостоятельно. Верстка должна быть максимально адаптивной. Отрисовка ленты с помощью шаблонизатора, т.е. генерация HTML из предоставленного набора данных в формате JSON

**Комментарии к решению.** 
Шаблонизатор карточек находится по пути: src/blocks/card/card-generator.js

- В качестве основы для ленты используется грид с 6ю колонками для десктопа, с постепенным уменьшением сначала до 5, затем до 4х колонок. В мобильной версии, грид заменяется на flexbox.
- Место расположения кнопки расширения карточки, которая появляется при ховере, определяется динамически в зависимости от контента внизу карточки. При возникновении коллизий, кнопка поднимается выше.
- В процессе шаблонизации применяется смешанный метод: сборка с нуля через js + использование template тэгов (блоки player и measurements)
- Подключение внешних данных events происходит через тэг script до шаблонизатора. Файл находится в папке docs/ и был модифицирован добавлением const data = {данные}.
- Ссылка на авторские права на изображения находится в футере в разделе Авторские права (Лицензия)
- Адаптивность изображений присутствует на примере графика Richdata.png
- После ряда экспериментов, отказался от адаптивной типографики в пользу более строгого соответствия дизайн-макету.

**Как можно доработать** 
1. Заменить способ обрезки двустрочных заголовков многоточием. Сейчас неадаптивное решение - обрезка на основе количества символов при создании карточки. К тому же, не учитывается символ, на котором было перенесено слово на первой строке, ужасно. Можно при событии resize окна считать на основе высоты контейнера заголовка, но хотелось бы узнать есть ли метод лучше/производительнее.
2. На карточке "Изменен климатический режим" строка "Влажность: 80%" располагается не в соответствии с дизайн-макетом на десктопе
3. Улучшить отображение слайдеров в Edge
4. Возможен некорректный вид карточек, содержащий другие конфигурации контента и компоновки.
5. Исправить размер кнопки "Расширить" на карточках в Firefox. Сейчас или явном задании размеров либо расширяется сама карточка, либо стрелочку необходимо расположить чуть выше, что не будет соответствовать дизайн-макету.

## Задание 2. Работа с сенсорным пользовательским вводом

**Задача:** При использовании сенсорного устройства на карточке с камерой необходимо реализовать:
- Движение пальцем влево-вправо позволяет перемещаться по картинке - поворот камеры 
- Pinch позволяет приблизить или отдалить картинку
- Поворот изменяет яркость изображения
- Появление на карточке соответсвующих индикаторов согласно дизайн-макету

**Комментарии к решению.**
Путь к скрипту с решением: src/blocks/card/gestures-camera.js

Решение построено на предпосылке, что после того, как начинается жест, в течение следующих нескольких движений, 
необходимо его окончательно распознать.
После этого, мы фиксируемся на данном жесте и не позволяем пользователю переключаться на другой жест до окончания текущего. 

Из данной предпосылки вытекают следующие особенности:
1. Движение "pan" начинается сразу, как только регистрируется движение с одним указателем, но не фиксируется. 
В течение нескольких следующих движений пользователю дается время, чтобы поставить второй палец и переключиться на двухпальцевый жест.
2. В начале двухпальцевого жеста, пропускаем несколько движений указателей "вхолостую" для его распознания. Если в течение серии движений
указатели удалились друг от друга более, чем на величину, определенную эмпирическим путем, жест - "pinch". Если движения происходят,
а удаление указателей друг от друга не наблюдается, предполагаем, что это "rotate".
3. При выполнении движения "rotate", фиксация на данном жесте сохраняется до тех пор, пока не будут отпущены все указатели.
Это сделано для того, чтобы можно было отпустить второй палец, переставить его на новое место и продолжить выполнять данное движение.

**Как можно доработать** 
1. После зуммирования, сейчас паномарируется не все изображение, а только центральная его часть.
2. Если движение "pinch" выполняется слишком медленно (расстояние между указателями не успевает превысить некоторую величину), 
движение будет распознано как "rotate".
