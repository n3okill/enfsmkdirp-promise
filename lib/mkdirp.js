/**
 * @project enfsmkdirp
 * @filename mkdirp.js
 * @description entry point for enfsmkdirp module
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

"use strict";

const enfsmkdirp = require("enfsmkdirp");

module.exports = enfsmkdirp;
module.exports.mkdirpP = function (path, opt) {
    return new Promise((resolve, reject) => {
        enfsmkdirp.mkdirp(path, opt, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
};

