import { dirOption, routeDirOption, routeOption, methodOption, mainFileOption} from '../options';
import { generateContent, HttpMethod } from '../routeContentBuilder';
import * as path from 'path';
const fs = require("fs");

interface RouteOptions {
  dir?: string;
  main: string;
  routedir?: string;
  routes: string[];
  methods?: string;
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
      if (!options.main || !options.routes) {
        console.error('Error: main file name (-m, --main) and route names (-r, --routes) options are required.');
        process.exit(1);
      }

      let routeDirectory = GetRouteDirectory(options.routedir);

      let methods = GetMethods(options.methods);
      
      let mainDirecory = GetMainDirectory(options.dir);

      options.routes.forEach((route: string) => 
      {
        console.log(`Creating route: ${route}`);

        CreateRouteFile(routeDirectory, route, methods);

        UpdateMainFile(mainDirecory, options.main, route);
      });
    })
}

function GetMethods(methods?: string) : HttpMethod[]
{
  const methodsInput = methods ? methods.split(',').map((method) => method.trim()) : ['get'];
  const validMethods: HttpMethod[] = ['get', 'post', 'put', 'delete'];

  const methodsFiltered = methodsInput.filter((method) => validMethods.includes(method as HttpMethod)) as HttpMethod[];

  if (methodsFiltered.length === 0) 
  {
    console.error('Error: Invalid HTTP method provided. Valid methods are: get/post/put/delete.');
    process.exit(1);
  }

  return methodsFiltered;
}

function GetRouteDirectory(routeDirectory?: string) : string
{
  if(!routeDirectory)
  {
    console.warn('Warn: Route directory (-rd, --routedir) not specified. Defaulting to current working directory.');
  }

  return routeDirectory || process.cwd();
}

function GetMainDirectory(mainDirecory?: string) : string
{
  if(!mainDirecory)
  {
    console.warn('Warn: Main file directory (-d, --dir) not specified. Defaulting to current working directory.');
  }

  return mainDirecory || process.cwd()
}

function CreateRouteFile(dir: string, route: string, methods: HttpMethod[])
{
  const routePath = `${dir}/${route}.js`;

  const content = generateContent({ route: route, methods });

  // Create the file
  fs.writeFile(routePath, content, (err: Error) => {
    if (err) 
    {
      console.error(`Failed to create file: ${err.message}`);
      process.exit(1);
    }

    console.log(`Route file created successfully!`);
  });
}

function UpdateMainFile(dir: string, main: string, route: string)
{
  const appFilePath = path.join(dir, main); 

  fs.readFile(appFilePath, 'utf8', (err: Error, data: any) => {
    if (err) {
      console.error(`Failed to read main file: ${err.message}`);
      process.exit(1);
    }

    // Add import statement
    const importStatement = `import { router as ${route}Router } from './routes/${route}';\n`;
    const importMarker = '/* Import routes here */';
    let newData;
    if (data.includes(importMarker)) {
      newData = data.replace(importMarker, `${importMarker}\n${importStatement}`);
    } else {
      newData = `${importStatement}${data}`;
    }

    // Add route use
    const routeUse = `router.use('/${route}', ${route}Router);\n`;
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
