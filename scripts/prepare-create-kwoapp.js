/**
 * 将当前项目（排除无关文件）复制到 create-kwoapp/templates/default，供 npm 包发布使用。
 * 在仓库根目录执行：node scripts/prepare-create-kwoapp.js
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const templateDir = path.join(root, 'create-kwoapp', 'templates', 'default')

const SKIP_DIRS = new Set(['node_modules', 'dist', 'dist-ssr', '.git', 'create-kwoapp', 'scripts'])
const SKIP_FILES = new Set(['package-lock.json', '.env', '.env.local', '.env.*.local'])
const SKIP_PATTERNS = [/\.timestamp.*$/, /\.mjs$/]

function shouldSkip(name, fullPath) {
  if (SKIP_DIRS.has(name)) return true
  if (name === 'create-kwoapp' && fullPath.includes('create-kwoapp')) return true
  if (SKIP_FILES.has(name)) return true
  if (SKIP_PATTERNS.some((p) => p.test(name))) return true
  if (name.startsWith('.env') && name !== '.env.example') return true
  return false
}

function copyRecur(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    if (shouldSkip(path.basename(src), src)) return
    fs.mkdirSync(dest, { recursive: true })
    for (const name of fs.readdirSync(src)) {
      const s = path.join(src, name)
      const d = path.join(dest, name)
      if (path.relative(root, s).startsWith('create-kwoapp')) continue
      if (path.relative(root, s).startsWith('scripts')) continue
      copyRecur(s, d)
    }
  } else {
    if (shouldSkip(path.basename(src), src)) return
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
  }
}

if (!fs.existsSync(path.join(root, 'create-kwoapp'))) {
  console.error('create-kwoapp directory not found')
  process.exit(1)
}

const templatesDir = path.join(root, 'create-kwoapp', 'templates')
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true })
if (fs.existsSync(templateDir)) fs.rmSync(templateDir, { recursive: true })
fs.mkdirSync(templateDir, { recursive: true })

const entries = fs.readdirSync(root, { withFileTypes: true })
for (const e of entries) {
  const src = path.join(root, e.name)
  const dest = path.join(templateDir, e.name)
  if (e.name === 'create-kwoapp' || e.name === 'scripts') continue
  if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue
  copyRecur(src, dest)
}

const templatePkgPath = path.join(templateDir, 'package.json')
if (fs.existsSync(templatePkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(templatePkgPath, 'utf8'))
  const repoOnlyScripts = ['prepare:create-kwoapp', 'publish:create-kwoapp']
  if (pkg.scripts) {
    repoOnlyScripts.forEach((key) => delete pkg.scripts[key])
    fs.writeFileSync(templatePkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }
}

console.log('Template prepared at create-kwoapp/templates/default')
