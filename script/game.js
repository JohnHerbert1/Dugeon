//Variaves globais
let partyPlayer;

const areas = ["entrada", "labirinto de ingrar", "catacunbas do vicilio", "castelo do antigo reino", "Floresta sussurante"]
// Definição das magias como constantes para evitar reatribuição acidental
const fireMagic = [
  { nome: "Bola de Fogo", dano: 40.2, efeito: "explosao" },
  { nome: "Bafo de Dragão", dano: 20.2, efeito: "burn" }
];

const iceMagic = [
  { nome: "Furacão Gelido", dano: 25, efeito: "" },
  { nome: "Cristal Aurora", dano: 19.2, efeito: "congelamento" }
];

const darkMagic = [
  { nome: "Autoridade da Blasfêmia", dano: 21, efeito: "debuff" },
  { nome: "Vozes Infernais", dano: 0.0, efeito: "enloquecimento" },
  { nome: "Execução Sombria", dano: 30.2, efeito: "dilacera" },
  { nome: "Negrificacao", dano: 0.0, efeito: "buff" }
];

const milagres = [{ nome: "Cura", vida: 21, efeito: "buff" }]

//-------------------------------Classes---------------------------------
class Character {
  constructor(nome, raca) {
    this.nome = nome;
    this.raca = raca
    this.level = 1;
    this.xp = 0;
    this.up = 100;         // XP necessária para subir de nível
    this.lvMaximo = 100;
    this.hp = 100;         // Valor padrão, pode ser sobrescrito pelas classes filhas
    this.attack = 10;      // Atenção: troquei "atack" por "attack" para consistência
    this.magic = 10;
    this.defesa = 10;
    this.crit = 5;
    this.critChance = 0.1;
    this.equipment = [];   // Corrigido: "equipament" → "equipment"
    this.bag = [];
    this.spells = [];      // Corrigido: "spels" → "spells"
    this.vivo = true;
  }

  // Método para subir de nível
  upLevel() {
    // Considera xp acumulada suficiente para subir de nível (>= em vez de ===)
    if (this.xp >= this.up) {
      this.level++;
      // Uso correto de Math.random() com parênteses
      this.attack += Math.random() * 5;
      this.defesa += Math.random() * 10;
      this.magic += Math.random() * 10;
      this.crit += Math.random() * 5;
      this.hp += Math.random() * 10;
      // Reinicia ou ajusta o XP após o level up
      this.xp = 0;
      console.log(`${this.nome} subiu para o nível ${this.level}!`);
    }
  }
}

class Arqueiro extends Character {
  constructor(nome, raca) {
    super(nome, raca);
    this.hp = 100;
    this.attack = 15;
    this.magic = 10;
    this.defesa = 6;
    this.crit = 12;
    this.critChance = 0.6;
    this.spells = [
      { nome: "Tiro Ínfimo", dano: 15, efeito: "perfuracao" }
    ];
    this.equipment = [];
  }
}

class Cavaleiro extends Character {
  constructor(nome) {
    super(nome);
    this.hp = 140;
    this.attack = 13;
    this.magic = 5;
    this.defesa = 16;
    this.crit = 5;
    this.critChance = 0.1;
    this.spells = [];
    this.equipment = [];
  }
}

class Mago extends Character {
  constructor(nome) {
    super(nome);
    this.hp = 70;
    this.attack = 5;
    this.magic = 16;
    this.defesa = 6;
    this.crit = 8;
    this.critChance = 0.1;
    // Ajustado os índices para evitar erros de acesso fora dos limites
    this.spells = [fireMagic[1], iceMagic[1], darkMagic[2]];
    this.equipment = [];
  }
}

class Enemy extends Character {
  constructor(nome) {
    super(nome)
    this.area;//esta referente em qual are ele sera encontrado     
    this.tipy;
    t
  }

}


class Assassino extends Character {
  constructor(nome) {
    super(nome);
    this.hp = 70;
    this.attack = 5;
    this.magic = 16;
    this.defesa = 6;
    this.crit = 8;
    this.critChance = 0.1;
    // Corrigido o índice para utilizar uma magia existente
    this.spells = [darkMagic[1]];
    this.equipment = [];
  }
}

// Função para aplicar efeitos de magias/ataques
function aplicarEfeito(efeito) {
  switch (efeito) {
    case "burn":
      console.log("O inimigo está queimando!");

      break;
    case "congelamento":
      console.log("O inimigo foi congelado!");
      break;

    default:
      console.log("Sem efeito especial.");
      break;
  }
}




partyPlayer = [Arqueiro("Piri"), Cavaleiro("Londrick"), Mago("Ashana"), Assassino("Cassios")]


