"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = void 0;
function generateContent(routeData) {
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
exports.generateContent = generateContent;
//# sourceMappingURL=routeContentBuilder.js.map