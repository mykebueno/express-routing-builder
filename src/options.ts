import { Option } from "commander";

export const dirOption = new Option('-d, --dir <path>', 'directory of file containing the router objects');
export const mainFileOption = new Option('-m, --main <name>', 'name of file where the routes are setup')
export const routeDirOption = new Option('-rd, --routedir <path>', 'directory where route files are created');
export const routeOption = new Option('-r, --routes [names...]', 'name of routes to create');
export const methodOption = new Option('-m, --methods [names]', 'methods to be handled (separate with a comma \',\' if several chosen): get/post/put/delete');