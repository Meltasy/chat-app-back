import { httpServer } from './app.js'
import { PORT } from './config/env.js'

httpServer.listen(PORT, () => {
  console.log(`Message App listening on port ${PORT}`)
})
