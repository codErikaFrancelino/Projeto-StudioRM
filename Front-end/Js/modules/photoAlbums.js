function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: #${id}`);
  }
  return element;
}

export function initPhotoAlbums() {
  const dialog = getRequiredElement("photo-album");
  const title = getRequiredElement("photo-album-title");
  const content = getRequiredElement("photo-album-content");
  const closeButton = dialog.querySelector(".album-close");

  if (!closeButton) {
    throw new Error("Botão para fechar o álbum não encontrado.");
  }

  document.querySelectorAll(".album-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const album = document.getElementById(`album-${trigger.dataset.album}`);
      if (!(album instanceof HTMLTemplateElement)) {
        throw new Error(`Álbum não encontrado: ${trigger.dataset.album}`);
      }

      title.textContent = album.dataset.title || "Álbum de fotos";
      content.replaceChildren(album.content.cloneNode(true));
      dialog.showModal();
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dialog.close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
