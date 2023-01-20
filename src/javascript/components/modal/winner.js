import { createFighterImage } from '../fighterPreview';
import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function
  showModal({
    title: fighter.name,
    bodyElement: createFighterImage(fighter),
    onClose: () => (document.location.href = '/')
  });
}
