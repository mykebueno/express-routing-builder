import { dirOption, routeDirOption, routeOption, methodOption, mainFileOption} from '../options';
import { generateContent, HttpMethod } from '../routeContentBuilder';
import * as path from 'path';
const fs = require("fs");

interface RouteOptions {
  dir?: string;
  main: string;
  routedir?: string;
  route: string;
  method?: string;
}

export function createCommand(program: any) {

  program
    .command('create')
    .description('Create new route files')
    .addOption(dirOption)
    .addOption(mainFileOption)
    .addOption(routeDirOption)
    .addOption(routeOption)
    .addOption(methodOption)
    .action((options: RouteOptions) => {

      // Check for required options
      if (!options.main || !options.route) {
        console.error('Error: route directory (-rd, --routedir) and route name (-r, --route) options are required.');
        process.exit(1);
      }

      CreateRouteFile(options);

      UpdateMainFile(options);
    })
}

function CreateRouteFile(options: RouteOptions)
{
  if(!options.routedir)
  {
    console.warn('Warn: Route directory (-rd, --routedir) not specified. Defaulting to current working directory.');
  }

  const dir = options.routedir || process.cwd();
  const routePath = `${dir}/${options.route}.js`;

  // Get the methods
  const methodsInput = options.method ? options.method.split(',') : ['get'];
  const validMethods: HttpMethod[] = ['get', 'post', 'put', 'delete'];

  const methods = methodsInput.filter((method) => validMethods.includes(method as HttpMethod)) as HttpMethod[];

  if (methods.length === 0) {
    console.error('Error: Invalid HTTP method provided. Valid methods are: get, post, put, delete.');
    process.exit(1);
  }

  const content = generateContent({ route: options.route, methods });

  // Create the file
  fs.writeFile(routePath, content, (err: Error) => {
    if (err) {
      console.error(`Failed to create file: ${err.message}`);
      process.exit(1);
    }

    console.log('Route file created successfully!');
  });
}

function UpdateMainFile(options: RouteOptions)
{
  if(!options.dir)
  {
    console.warn('Warn: Main file directory (-d, --dir) not specified. Defaulting to current working directory.');
  }

  const dir = options.routedir || process.cwd();
  const appFilePath = path.join(dir, options.main); 

  fs.readFile(appFilePath, 'utf8', (err: Error, data: any) => {
    if (err) {
      console.error(`Failed to read main file: ${err.message}`);
      process.exit(1);
    }

    // Add import statement
    const importStatement = `import { router as ${options.route}Router } from './routes/${options.route}';\n`;
    const importMarker = '/* Import routes here */';
    let newData;
    if (data.includes(importMarker)) {
      newData = data.replace(importMarker, `${importMarker}\n${importStatement}`);
    } else {
      newData = `${importStatement}${data}`;
    }

    // Add route use
    const routeUse = `router.use('/${options.route}', ${options.route}Router);\n`;
    const routeMarker = '/* Insert routes here */';
    let finalData;
    if (newData.includes(routeMarker)) {
      finalData = newData.replace(routeMarker, `${routeMarker}\n${routeUse}`);
    } else {
      finalData = `${newData}\n${routeMarker}\n${routeUse}`;
    }

    fs.writeFile(appFilePath, finalData, (err: Error) => {
      if (err) {
        console.error(`Failed to update main file: ${err.message}`);
        process.exit(1);
      }

      console.log('Main file updated successfully!');
    });
  })
}
