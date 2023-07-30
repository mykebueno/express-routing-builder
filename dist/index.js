#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("./commands/create");
const update_1 = require("./commands/update");
const delete_1 = require("./commands/delete");
const { program } = require("commander");
const figlet = require("figlet");
console.log(figlet.textSync('Routing Builder', {
    font: 'cursive'
}) + "\n");
// Setup commander
program
    .version('1.0.0', '-v, --version', 'output the current version')
    .name('rb')
    .description('CLI tool to create/update/delete Express routing files');
// Adding the commands
(0, create_1.createCommand)(program);
(0, update_1.updateCommand)(program);
(0, delete_1.deleteCommand)(program);
// Parsing the command line arguments
program.parse(process.argv);
//# sourceMappingURL=index.js.map