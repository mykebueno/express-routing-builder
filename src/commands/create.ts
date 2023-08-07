import { dirOption, routeDirOption, routeOption, methodOption, mainFileOption} from '../options';
import { generateContent, HttpMethod } from '../routeContentBuilder';
import * as path from 'path';
import * as fs from 'fs';
import createLogger from 'logging';

const logger = createLogger('ERB');

interface RouteOptions {
  dir?: string;
  main: string;
  routedir?: string;
  routes: string[];
  methods?: string[];
}

export function createCommand(program: any) {

  program
    .command('create')
    .description('create new routes')
    .addOption(dirOption)
    .addOption(mainFileOption)
    .addOption(routeDirOption)
    .addOption(routeOption)
    .addOption(methodOption)
    .action((options: RouteOptions) => {
      // Check for required options
      if (!options.main || !options.routes) 
      {
        logger.error('main file name (-m, --main) and route names (-r, --routes) options are required.');
        process.exit(1);
      }

      let mainDirectory: string = GetMainDirectory(options.dir);

      let mainFilePath: string = GetMainFilePath(mainDirectory, options.main);

      let routeDirectory: string = GetRouteDirectory(options.routedir);

      let methods: HttpMethod[] = GetMethods(options.methods);

      let importPath =  path.relative(mainDirectory, routeDirectory);

      for (const route of options.routes) 
      {
        logger.info(`Creating route: ${route}`);
    
        CreateRouteFile(routeDirectory, route, methods);
    
        UpdateMainFile(importPath, mainFilePath, route);
      }
    })
}

function GetMethods(methods?: string[]) : HttpMethod[]
{
  const methodsInput = methods || ['get'];
  const validMethods: HttpMethod[] = ['get', 'post', 'put', 'delete'];

  const methodsFiltered = methodsInput.filter((method) => validMethods.includes(method as HttpMethod)) as HttpMethod[];

  if (methodsFiltered.length === 0) 
  {
    logger.error('Invalid HTTP method provided. Valid methods are: get/post/put/delete.');
    process.exit(1);
  }

  return [...new Set(methodsFiltered)];
}

function GetRouteDirectory(routeDirectory?: string) : string
{
  if(!routeDirectory)
  {
    logger.warn('Route directory (-rd, --routedir) not specified. Defaulting to current working directory.');

    routeDirectory = path.join(process.cwd(), 'routes');

    fs.mkdirSync(routeDirectory, { recursive: true });
  }

  if(!fs.existsSync(routeDirectory))
  {
    logger.error(`Directory '${routeDirectory}' does not exist.`);

    process.exit(1);
  }

  return routeDirectory;
}

function GetMainDirectory(mainDirecory?: string) : string
{
  if(!mainDirecory)
  {
    logger.warn('Main file directory (-d, --dir) not specified. Defaulting to current working directory.');

    mainDirecory = process.cwd();
  }

  if(!fs.existsSync(mainDirecory))
  {
    logger.error(`Directory '${mainDirecory}' does not exist.`);

    process.exit(1);
  }

  return mainDirecory;
}

function GetMainFilePath(mainDir: string, main: string)
{
  const mainFilePath = path.join(mainDir, main);

  if (!fs.existsSync(mainFilePath)) 
  {
      logger.error(`Directory '${mainFilePath}' does not exist.`);

      process.exit(1);
  }

  return mainFilePath;
}

function CreateRouteFile(dir: string, route: string, methods: HttpMethod[])
{
  // check if this file already exists
  const routePath = `${dir}/${route}.js`;

  const content = generateContent({ route: route, methods });
  
  try 
  {
    fs.writeFileSync(routePath, content);

    logger.info(`Route file created successfully!`);
  } 
  catch (err: any) 
  {
    logger.error(`Failed to create file: ${(err as Error).message}`);

    process.exit(1);
  }
}

function UpdateMainFile(importPath: string, mainFilePath: string,route: string)
{
  // Normalize the path to avoid issues with different OSes
  importPath = path.normalize(importPath);

  // If on Windows, replace '\\' with '/' to get valid import paths
  if(path.sep === '\\') 
  {
    importPath = importPath.replace(/\\/g, '/');
  }

  // Ensure path starts with './' if in the same or a subdirectory
  importPath = importPath.startsWith(".") ? importPath : "./" + importPath

  let data: string;
  try 
  {
    data = fs.readFileSync(mainFilePath, 'utf8');
  } 
  catch (err: any) 
  {
    logger.error(`Failed to read main file: ${(err as Error).message}`);

    process.exit(1);
  }

  // Add import statement
  const importStatement = `import { router as ${route}Router } from '${importPath}/${route}';`;
  const importMarker = '/* Import routes here */';
  let newData: string;

  if (data.includes(importMarker)) 
  {
    newData = data.replace(importMarker, `${importMarker}\n${importStatement}`);
  } 
  else 
  {
    newData = `${importMarker}\n${importStatement}\n\n${data}`;
  }

  // Add route use
  const routeUse = `router.use('/${route}', ${route}Router);`;
  const routeMarker = '/* Insert routes here */';
  let finalData: string;

  if (newData.includes(routeMarker)) 
  {
    finalData = newData.replace(routeMarker, `${routeMarker}\n${routeUse}`);
  } 
  else 
  {
    finalData = `${newData.endsWith('\n')? newData : newData + '\n'}\n${routeMarker}\n${routeUse}\n`;
  }
  
  try {
    fs.writeFileSync(mainFilePath, finalData);
    logger.info('Main file updated successfully!');
  } 
  catch (err) 
  {
    logger.error(`Failed to update main file: ${(err as Error).message}`);
    process.exit(1);
  }
}
