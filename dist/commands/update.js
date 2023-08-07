"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommand = void 0;
const options_1 = require("../options");
const fs = require("fs");
function updateCommand(program) {
    program
        .command('update')
        .description('update existing routes')
        .addOption(options_1.dirOption)
        .addOption(options_1.routeDirOption)
        .addOption(options_1.routeOption)
        .addOption(options_1.methodOption)
        .action((options) => {
        // Define the file path and content
        const path = `${options.routedir}/${options.route}`;
        const content = `
      const express = require('express');
      const router = express.Router();

      // define the home page route
      router.get('/', function (req, res) {
        res.send('Home page')
      });

      module.exports = router;
      `;
        // Create the file
        fs.writeFile(path, content, (err) => {
            if (err) {
                console.error(`Failed to create file: ${err.message}`);
                process.exit(1);
            }
            console.log('File created successfully!');
        });
    });
}
exports.updateCommand = updateCommand;
//# sourceMappingURL=update.js.map