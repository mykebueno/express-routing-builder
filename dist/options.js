"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramOption = exports.methodOption = exports.routeOption = exports.routeDirOption = exports.mainFileOption = exports.dirOption = void 0;
const commander_1 = require("commander");
exports.dirOption = new commander_1.Option('-d, --dir <path>', 'directory path of the main file (where the route objects are imported), defaults to current working directory if not provided');
exports.mainFileOption = new commander_1.Option('-m, --main <name>', 'name of the main file (usually app.js or server.js) that handles your Express.js routes');
exports.routeDirOption = new commander_1.Option('-rd, --routedir <path>', 'directory where the new route files will be created, defaults to current working directory if not provided');
exports.routeOption = new commander_1.Option('-r, --routes [names...]', 'list of route names to create, route files will be named after these routes, separate multiple route names with spaces');
exports.methodOption = new commander_1.Option('-mt, --methods [names...]', 'list of HTTP methods that the route will handle, separate multiple methods with commas, valid methods are: get, post, put, delete');
exports.paramOption = new commander_1.Option('-p, --params [names...]', 'list of parameters that the route will handle, separate multiple parameters with spaces');
//# sourceMappingURL=options.js.map