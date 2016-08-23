import test from 'ava'

import childProc from 'child_process'
import fs from 'fs'
import path from 'path'

// minimally test the cli
test.cb('validate the atom json grammar file', t => {
  const proc = childProc.execFile(process.execPath, [
    path.join(__dirname, '../bin/seaworthy.js'),
    path.join(__dirname, 'specs/json.cson')
  ], function (err, stdout) {
    t.ifError(err, 'child process had an error');
    t.regex(stdout, /^this ship be ready to sail/i);
    t.end()
  });
})
