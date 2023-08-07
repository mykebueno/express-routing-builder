"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const options_1 = require("../options");
const routeContentBuilder_1 = require("../routeContentBuilder");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const logging_1 = __importDefault(require("logging"));
const logger = (0, logging_1.default)('ERB');
function createCommand(program) {
    program
        .command('create')
        .description('create new routes')
        .addOption(options_1.dirOption)
        .addOption(options_1.mainFileOption)
        .addOption(options_1.routeDirOption)
        .addOption(options_1.routeOption)
        .addOption(options_1.methodOption)
        .action((options) => {
        // Check for required options
        if (!options.main || !options.routes) {
            logger.error('main file name (-m, --main) and route names (-r, --routes) options are required.');
            process.exit(1);
        }
        let mainDirectory = GetMainDirectory(options.dir);
        let mainFilePath = GetMainFilePath(mainDirectory, options.main);
        let routeDirectory = GetRouteDirectory(options.routedir);
        let methods = GetMethods(options.methods);
        let importPath = path.relative(mainDirectory, routeDirectory);
        for (const route of options.routes) {
            logger.info(`Creating route: ${route}`);
            CreateRouteFile(routeDirectory, route, methods);
            UpdateMainFile(importPath, mainFilePath, route);
        }
    });
}
exports.createCommand = createCommand;
function GetMethods(methods) {
    const methodsInput = methods || ['get'];
    const validMethods = ['get', 'post', 'put', 'delete'];
    const methodsFiltered = methodsInput.filter((method) => validMethods.includes(method));
    if (methodsFiltered.length === 0) {
        logger.error('Invalid HTTP method provided. Valid methods are: get/post/put/delete.');
        process.exit(1);
    }
    return [...new Set(methodsFiltered)];
}
function GetRouteDirectory(routeDirectory) {
    if (!routeDirectory) {
        logger.warn('Route directory (-rd, --routedir) not specified. Defaulting to current working directory.');
        routeDirectory = path.join(process.cwd(), 'routes');
        fs.mkdirSync(routeDirectory, { recursive: true });
    }
    if (!fs.existsSync(routeDirectory)) {
        logger.error(`Directory '${routeDirectory}' does not exist.`);
        process.exit(1);
    }
    return routeDirectory;
}
function GetMainDirectory(mainDirecory) {
    if (!mainDirecory) {
        logger.warn('Main file directory (-d, --dir) not specified. Defaulting to current working directory.');
        mainDirecory = process.cwd();
    }
    if (!fs.existsSync(mainDirecory)) {
        logger.error(`Directory '${mainDirecory}' does not exist.`);
        process.exit(1);
    }
    return mainDirecory;
}
function GetMainFilePath(mainDir, main) {
    const mainFilePath = path.join(mainDir, main);
    if (!fs.existsSync(mainFilePath)) {
        console.error(`Directory '${mainFilePath}' does not exist.`);
        process.exit(1);
    }
    return mainFilePath;
}
function CreateRouteFile(dir, route, methods) {
    // check if this file already exists
    const routePath = `${dir}/${route}.js`;
    const content = (0, routeContentBuilder_1.generateContent)({ route: route, methods });
    try {
        fs.writeFileSync(routePath, content);
        logger.info(`Route file created successfully!`);
    }
    catch (err) {
        logger.error(`Failed to create file: ${err.message}`);
        process.exit(1);
    }
}
function UpdateMainFile(importPath, mainFilePath, route) {
    // Normalize the path to avoid issues with different OSes
    importPath = path.normalize(importPath);
    // If on Windows, replace '\\' with '/' to get valid import paths
    if (path.sep === '\\') {
        importPath = importPath.replace(/\\/g, '/');
    }
    // Ensure path starts with './' if in the same or a subdirectory
    importPath = importPath.startsWith(".") ? importPath : "./" + importPath;
    let data;
    try {
        data = fs.readFileSync(mainFilePath, 'utf8');
    }
    catch (err) {
        logger.error(`Failed to read main file: ${err.message}`);
        process.exit(1);
    }
    // Add import statement
    const importStatement = `import { router as ${route}Router } from '${importPath}/${route}';`;
    const importMarker = '/* Import routes here */';
    let newData;
    if (data.includes(importMarker)) {
        newData = data.replace(importMarker, `${importMarker}\n${importStatement}`);
    }
    else {
        newData = `${importMarker}\n${importStatement}\n\n${data}`;
    }
    // Add route use
    const routeUse = `router.use('/${route}', ${route}Router);`;
    const routeMarker = '/* Insert routes here */';
    let finalData;
    if (newData.includes(routeMarker)) {
        finalData = newData.replace(routeMarker, `${routeMarker}\n${routeUse}`);
    }
    else {
        finalData = `${newData.endsWith('\n') ? newData : newData + '\n'}\n${routeMarker}\n${routeUse}\n`;
    }
    try {
        fs.writeFileSync(mainFilePath, finalData);
        logger.info('Main file updated successfully!');
    }
    catch (err) {
        logger.error(`Failed to update main file: ${err.message}`);
        process.exit(1);
    }
}
//# sourceMappingURL=create.js.map