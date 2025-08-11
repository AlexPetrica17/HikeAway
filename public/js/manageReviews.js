import axios from 'axios';
import { showAlert } from './alerts';

export const initReviewDeleteModal = () => {
  const modal = document.getElementById('deleteModal');
  const reasonInput = document.getElementById('deleteReason');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  const cancelBtn = document.getElementById('cancelDeleteBtn');
  const userSpan = document.querySelector('.modal__user-name');

  let selectedReviewId = null;

  const deleteReview = async (id, reason) => {
    try {
      await axios.delete(`/api/v1/reviews/${id}`, {
        data: { reason },
      });
      showAlert('success', 'Recenzia a fost ștearsă.');
      setTimeout(() => location.reload(), 1500);
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Eroare la ștergere.');
    }
  };

  document.querySelectorAll('.delete-review-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      selectedReviewId = btn.dataset.id;
      const user = btn.dataset.username || 'Utilizator necunoscut';
      userSpan.textContent = `Utilizator: ${user}`;
      reasonInput.value = '';
      modal?.classList.remove('hidden');
    }),
  );

  confirmBtn?.addEventListener('click', () => {
    const reason = reasonInput.value.trim();
    if (!reason) return showAlert('error', 'Scrie un motiv pentru ștergere!');
    deleteReview(selectedReviewId, reason);
  });

  cancelBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
    selectedReviewId = null;
  });
};
