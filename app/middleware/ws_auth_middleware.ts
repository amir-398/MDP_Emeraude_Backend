import { HttpContext } from '@adonisjs/core/http'
import { Socket } from 'socket.io'
export default class WsAuthMiddleware {
  /**
   * Handle the incoming request.
   *
   * @param ctx - The context object for the request
   * @param next - A callback to invoke the next middleware
   */
  async handle(ctx: any, next: () => Promise<void>) {
    try {
      // Déterminer si le contexte est une requête WebSocket ou HTTP
      if (ctx instanceof HttpContext) {
        // HTTP Context: Continue as normal
        await ctx.auth.authenticate()
      } else if (ctx instanceof Socket) {
        // WebSocket Context: Custom authentication logic
        const token = ctx.handshake?.auth?.token || ctx.handshake?.query?.token

        if (!token) {
          ctx.emit('error', 'Authentication token is missing')
          return ctx.disconnect()
        }

        try {
          // Simuler l'authentification en utilisant le token fourni
          const user = await ctx.auth.use('api').verifyToken(token)
          ctx.request.user = user // Attaching user to the socket request for further use
        } catch (error) {
          ctx.emit('error', 'Authentication failed')
          return ctx.disconnect()
        }
      }

      await next()
    } catch (error) {
      if (ctx instanceof HttpContext) {
        // Redirect to login if it's an HTTP request
        return ctx.response.redirect('/login')
      } else {
        // Emit an error and disconnect the socket
        ctx.emit('error', 'Authentication error')
        ctx.disconnect()
      }
    }
  }
}
