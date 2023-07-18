import { writable } from "svelte/store"
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

let getConfig = async (user_id) => {
  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    db: { schema: 'config' }
  })

  const { data, error } = await supabase.rpc('get_user_config', { user_uuid: user_id })

  if (error) {
    console.error(error)
  } else {
    return data
  }
}

const user = writable({
  session: false,
  config: null,
  refresh: false
})

export { user, getConfig }
