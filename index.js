#!/usr/bin/env node

import fs from "fs";
import program from "commander";

// Setup commander
program
  .version('1.0.0')
  .description('CLI tool to create Express routing files')
  .option('-d, --directory <type>', 'Directory to create the file in')
  .option('-f, --filename <type>', 'Name of the file to create')
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
fs.writeFile(path, content, err => {
  if (err) {
    console.error(`Failed to create file: ${err.message}`);
    process.exit(1);
  } else {
    console.log('File created successfully!');
  }
});