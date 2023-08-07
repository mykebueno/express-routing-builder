import { Option } from "commander";

export const dirOption = new Option('-d, --dir <path>', 'directory path of the main file (where the route objects are imported), defaults to current working directory if not provided');
export const mainFileOption = new Option('-m, --main <name>', 'name of the main file (usually app.js or server.js) that handles your Express.js routes')
export const routeDirOption = new Option('-rd, --routedir <path>', 'directory where the new route files will be created, defaults to current working directory if not provided');
export const routeOption = new Option('-r, --routes [names...]', 'list of route names to create, route files will be named after these routes, separate multiple route names with spaces');
export const methodOption = new Option('-mt, --methods [names...]', 'list of HTTP methods that the route will handle, separate multiple methods with commas, valid methods are: get, post, put, delete');
export const paramOption = new Option('-p, --params [names...]', 'list of parameters that the route will handle, separate multiple parameters with spaces');