import { Context } from '@netlify/functions'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Api-Password',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export default async (request: Request, context: Context) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers })
  }

  const password = request.headers.get('x-api-password')

  // "nelly" is the hardcoded password requested by the user
  if (password && password.toLowerCase() === 'nelly') {
    return new Response(
      JSON.stringify({ success: true, message: 'Welcome back!' }),
      { status: 200, headers }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { status: 401, headers }
  )
}
