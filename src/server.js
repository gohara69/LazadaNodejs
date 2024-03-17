const app = require('./app')

const PORT = 3305;
const server = app.listen(PORT, () => {
    console.log(`WSV Instagram init with PORT ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => {console.log('Exit Server Express')})
})