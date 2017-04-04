/**
 * Created by JParreir on 05-10-2015.
 */
/* global afterEach, beforeEach, describe, it, after, before, process */

"use strict";

const nodePath = require("path");
const nodeOs = require("os");
const rimraf = require("rimraf");
const enFs = require("enfspatch-promise");
const mkdirp = require("../");
//const mkdirpUtil = require("../lib/util");
const cwd = process.cwd();


describe("enfsmkdirp-promise async", function () {
    const invalidWindowsDrive = "AB:\\";
    const tmpPath = nodePath.join(nodeOs.tmpdir(), "enfsmkdirpasyncpromise");
    const _0777 = parseInt("0777", 8);
    const _0755 = parseInt("0755", 8);
    const _0744 = parseInt("0744", 8);
    const isWindows = /^win/.test(process.platform);
    before(function () {
        if (!enFs.existAccessSync(tmpPath)) {
            enFs.mkdirSync(tmpPath);
        }
        process.chdir(tmpPath);
    });
    afterEach(function (done) {
        rimraf(tmpPath + nodePath.sep + "*", done);
    });
    after(function (done) {
        process.chdir(cwd);
        rimraf(tmpPath, done);
    });

    it("should test mkdirp", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));
        return mkdirp.mkdirpP(file, _0755).then(function () {
            return enFs.statP(file).then(function (stat) {
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
            });
        });
    });
    it("should test chmod", function () {
        const ps = [tmpPath];
        for (let i = 0; i < 25; i++) {
            ps.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
        }
        const file = ps.join(nodePath.sep);
        return mkdirp.mkdirpP(file, _0744).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.be.equal(_0744);
            }
            return mkdirp.mkdirpP(file, _0755);
        }).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.not.be.equal(_0755);
                (stat.mode & _0777).should.be.equal(_0744);
            }
        });
    });
    it("should test overwrite", function () {
        const ps = [tmpPath];
        for (let i = 0; i < 2; i++) {
            ps.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
        }
        const file = ps.join(nodePath.sep);
        //a file in the way
        const itw = ps.slice(0, 2).join(nodePath.sep);
        return enFs.writeFileP(itw, "I am in the way").then(function () {
            return enFs.statP(itw);
        }).then(function (stat) {
            stat.isFile().should.be.equal(true);
            return mkdirp.mkdirpP(file, _0755);
        }).catch(function (err) {
            err.should.be.instanceOf(Error);
            //using mkdir(2) will throw an EEXIST even if there's a file in the way instead of throwing ENOTDIR
            err.code.should.be.equalOneOf("ENOTDIR", "EEXIST");
        });
    });

    it("should test permissions", function () {
        const file = nodePath.join(tmpPath, (Math.random() * (1 << 30)).toString(16));

        return mkdirp.mkdirpP(file, _0755).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.be.equal(_0755);
            }
        });
    });
    it("should test root permissions", function () {
        return mkdirp.mkdirpP(tmpPath, _0755).should.be.fulfilled();
    });
    it("should test race", function () {
        const testsNumber = 10;
        const ps = [tmpPath];

        for (let i = 0; i < 25; i++) {
            ps.push(Math.floor(Math.random() * Math.pow(16, 4)).toString(16));
        }
        const file = ps.join(nodePath.sep);
        let pros = [];

        function makeFile(file) {
            return mkdirp.mkdirpP(file, _0755).then(function () {
                return enFs.statP(file);
            }).then(function (stat) {
                stat.isDirectory().should.be.equal(true);
                if (!isWindows) {
                    (stat.mode & _0777).should.be.equal(_0755);
                }
            });
        }

        for (let i = 0; i < testsNumber; i++) {
            pros.push(makeFile(file));
        }
        return Promise.all(pros).should.be.fulfilled();
    });
    it("should test relative path", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        const file = [x, y, z].join(nodePath.sep);

        return mkdirp.mkdirpP(file, _0755).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.be.equal(_0755);
            }
        });
    });
    it("should test relative path 2", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        const file = nodePath.join("..", "tmp", [x, y, z].join(nodePath.sep));

        return mkdirp.mkdirpP(file, _0755).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.be.equal(_0755);
            }
        });
    });
    it("should test relative path 3", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        const file = nodePath.join(".", [x, y, z].join(nodePath.sep));

        return mkdirp.mkdirpP(file, _0755).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.be.equal(_0755);
            }
        });
    });
    it("should test return value", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        const file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        // should always return the full path created.
        //on second test it won't recreate the folder but will return the path
        return mkdirp.mkdirpP(file).then(function (made) {
            made.should.be.equal(nodePath.join(tmpPath, x, y, z));
            return mkdirp.mkdirpP(file);
        }).then(function (made2) {
            made2.should.be.equal(file);
        });
    });
    it("should test root", function () {
        const file = nodePath.resolve(nodePath.sep);
        // '/' on unix, 'c:/' on windows.

        return mkdirp.mkdirpP(file, _0755).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
        });
    });
    it("should test implicit mode from umask", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        const file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep));

        return mkdirp.mkdirpP(file).then(function () {
            return enFs.statP(file);
        }).then(function (stat) {
            stat.isDirectory().should.be.equal(true);
            if (!isWindows) {
                (stat.mode & _0777).should.be.equal(_0777);
            }
        });
    });
    it("should test null byte filename", function () {
        const nullChar = "\0";

        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        const file = nodePath.join(tmpPath, [x, y, z].join(nodePath.sep), nullChar);

        return mkdirp.mkdirpP(file).catch(function (err) {
            err.should.instanceof(Error);
            if (err.code) {
                err.code.should.be.equal("ENOENT");
            }
            err.message.should.containEql("string without null bytes");
        });
    });
    it("should test curly braces async", function () {
        const file = `${nodePath.resolve(tmpPath)}/{production,dev}/{css,img,js}`;
        const paths = require("brace-expansion")(file).map(function (path) {
            return nodePath.resolve(path);
        });
        return mkdirp.mkdirpP(file).then(function () {
            let pros = [];
            paths.forEach((path) => enFs.statP(path).then((stat) => stat.isDirectory().should.be.equal(true)));
            return Promise.all(pros);
        }).should.be.fulfilled();
    });
    it("should test invalid path drive on windows", function () {
        const file = nodePath.join(invalidWindowsDrive, "fooAsync");
        if (!isWindows) {
            return;
        }
        return mkdirp.mkdirpP(file).catch(function (err) {
            (err === null).should.be.equal(false);
            err.code.should.be.equal("EINVALID");
            err.message.should.containEql("Invalid character found in path.");
        });
    });
    it("should test invalid filename with double quote async", function () {
        const file = nodePath.join(tmpPath, `foo"bar`);

        return mkdirp.mkdirpP(file).catch(function (err) {
            if (isWindows) {
                (err === null).should.be.equal(false);
                err.message.should.containEql("Invalid character found in path");
            }
        });
    });
    it("should test Date.toISOString", function () {
        const file = nodePath.join(tmpPath, (new Date()).toISOString(), "test");
        if (!isWindows) {
            return mkdirp.mkdirpP(file).then(() => {
                return enFs.statP(file);
            }).then((stat) => stat.isDirectory().should.be.equal(true));
        } else {
            return mkdirp.mkdirpP(file).should.be.rejected();
        }
    });
    it("should test mkdir with array of paths", function () {
        const file = [nodePath.join(tmpPath, "abc"), nodePath.join(tmpPath, "xyz")];
        return mkdirp.mkdirpP(file).then(function () {
            let pros = [];
            file.forEach((path) => pros.push(enFs.statP(path).then((stat) => stat.isDirectory().should.be.equal(true))));
            return Promise.all(pros);
        });
    });
    it("should test mkdir with array of paths and curly braces", function () {
        let paths = [];
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        let file = [`${nodePath.join(tmpPath, x)}/{production,dev}/{css,img,js}`, `${nodePath.join(tmpPath, y)}/{production,dev}/{css,img,js}`];
        file.forEach(function (p) {
            paths = paths.concat(require("brace-expansion")(p));
        });
        return mkdirp.mkdirpP(file).then(function () {
            let pros = [];
            paths.forEach((path) => pros.push(enFs.statP(path).then((stat) => stat.isDirectory().should.be.equal(true))));
            return Promise.all(pros);
        });
    });
    it("should test mkdir with a file of the same name", function () {
        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const file = nodePath.join(tmpPath, x, "file.json");
        return enFs.mkdirP(nodePath.dirname(file)).then(function () {
            return enFs.writeFileP(file, "Data inside file");
        }).then(function () {
            return mkdirp.mkdirp(file);
        }).catch(function (err) {
            err.should.be.instanceOf(Error);
            err.code.should.be.equal("EEXIST");
        });
    });
});
