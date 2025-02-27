// =============================
// 1. SEÇÃO DE CONSTANTES GLOBAIS
// =============================

// Seleção de elementos do DOM (GUI)
const playerSide = document.getElementById("playerSide");
const enemySide = document.getElementById("enemySide");
const combatLog = document.getElementById("combatLog");
const turnCountEl = document.getElementById("turnCount");
const selectedTargetName = document.getElementById("selectedTargetName");
const btnAttack = document.getElementById("btnAttack");
const btnMagic = document.getElementById("btnMagic");
const btnDefend = document.getElementById("btnDefend");
const btnItem = document.getElementById("btnItem");
const btnPrevTarget = document.getElementById("prevTarget");
const btnNextTarget = document.getElementById("nextTarget");

// Índice do inimigo selecionado atualmente
let selectedEnemyIndex = 0;

// Áreas do jogo (exemplo de cenário)
const areas = [
  "entrada",
  "labirinto de ingrar",
  "catacunbas do vicilio",
  "castelo do antigo reino",
  "Floresta sussurante"
];

// Definição das magias
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
const milagres = [
  { nome: "Cura", vida: 21, efeito: "buff" }
];

// =============================
// 2. CLASSES DE PERSONAGENS E INIMIGOS (MESMA LÓGICA)
// =============================
class Character {
  constructor(nome, raca) {
    this.nome = nome;
    this.raca = raca;
    this.level = 1;
    this.xp = 0;
    this.up = 100;         // XP necessária para subir de nível
    this.lvMaximo = 100;
    this.hp = 100;         // Valor padrão
    this.attack = 10;
    this.magic = 10;
    this.defesa = 10;
    this.crit = 5;
    this.critChance = 0.1;
    this.equipment = [];
    this.bag = [];
    this.spells = [];
    this.vivo = true;
  }

  atacar(alvo) {
    if (!this.vivo) return `${this.nome} não pode atacar, está derrotado!`;
    if (!alvo || !alvo.vivo) return `${this.nome} não encontrou um alvo válido.`;

    let baseDamage = Math.max(0, this.attack - alvo.defesa);
    let dano = Math.round(baseDamage * (0.5 + Math.random()));
    if (baseDamage > 0 && dano === 0) dano = 1;

    alvo.hp -= dano;
    if (alvo.hp <= 0) {
      alvo.hp = 0;
      alvo.vivo = false;
      return `${this.nome} atacou ${alvo.nome} causando ${dano} de dano! ${alvo.nome} foi derrotado!`;
    }
    return `${this.nome} atacou ${alvo.nome} causando ${dano} de dano!`;
  }

  upLevel() {
    if (this.xp >= this.up) {
      this.level++;
      this.attack += Math.random() * 5;
      this.defesa += Math.random() * 10;
      this.magic += Math.random() * 10;
      this.crit += Math.random() * 5;
      this.hp += Math.random() * 10;
      this.xp = 0;
      console.log(`${this.nome} subiu para o nível ${this.level}!`);
    }
  }
}

class Arqueiro extends Character {
  constructor(nome, raca = "Humano") {
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
  }
}
class Cavaleiro extends Character {
  constructor(nome, raca = "Humano") {
    super(nome, raca);
    this.hp = 140;
    this.attack = 13;
    this.magic = 5;
    this.defesa = 16;
    this.crit = 5;
    this.critChance = 0.1;
    this.spells = [];
  }
}
class Mago extends Character {
  constructor(nome, raca = "Humano") {
    super(nome, raca);
    this.hp = 70;
    this.attack = 5;
    this.magic = 16;
    this.defesa = 6;
    this.crit = 8;
    this.critChance = 0.1;
    this.spells = [fireMagic[1], iceMagic[1], darkMagic[2]];
  }
}
class Assassino extends Character {
  constructor(nome, raca = "Humano") {
    super(nome, raca);
    this.hp = 70;
    this.attack = 5;
    this.magic = 16;
    this.defesa = 6;
    this.crit = 8;
    this.critChance = 0.1;
    this.spells = [darkMagic[1]];
  }
}
class Enemy extends Character {
  constructor(nome, tipo, raca = "Desconhecido") {
    super(nome, raca);
    this.tipo = tipo;
    this.defesaElemental = 0;
    this.spells = [
      { nome: "Bola Sombria", dano: 12 },
      { nome: "Chamas do Caos", dano: 20 }
    ];
  }

  atacar(alvo) {
    if (!this.vivo) return `${this.nome} não pode atacar, está derrotado!`;
    if (!alvo || !alvo.vivo) return `${this.nome} não encontrou um alvo válido.`;

    let possiveisAcoes = [
      { acao: "fisico", valor: this.attack },
      { acao: "magico", valor: this.magic },
      { acao: "defender", valor: this.defesa }
    ];

    let indiceAleatorio = Math.floor(Math.random() * possiveisAcoes.length);
    let acaoEscolhida = possiveisAcoes[indiceAleatorio];

    if (acaoEscolhida.acao === "magico" && this.spells.length === 0) {
      acaoEscolhida = { acao: "fisico", valor: this.attack };
    }

    switch (acaoEscolhida.acao) {
      case "fisico": {
        let dano = this.calcularDano(acaoEscolhida.valor, alvo.defesa);
        alvo.hp -= dano;
        if (alvo.hp <= 0) {
          alvo.hp = 0;
          alvo.vivo = false;
          return `${this.nome} atacou fisicamente ${alvo.nome} causando ${dano} de dano! ${alvo.nome} foi derrotado!`;
        }
        return `${this.nome} atacou fisicamente ${alvo.nome} causando ${dano} de dano!`;
      }
      case "magico": {
        let spellAleatorio = this.spells[Math.floor(Math.random() * this.spells.length)];
        let dano = this.calcularDano(this.magic + spellAleatorio.dano, alvo.defesa);
        if (dano < 1) dano = 1;
        alvo.hp -= dano;
        if (alvo.hp <= 0) {
          alvo.hp = 0;
          alvo.vivo = false;
          return `${this.nome} usou ${spellAleatorio.nome} em ${alvo.nome} causando ${dano} de dano! ${alvo.nome} foi derrotado!`;
        }
        return `${this.nome} usou ${spellAleatorio.nome} em ${alvo.nome} causando ${dano} de dano!`;
      }
      case "defender": {
        this.defesa += 5;
        return `${this.nome} se defendeu, aumentando sua defesa em 5 pontos!`;
      }
      default:
        return `${this.nome} não fez nada de especial.`;
    }
  }

  calcularDano(ataqueInimigo, defesaAlvo) {
    let baseDamage = Math.max(0, ataqueInimigo - defesaAlvo);
    let dano = Math.round(baseDamage * (0.5 + Math.random()));
    if (baseDamage > 0 && dano === 0) dano = 1;
    return dano;
  }
}

// =============================
// 3. CLASSE DE BATALHA
// =============================
class Battle {
  constructor(partyPlayer, enemyParty) {
    this.partyPlayer = partyPlayer;
    this.enemyParty = enemyParty;
    this.turnCount = 0;
    this.battleEnded = false;
  }

  nextTurn() {
    if (this.battleEnded) {
      logMessage("A batalha já terminou.");
      return;
    }
    this.turnCount++;
    turnCountEl.textContent = this.turnCount; // Atualiza indicador de turno
    logMessage(`\n=== Turno ${this.turnCount} ===`);

    // Heróis atacam
    for (let hero of this.partyPlayer) {
      if (hero.vivo) {
        let alvo = this.enemyParty.find(enemy => enemy.vivo);
        if (alvo) {
          logMessage(hero.atacar(alvo));
        }
      }
    }

    // Inimigos atacam
    for (let enemy of this.enemyParty) {
      if (enemy.vivo) {
        let alvo = this.partyPlayer.find(hero => hero.vivo);
        if (alvo) {
          logMessage(enemy.atacar(alvo));
        }
      }
    }

    // Verifica condição de fim de batalha
    if (this.enemyParty.every(enemy => !enemy.vivo)) {
      logMessage("Todos os inimigos foram derrotados! Vitória dos heróis!");
      this.endBattle();
    } else if (this.partyPlayer.every(hero => !hero.vivo)) {
      logMessage("Todos os heróis foram derrotados! Os inimigos vencem!");
      this.endBattle();
    }
  }

  endBattle() {
    this.battleEnded = true;
    logMessage("Batalha encerrada!");
  }
}

// =============================
// 4. INSTÂNCIA DOS PERSONAGENS
// =============================
let partyPlayer = [
  new Arqueiro("Piri"),
  new Cavaleiro("Londrick"),
  new Mago("Ashana"),
  new Assassino("Cassios")
];
let enemyParty = [
  new Enemy("Goblin", "básico", "Goblin"),
  new Enemy("Orc", "forte", "Orc")
];

// =============================
// 5. FUNÇÕES DE INTERFACE (GUI)
// =============================
function renderBattlefield() {
  if (!playerSide || !enemySide) return;

  playerSide.innerHTML = "";
  enemySide.innerHTML = "";

  // Renderiza o grupo de heróis
  partyPlayer.forEach(hero => {
    let heroDiv = document.createElement("div");
    heroDiv.classList.add("character");
    heroDiv.innerHTML = `
      <strong>${hero.nome}</strong><br>
      HP: ${hero.hp}${!hero.vivo ? " (Derrotado)" : ""}
    `;
    playerSide.appendChild(heroDiv);
  });

  // Renderiza o grupo de inimigos
  enemyParty.forEach((enemy, index) => {
    let enemyDiv = document.createElement("div");
    enemyDiv.classList.add("enemy");
    // Se este inimigo estiver selecionado, adiciona classe 'selected'
    if (index === selectedEnemyIndex) {
      enemyDiv.classList.add("selected");
    }
    enemyDiv.innerHTML = `
      <strong>${enemy.nome}</strong><br>
      HP: ${enemy.hp}${!enemy.vivo ? " (Derrotido)" : ""}
    `;
    enemySide.appendChild(enemyDiv);
  });

  // Atualiza o nome do inimigo selecionado (se existir)
  if (enemyParty[selectedEnemyIndex]) {
    selectedTargetName.textContent = enemyParty[selectedEnemyIndex].nome;
  } else {
    selectedTargetName.textContent = "--";
  }
}

/**
 * Função para registrar mensagens no combatLog
 */
function logMessage(msg) {
  if (!msg) return;
  combatLog.textContent += msg + "\n";
  combatLog.scrollTop = combatLog.scrollHeight;
}

// =============================
// 6. LÓGICA PRINCIPAL (EXECUÇÃO)
// =============================

// Cria instância da batalha
const battleInstance = new Battle(partyPlayer, enemyParty);

// Renderiza o campo de batalha inicialmente
renderBattlefield();
turnCountEl.textContent = 1;

// Executa o primeiro turno automaticamente (se quiser)
battleInstance.nextTurn();
renderBattlefield();

/* EVENTOS DE CLIQUE NOS BOTÕES */

// Botão Attack
btnAttack.addEventListener("click", () => {
  if (battleInstance.battleEnded) {
    logMessage("A batalha já terminou.");
    return;
  }
  // Exemplo: o primeiro herói vivo ataca o inimigo selecionado
  const hero = partyPlayer.find(h => h.vivo);
  const enemy = enemyParty[selectedEnemyIndex];
  if (!hero) {
    logMessage("Não há heróis vivos para atacar.");
    return;
  }
  if (!enemy || !enemy.vivo) {
    logMessage("O inimigo selecionado não é válido.");
    return;
  }
  logMessage(hero.atacar(enemy));
  renderBattlefield();
});

// Botão Magic
btnMagic.addEventListener("click", () => {
  logMessage("Você clicou em Magic (exemplo). Aqui você pode abrir um painel para escolher feitiços.");
  // Exemplo: abra seu painel de magias, selecione a magia, etc.
});

// Botão Defend
btnDefend.addEventListener("click", () => {
  logMessage("Você clicou em Defend (exemplo). Aqui você pode implementar a lógica de defesa do herói.");
});

// Botão Item
btnItem.addEventListener("click", () => {
  logMessage("Você clicou em Items (exemplo). Abra o inventário ou algo similar.");
});

/* EVENTOS PARA TROCAR O ALVO SELECIONADO */
btnPrevTarget.addEventListener("click", () => {
  // Move o índice para a esquerda
  selectedEnemyIndex--;
  if (selectedEnemyIndex < 0) {
    selectedEnemyIndex = enemyParty.length - 1;
  }
  renderBattlefield();
});
btnNextTarget.addEventListener("click", () => {
  // Move o índice para a direita
  selectedEnemyIndex++;
  if (selectedEnemyIndex >= enemyParty.length) {
    selectedEnemyIndex = 0;
  }
  renderBattlefield();
});

/* OPÇÃO: AVANÇAR O TURNO QUANDO QUISER
   Por exemplo, clique na div .turnIndicatior:
*/
document.querySelector(".turnIndicatior").addEventListener("click", () => {
  battleInstance.nextTurn();
  renderBattlefield();
});
