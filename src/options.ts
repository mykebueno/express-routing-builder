import { Option } from "commander";

export const dirOption = new Option('-d, --dir <path>', 'directory of file where the router object resides');
export const routeDirOption = new Option('-rd, --routedir <path>', 'directory where will be created the route file');
export const routeOption = new Option('-r, --route <name>', 'name of the route');
export const methodOption = new Option('-m, --method [name]', 'get, post, put, delete');