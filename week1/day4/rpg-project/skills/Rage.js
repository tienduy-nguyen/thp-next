const SpecialSkill = require('./SpecialSkill');

class Rage extends SpecialSkill {
  constructor(dmg = 4, mana = 0, dmgCounter = 0, dmgBonus = 1, pvPlus = -1) {
    super(dmg, mana, dmgCounter, dmgBonus);
    this.hpCounter = hpCounter;
  }
}

module.exports = Rage;
