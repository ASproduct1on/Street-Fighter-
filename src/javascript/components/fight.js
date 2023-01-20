import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over

    const leftFighter = {
      ...firstFighter,
      hasblock: false,
      position: 'left',
      indicator: document.getElementById('left-fighter-indicator'),
      current_health: firstFighter.health,
      criticalCombo: new Set(),
      canCriticalHit: true
    };

    const rightFighter = {
      ...secondFighter,
      hasblock: false,
      position: 'right',
      indicator: document.getElementById('right-fighter-indicator'),
      current_health: secondFighter.health,
      criticalCombo: new Set(),
      canCriticalHit: true
    };

    function addEventListeners() {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
    }

    addEventListeners();

    function removeEventListeners() {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    }

    function onKeyUp(event) {
      const { repeat, code } = event;
      if (!repeat) {
        switch (code) {
          case controls.PlayerOneBlock:
            removeBlock(leftFighter);
            break;
          case controls.PlayerTwoBlock:
            removeBlock(rightFighter);
        }
        if (controls.PlayerOneCriticalHitCombination.includes(code)) {
          leftFighter.criticalCombo.delete(code);
        }
        if (controls.PlayerTwoCriticalHitCombination.includes(code)) {
          rightFighter.criticalCombo.delete(code);
        }
      }
    }

    function onKeyDown(event) {
      const { repeat, code } = event;
      if (!repeat) {
        switch (code) {
          case controls.PlayerOneAttack:
            if (!leftFighter.hasBlock && !rightFighter.hasBlock) putDamage(rightFighter, leftFighter);
            break;
          case controls.PlayerTwoAttack:
            if (!leftFighter.hasBlock && !rightFighter.hasBlock) putDamage(leftFighter, rightFighter);
            break;
          case controls.PlayerOneBlock:
            putBlock(leftFighter);
            break;
          case controls.PlayerTwoBlock:
            putBlock(rightFighter);
        }
        if (
          controls.PlayerOneCriticalHitCombination.includes(code) &&
          !leftFighter.hasBlock &&
          leftFighter.canCriticalHit
        ) {
          leftFighter.criticalCombo.add(code);
          if (leftFighter.criticalCombo.size === 3) {
            putCriticalDamage(rightFighter, leftFighter);
          }
        }
        if (
          controls.PlayerTwoCriticalHitCombination.includes(code) &&
          !rightFighter.hasBlock &&
          leftFighter.canCriticalHit
        ) {
          rightFighter.criticalCombo.add(code);
          if (rightFighter.criticalCombo.size === 3) {
            putCriticalDamage(leftFighter, rightFighter);
          }
        }
      }
    }

    function putDamage(defender, attacker) {
      const { position } = defender;
      defender.current_health -= getDamage(attacker, defender);
      changePercentage(defender);
      checkHealth(defender.current_health, position);
    }

    function checkHealth(health, position) {
      if (health <= 0) {
        removeEventListeners();
        position === 'right' ? resolve(leftFighter) : resolve(rightFighter);
      }
    }

    function changePercentage(defender) {
      const { current_health, health } = defender;
      const percentage = (current_health / health) * 100;
      defender.indicator.style.width = `${percentage <= 0 ? 0 : percentage}%`;
    }

    function putCriticalDamage(defender, attacker) {
      defender.current_health -= attacker.attack * 2;
      changePercentage(defender);
      checkHealth(defender.current_health, defender.position);
      defender.criticalCombo.clear();
      attacker.canCriticalHit = false;
      setTimeout(() => (attacker.canCriticalHit = true), 10000);
    }

    function removeBlock(defender) {
      defender.hasblock = false;
    }
    function putBlock(defender) {
      defender.hasblock = true;
    }
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage <= 0 ? 0 : damage;
}

export function getHitPower(fighter) {
  // return hit power
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
}
