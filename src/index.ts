#!/usr/bin/env node
import { createCommand } from './commands/create';
import { updateCommand } from './commands/update';
import { deleteCommand } from './commands/delete';

const { program} = require("commander"); 
const figlet = require("figlet");


console.log(figlet.textSync('Routing Builder', {
  font: 'cursive'
}) + "\n");

// Setup commander
program
  .version('1.0.0', '-v, --version', 'output the current version')
  .name('rb')
  .description('CLI tool to create/update/delete Express routing files')

// Adding the commands
createCommand(program);
updateCommand(program);
deleteCommand(program);

// Parsing the command line arguments
program.parse(process.argv);