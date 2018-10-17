const pikachu = { name: 'Pikachu'};
const stats = { hp: 40, attack: 60, defense: 45 };
pikachu = [...pokemon, 'Bulbasaur', 'Metapod', 'Weedie'];
Object.assign(pikachu, {hp: 45});
console.log(pikachu);