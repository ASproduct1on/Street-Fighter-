import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });

  // todo: show fighter info (image, name, health, etc.)

  fighterElement.append(createFighterInfo(fighter));
  return fighterElement;
}

function createFighterInfo(fighter) {
  if (!fighter) return ' ';
  const { name, health, attack, defense } = fighter;

  const container = createElement({
    tagName: 'div',
    className: 'fighter-preview___info-block'
  });

  const imgElement = createFighterImage(fighter);

  const nameBlock = document.createElement('div');
  nameBlock.innerText = name;

  const healthBlock = document.createElement('div');
  healthBlock.innerText = `Health: ${health}`;

  const attackBlock = document.createElement('div');
  attackBlock.innerText = `Attack: ${attack}`;

  const defenseBlock = document.createElement('div');
  defenseBlock.innerText = `Defense: ${defense}`;

  container.append(imgElement, nameBlock, healthBlock, attackBlock, defenseBlock);

  return container;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes
  });

  return imgElement;
}
