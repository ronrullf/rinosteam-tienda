import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: object }[]
        ) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string
              value: string
              options?: object
            }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              response.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // Proteger rutas /admin/dashboard — redirigir a login si no hay sesión
  if (path.startsWith('/admin/dashboard') && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Si ya tiene sesión y va al login, redirigir al dashboard
  if (path === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
