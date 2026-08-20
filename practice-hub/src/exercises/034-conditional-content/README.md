# 034 Conditional Content

You're working on a part of a web app that's responsible for **showing a warning** when a user is about to perform a dangerous action.

Therefore, your task is to **conditionally** show a warning box once a user has **clicked** a specific button. Inside that warning dialog, another button allows users to **dismiss the warning** (i.e., remove the warning box from the screen).

The finished app should display this UI, if the `<button>` has not been clicked yet:

![](https://img-c.udemycdn.com/redactor/raw/coding_exercise_instructions/2023-01-25_19-46-44-9e8772f6a8078c9d8f887588a31cdce2.png)



And this UI, once the button was clicked:

![](https://img-c.udemycdn.com/redactor/raw/coding_exercise_instructions/2023-09-06_12-57-21-a8d95b784a4564808114e8b27898a128.jpg)

<br>

Once the "Proceed" button was clicked, the warning box should be removed again:

![](https://img-c.udemycdn.com/redactor/raw/coding_exercise_instructions/2023-01-25_19-46-45-422a664c8ab05139df000f6945d859ff.png)



For this task, you must react to clicks on both `<button>` elements that are part of the starting code. The second button, outside of the `<div>` with the `id="alert"`, should show the `<div id="alert">` (and all its content). The button inside that `<div>` should then hide it again (i.e., remove it from the DOM).

It's up to you whether you want to use a ternary expression or store the conditionally shown JSX code in a variable.

*Important: In this Udemy code editor you may get an error if you use *`*useState()*`* - use *`*React.useState()*`* instead!*
