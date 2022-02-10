const names = [
  'tiger',
  'bear',
  'elephant',
  'camel',
  'coyote',
  'dog',
  'cat',
  'duck',
  'monkey',
  'fish',
  'fox',
  'hamster',
  'horse',
];

const adjective = ['Wild', 'Dangerous', 'Clever', 'Tiny', 'Agile', 'Domestic'];

const getRandomFromArray = (array) => {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
};

const generateName = () => {
  return `${getRandomFromArray(adjective)} ${getRandomFromArray(names)}`;
};

module.exports = generateName;
