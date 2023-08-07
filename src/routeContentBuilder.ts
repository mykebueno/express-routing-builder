export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface RouteData {
  route: string;
  methods: HttpMethod[];
}

export function generateContent(routeData: RouteData): string {
let methodsContent = '';

for (const method of routeData.methods) {
  methodsContent += `// define the ${method} method route
router.${method}('/', function (req, res) {
    res.send('${routeData.route} ${method} method');
});\n\n`;
}

return `// router for '${routeData.route}' created by express-routing-builder
const express = require('express');
const router = express.Router();

${methodsContent}

module.exports = router;
`;
}

