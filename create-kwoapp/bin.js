#!/usr/bin/env node

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TEMPLATE_DIR = path.join(__dirname, 'template')

function getProjectName() {
  const arg = process.argv[2]
  if (arg && !arg.startsWith('-')) return arg
  return process.argv.includes('--cwd') ? path.basename(process.cwd()) : 'kwoapp'
}

function copyDirSync(src, dest, skip = () => false) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    if (skip(name)) continue
    const s = path.join(src, name)
    const d = path.join(dest, name)
    const stat = fs.statSync(s)
    if (stat.isDirectory()) {
      copyDirSync(s, d, skip)
    } else {
      fs.copyFileSync(s, d)
    }
  }
}

function main() {
  const projectName = getProjectName()
  const targetDir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(targetDir)) {
    const list = fs.readdirSync(targetDir)
    if (list.length > 0) {
      console.error(`Error: directory "${projectName}" already exists and is not empty.`)
      process.exit(1)
    }
  }

  console.log(`Creating project in ${targetDir}...`)
  fs.mkdirSync(targetDir, { recursive: true })
  copyDirSync(TEMPLATE_DIR, targetDir, (name) => name === 'node_modules' || name === '.git')

  const pkgPath = path.join(targetDir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    pkg.name = projectName
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }

  console.log('Installing dependencies...')
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npm, ['install'], {
    cwd: targetDir,
    stdio: 'inherit',
    shell: true,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)

  console.log(`\nDone. Run:\n  cd ${projectName}\n  npm run dev\n`)
}

main()
