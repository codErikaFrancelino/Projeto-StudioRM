/**
 * Ponto de entrada principal do front-end do Studio Rafaela Muñoz (SRM).
 */
import { MODALITIES_DATA, SCHEDULE_2027 } from "./data/modalidadesData.js";
import { initUiEffects } from "./modules/uiEffects.js";
import { initModalitiesAndSchedule } from "./modules/modalidadesSchedule.js";

document.addEventListener("DOMContentLoaded", () => {
  initUiEffects();
  initModalitiesAndSchedule({
    modalities: MODALITIES_DATA,
    schedule: SCHEDULE_2027,
  });
});