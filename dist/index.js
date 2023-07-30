#!/usr/bin/env node
"use strict";
const fs = require("fs");
const { program } = require("commander");
const figlet = require("figlet");
console.log(figlet.textSync("Routing Builder") + "\n");
// Setup commander
program
    .version('1.0.0', '-v')
    .name('rb')
    .description('CLI tool to create Express routing files')
    .option('--dir <path>', 'Directory to add the route object in')
    .option('--routedir <path>', 'Directory to create the route file in')
    .option('--route <name>', 'Name of the file to create')
    .parse(process.argv);
const options = program.opts();
// Check for required options
if (!options.directory || !options.filename) {
    console.error('Error: both directory (-d, --directory) and filename (-f, --filename) options are required.');
    process.exit(1);
}
// Define the file path and content
const path = `${options.directory}/${options.filename}`;
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
//# sourceMappingURL=index.js.map