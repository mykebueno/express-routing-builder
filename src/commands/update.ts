import { dirOption, routeDirOption, routeOption, methodOption } from '../options';
const fs = require("fs");

interface RouteOptions {
  dir: string;
  routedir: string;
  route: string;
  method?: string;
}

export function updateCommand(program: any) {

  program
    .command('update')
    .description('update existing routes')
    .addOption(dirOption)
    .addOption(routeDirOption)
    .addOption(routeOption)
    .addOption(methodOption)
    .action((options: RouteOptions) => {
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
      fs.writeFile(path, content, (err: Error) => {
        if (err) {
          console.error(`Failed to create file: ${err.message}`);
          process.exit(1);
        } 
        console.log('File created successfully!');
      });
    });

}
