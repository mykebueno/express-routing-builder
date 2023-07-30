"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const options_1 = require("../options");
const fs = require("fs");
function createCommand(program) {
    program
        .command('create')
        .description('Create new route files')
        .addOption(options_1.dirOption)
        .addOption(options_1.routeDirOption)
        .addOption(options_1.routeOption)
        .addOption(options_1.methodOption)
        .action((options) => {
        // Define the file path and content
        const path = `${options.dir}/${options.route}`;
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
exports.createCommand = createCommand;
//# sourceMappingURL=create.js.map