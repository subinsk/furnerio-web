import { createClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect('/error')
    }

    redirect('/auth/login')
}