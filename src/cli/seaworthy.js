
import path from 'path';

import firstMate from 'first-mate';
import onigumura from 'oniguruma';

export function run(argv) {
  const registry = new firstMate.GrammarRegistry();

  const grammar = registry.loadGrammarSync(path.resolve(argv[0]));

  let errored = false;

  for (const pattern of grammar.rawPatterns) {
    try {
      new onigumura.OnigRegExp(pattern.match); // eslint-disable-line no-new
    } catch (e) {
      errored = true;
      // TODO: CSON line numbers
      console.log(`\n${pattern.name}${pattern.comment ? ` (${pattern.comment})` : ''}: ${pattern.match}`);
      console.log(e.message);
    }
  }

  console.log(errored ? '\nSwab the poop deck!' : 'This ship be ready to sail!');
}
