const swaggerAutoGen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointFiles = ['./server.js', './routes/*.js']

swaggerAutoGen(outputFile, endpointFiles)