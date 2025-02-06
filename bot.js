const mineflayer = require('mineflayer');
const readline = require('readline');
const { Vec3 } = require('vec3');

const bot = mineflayer.createBot({
  host: 'mc.funtime.su', // IP сервера
  port: 25565, // Порт сервера
  username: 'AutoclickerBot' // Имя бота
});

let autoclickerActive = false;
let isSneaking = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input === 'on') {
    autoclickerActive = true;
    console.log('Автокликер включен!');
    attackMobs();
  } else if (input === 'off') {
    autoclickerActive = false;
    console.log('Автокликер выключен!');
  } else if (input === 'sit') {
    toggleSneak();
  }
});

function attackMobs() {
  if (!autoclickerActive) return;

  const entity = bot.nearestEntity(entity => {
    return entity.type === 'mob' && isHostile(entity.name) && bot.entity.position.distanceTo(entity.position) < 3 && !isBlocked(bot.entity.position.offset(0, 1.6, 0), entity.position.offset(0, 0.5, 0));
  });

  if (entity) {
    bot.attack(entity);
    setTimeout(attackMobs, 500); // Повторяем атаку каждые 500 мс
  } else {
    setTimeout(attackMobs, 1000); // Проверяем снова через 1 секунду
  }
}

function toggleSneak() {
  isSneaking = !isSneaking;
  bot.setControlState('sneak', isSneaking);
  console.log(isSneaking ? 'Бот сел!' : 'Бот встал!');
}

function isHostile(mobName) {
  const hostileMobs = ['zombie', 'skeleton', 'creeper', 'spider', 'enderman'];
  return hostileMobs.includes(mobName);
}

function isBlocked(startPos, targetPos) {
  const direction = targetPos.minus(startPos).normalize();
  let currentPos = startPos.clone();

  while (currentPos.distanceTo(targetPos) > 1) {
    currentPos = currentPos.plus(direction);
    const block = bot.blockAt(currentPos.floored());
    if (block && block.boundingBox !== 'empty') {
      return true; // Есть блок на пути
    }
  }
  return false;
}