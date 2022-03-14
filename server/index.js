import server from './server.js'

server.listen(3001)
.on('listening', () => console.log('server running'))