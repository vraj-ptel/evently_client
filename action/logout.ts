'use server'
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
 
export async function logOut() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    revalidatePath('/')
}