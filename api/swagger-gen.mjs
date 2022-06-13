import swagger from 'swagger-autogen';

const swagGen = swagger();

swagGen('./swagger.json', [
    './api/src/main.mjs'
]);