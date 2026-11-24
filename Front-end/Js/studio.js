/**
 * Inicialização modular da aplicação web — Studio Rafaela Muñoz.
 */
import { MODALITIES_DATA, SCHEDULE_2027 } from "./data/modalidadesData.js";
import { initUiEffects } from "./modules/uiEffects.js";
import { initModalitiesAndSchedule } from "./modules/modalidadesSchedule.js";
import { initPhotoAlbums } from "./modules/photoAlbums.js";

document.addEventListener("DOMContentLoaded", () => {
  initUiEffects();
  initModalitiesAndSchedule({ modalities: MODALITIES_DATA, schedule: SCHEDULE_2027 });
  initPhotoAlbums();
});