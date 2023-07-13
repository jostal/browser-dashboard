import { writable } from "svelte/store"

const user = writable({
  session: false
})

export { user }
