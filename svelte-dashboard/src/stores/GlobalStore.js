import { writable } from "svelte/store";

const globalState = writable({
  editMode: false,
  supabase: null
})

export { globalState }
