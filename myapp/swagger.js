var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: '3.0.2',
    info: {
      title: 'swagger-example API 문서',
      version: '1.0'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./api-doc/**/*.yaml']
}


const specs = swaggerJsdoc(options);

module.exports = {
      swaggerUi,
      specs
};