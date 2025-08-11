export function setupDeleteConfirmation() {
  const deleteForms = document.querySelectorAll(
    'form[action^="/manageTours/delete/"]',
  );
  deleteForms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      const confirmed = confirm(
        'Ești sigur că vrei să ștergi acest tur? Acțiunea este permanentă.',
      );
      if (!confirmed) e.preventDefault();
    });
  });
}
