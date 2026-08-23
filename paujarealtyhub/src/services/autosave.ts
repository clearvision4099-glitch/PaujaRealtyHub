import { updateDraft } from "./draft";

let timeout: ReturnType<typeof setTimeout>;

export function autoSave(
  draftId: string | null,
  data: any
) {
  if (!draftId) {
    return;
  }

  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    try {
      await updateDraft(draftId, data);
      console.log("Draft auto-saved");
    } catch (error) {
      console.error(
        "AUTO SAVE DRAFT ERROR:",
        error
      );
    }
  }, 3000);
}