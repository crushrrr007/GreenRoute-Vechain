import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow the request to proceed without auth
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured. Auth features will not work.")
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
