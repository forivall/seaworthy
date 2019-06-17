
import path from 'path';

import firstMate from 'first-mate';
import onigumura from 'oniguruma';

export function run(argv) {
  const registry = new firstMate.GrammarRegistry();

  const grammar = registry.loadGrammarSync(path.resolve(argv[0]));

  let errored = false;

  if (grammar.rawPatterns.length === 0) {
    console.log('No patterns found!')
    errored = true
  }

  function validatePatterns(patterns) {
    for (const pattern of patterns) {
      validateRegexp(pattern, 'match')
      validateRegexp(pattern, 'begin')
      validateRegexp(pattern, 'end')
      if (pattern.patterns) {
        validatePatterns(pattern.patterns)
      }
    }
  }
  function validateRegexp(pattern, key) {
    if (pattern[key] == null) return
    // console.warn('validate', key, pattern.comment)
    try {
      new onigumura.OnigRegExp(pattern.match); // eslint-disable-line no-new
    } catch (e) {
      errored = true;
      // TODO: line numbers
      console.log(`\n${pattern.name}${pattern.comment ? ` (${pattern.comment})` : ''}: ${pattern.match}`);
      console.log(e.message);
    }
  }
  validatePatterns(grammar.rawPatterns)
  for (const r of Object.keys(grammar.rawRepository)) {
    validatePatterns(grammar.rawRepository[r].patterns)
  }

  console.log(errored ? '\nSwab the poop deck!' : 'This ship be ready to sail!');
  if (errored) process.exitCode = 1
}
