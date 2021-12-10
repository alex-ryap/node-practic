import colors from 'colors';

let [min, max] = process.argv.slice(2);

const minNumber = Number(min);
const maxNumber = Number(max);

let isNumber = true;

if (isNaN(minNumber)) {
  console.log(colors.red(`${min} is not a Number`));
  isNumber = false;
}
if (isNaN(maxNumber)) {
  console.log(colors.red(`${max} is not a Number`));
  isNumber = false;
}

if (!isNumber) process.exit();

const isPrime = (num) => {
  if (num === 1 || num <= 0) return false;

  if (num === 2) return true;

  const sqrtNum = Math.ceil(Math.sqrt(num));

  for (let i = 2; i <= sqrtNum; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const printColorsResult = (arr) => {
  if (arr.length === 0) console.log(colors.red('Not found primes number'));

  let count = 1;

  arr.map((item) => {
    if (count > 3) count = 1;
    count === 1 && console.log(colors.green(item));
    count === 2 && console.log(colors.yellow(item));
    count === 3 && console.log(colors.red(item));
    count++;
  });
};

const arrPrime = [];

for (let i = minNumber; i <= maxNumber; i++) {
  isPrime(i) && arrPrime.push(i);
}
printColorsResult(arrPrime);
