import { Context } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { facts as factsSchema } from '../../../src/db/schema'
import { eq, desc } from 'drizzle-orm'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Api-Password',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

export default async (request: Request, context: Context) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers })
  }

  // Security check
  const password = request.headers.get('x-api-password')
  if (!password || password.toLowerCase() !== 'nelly') {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers }
    )
  }

  try {
    const connectionString = process.env.VITE_DATABASE_URL
    if (!connectionString) {
      throw new Error('Database URL not found')
    }

    const sql = neon(connectionString)
    const db = drizzle(sql, { schema: { facts: factsSchema } })

    const url = new URL(request.url)

    // ───────────────────────── GET ─────────────────────────
    if (request.method === 'GET') {
      const target = url.searchParams.get('target') || 'khadidja'

      const result = await db
        .select()
        .from(factsSchema)
        .where(eq(factsSchema.target, target))
        .orderBy(desc(factsSchema.createdAt))

      return new Response(JSON.stringify(result), {
        status: 200,
        headers,
      })
    }

    // ───────────────────────── POST ─────────────────────────
    if (request.method === 'POST') {
      const body = await request.json()

      const [newFact] = await db
        .insert(factsSchema)
        .values({
          content: body.content,
          ipAddress: body.ipAddress,
          userAgent: body.userAgent,
          location: body.location,
          tags: body.tags,
          target: body.target,
        })
        .returning()

      return new Response(JSON.stringify(newFact), {
        status: 200,
        headers,
      })
    }

    // ───────────────────────── PUT ─────────────────────────
    if (request.method === 'PUT') {
      const body = await request.json()
      const { id, content, tags } = body

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing ID' }),
          { status: 400, headers }
        )
      }

      const [updatedFact] = await db
        .update(factsSchema)
        .set({
          content,
          tags,
          updatedAt: new Date(),
        })
        .where(eq(factsSchema.id, id))
        .returning()

      return new Response(JSON.stringify(updatedFact), {
        status: 200,
        headers,
      })
    }

    // ───────────────────────── DELETE ─────────────────────────
    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id')

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing ID' }),
          { status: 400, headers }
        )
      }

      await db.delete(factsSchema).where(eq(factsSchema.id, id))

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      )
    }

    // ───────────────────────── FALLBACK ─────────────────────────
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed' }),
      { status: 405, headers }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: String(error),
      }),
      { status: 500, headers }
    )
  }
}
