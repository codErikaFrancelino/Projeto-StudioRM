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

  let currentAlbumTitle = "Álbum de fotos";
  let currentPhotos = [];

  const renderAlbumGrid = () => {
    title.textContent = currentAlbumTitle;
    content.classList.remove("is-zoomed");
    content.replaceChildren();

    currentPhotos.forEach((photoData) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "album-photo-btn";
      btn.setAttribute("aria-label", "Ampliar foto");

      const img = document.createElement("img");
      img.src = photoData.src;
      img.alt = photoData.alt || "";
      img.loading = "eager";
      img.decoding = "async";
      img.addEventListener("error", () => {
        btn.classList.add("is-broken");
      });

      btn.append(img);
      btn.addEventListener("click", () => renderZoomedPhoto(photoData));
      content.append(btn);
    });
  };

  const renderZoomedPhoto = (photoData) => {
    title.textContent = `${currentAlbumTitle} — Foto ampliada`;
    content.classList.add("is-zoomed");
    content.replaceChildren();

    const wrapper = document.createElement("div");
    wrapper.className = "album-zoom-view";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn-outline album-back-btn";
    backBtn.textContent = "← Voltar ao álbum";
    backBtn.addEventListener("click", renderAlbumGrid);

    const img = document.createElement("img");
    img.src = photoData.src;
    img.alt = photoData.alt || "";
    img.className = "album-zoom-img";

    wrapper.append(backBtn, img);
    content.append(wrapper);
  };

  document.querySelectorAll(".album-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const albumKey = trigger.dataset.album;
      const album = document.getElementById(`album-${albumKey}`);
      if (!(album instanceof HTMLTemplateElement)) {
        throw new Error(`Álbum não encontrado: ${albumKey}`);
      }

      currentAlbumTitle = album.dataset.title || "Álbum de fotos";
      const imgs = [...album.content.querySelectorAll("img")];
      currentPhotos = imgs.map((imgEl) => ({
        src: imgEl.getAttribute("src") || "",
        alt: imgEl.getAttribute("alt") || "",
      }));

      renderAlbumGrid();
      if (!dialog.open) {
        dialog.showModal();
      }
    });
  });

  closeButton.addEventListener("click", () => {
    content.classList.remove("is-zoomed");
    dialog.close();
  });

  dialog.addEventListener("cancel", () => {
    content.classList.remove("is-zoomed");
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      content.classList.remove("is-zoomed");
      dialog.close();
    }
  });
}