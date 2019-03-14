import { app, server } from './index'
import {
  APP_PORT
} from './config'

app.listen({ port: APP_PORT }, () => {
  console.log(`View app on http://localhost:${APP_PORT}${server.graphqlPath}`)
})
