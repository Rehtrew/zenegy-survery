/**
 * Assembles the folder that gets uploaded to Kinsta.
 *
 * `npm run build` produces dist/ with relative asset paths (vite `base: './'`),
 * which is what lets the survey live in any folder under the WordPress public
 * directory. This copies the PHP endpoints in next to it, so the upload is one
 * self-contained folder:
 *
 *   dist/
 *     index.html
 *     assets/…
 *     api/submit.php, signup.php, health.php, …
 *
 * schema.sql is deliberately NOT copied — it is run once from MyKinsta's SQL
 * console and has no business being reachable over the web.
 */
import { cp, mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'kinsta', 'api')
const to = join(root, 'dist', 'api')

await mkdir(to, { recursive: true })
const files = (await readdir(from)).filter(name => name.endsWith('.php'))
for (const name of files) {
  await cp(join(from, name), join(to, name))
}

console.log(`Copied ${files.length} PHP files into dist/api/`)
console.log('dist/ is ready to upload to the survey folder on Kinsta.')
