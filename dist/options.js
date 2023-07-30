"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodOption = exports.routeOption = exports.routeDirOption = exports.dirOption = void 0;
const commander_1 = require("commander");
exports.dirOption = new commander_1.Option('-d, --dir <path>', 'directory of file where the router object resides');
exports.routeDirOption = new commander_1.Option('-rd, --routedir <path>', 'directory where will be created the route file');
exports.routeOption = new commander_1.Option('-r, --route <name>', 'name of the route');
exports.methodOption = new commander_1.Option('-m, --method [name]', 'get, post, put, delete');
//# sourceMappingURL=options.js.map