// Lets plain Node load the site's lib/ files, which use Next.js-style
// imports: "./api" without ".js" and "@/lib/..." for the project root.
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
const ROOT = ${JSON.stringify(pathToFileURL(process.cwd() + '/').href)};
export async function resolve(spec, ctx, next) {
  let s = spec.startsWith('@/') ? ROOT + spec.slice(2) : spec;
  try { return await next(s, ctx); } catch (e) {
    if (s.startsWith('.') || s.startsWith('file:')) return next(s + '.js', ctx);
    throw e;
  }
}
`),
  import.meta.url
);
