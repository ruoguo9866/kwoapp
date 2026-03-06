#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import prompts from 'prompts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = path.join(__dirname, 'templates')

const TEMPLATES = [
  {
    value: 'default',
    title: 'default',
    description: '完整版：React + antd-mobile + 登录鉴权 + Mock + 主题',
  },
  {
    value: 'minimal',
    title: 'minimal',
    description: '极简版：仅 Vite + React + 路由',
  },
]

function getAvailableTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return []
  return fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((d) => d.name)
    .filter((name) => TEMPLATES.some((t) => t.value === name))
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

async function main() {
  const available = getAvailableTemplates()
  if (available.length === 0) {
    console.error('Error: No templates found. Run "npm run prepare:create-kwoapp" in the repo root first.')
    process.exit(1)
  }

  const choices = TEMPLATES.filter((t) => available.includes(t.value)).map((t) => ({
    title: `${t.title} - ${t.description}`,
    value: t.value,
  }))

  const response = await prompts([
    {
      type: 'select',
      name: 'template',
      message: '请选择模板',
      choices,
      initial: 0,
    },
    {
      type: 'text',
      name: 'projectName',
      message: '项目目录名',
      initial: 'kwoapp',
      validate: (v) => (v && /^[\w-]+$/.test(v) ? true : '请输入合法目录名（字母、数字、横线、下划线）'),
    },
  ])

  if (response.template == null || response.projectName == null) {
    process.exit(0)
  }

  const projectName = response.projectName.trim() || 'kwoapp'
  const targetDir = path.resolve(process.cwd(), projectName)
  const templateDir = path.join(TEMPLATES_DIR, response.template)

  if (!fs.existsSync(templateDir)) {
    console.error(`Error: Template "${response.template}" not found.`)
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    const list = fs.readdirSync(targetDir)
    if (list.length > 0) {
      console.error(`Error: directory "${projectName}" already exists and is not empty.`)
      process.exit(1)
    }
  }

  console.log(`Creating project in ${targetDir} with template "${response.template}"...`)
  fs.mkdirSync(targetDir, { recursive: true })
  copyDirSync(templateDir, targetDir, (name) => name === 'node_modules' || name === '.git')

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
