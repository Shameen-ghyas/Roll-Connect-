const dice = document.querySelector('.dice');

function randomDice() {
  const random = Math.floor(Math.random() * 6) + 1;
  rollDice(random);
}

function rollDice(random) {
  dice.style.animation = 'rolling 1s';
  setTimeout(() => {
    switch (random) {
      case 1: dice.style.transform = 'rotateX(0deg) rotateY(0deg)'; break;
      case 2: dice.style.transform = 'rotateX(-90deg) rotateY(0deg)'; break;
      case 3: dice.style.transform = 'rotateX(0deg) rotateY(90deg)'; break;
      case 4: dice.style.transform = 'rotateX(0deg) rotateY(-90deg)'; break;
      case 5: dice.style.transform = 'rotateX(90deg) rotateY(0deg)'; break;
      case 6: dice.style.transform = 'rotateX(180deg) rotateY(0deg)'; break;
    }
    dice.style.animation = 'none';
  }, 1000);
}

dice.addEventListener('click', randomDice);

