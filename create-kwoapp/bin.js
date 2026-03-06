#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import prompts from 'prompts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = path.join(__dirname, 'templates')

const TEMPLATES = [
  { value: 'default', title: 'default', description: '完整版：React + antd-mobile + 登录鉴权 + Mock + 主题' },
  { value: 'minimal', title: 'minimal', description: '极简版：仅 Vite + React + 路由' },
]

function getAvailableTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return []
  return fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((d) => d.name)
    .filter((name) => TEMPLATES.some((t) => t.value === name))
}

function parseArgs() {
  const args = process.argv.slice(2)
  let template = null
  let projectName = null
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--template' && args[i + 1]) {
      template = args[i + 1]
      i++
    } else if (!args[i].startsWith('-') && projectName == null) {
      projectName = args[i]
    }
  }
  return { template, projectName }
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

  const argv = parseArgs()
  // 一些终端/执行器（例如 npm create / npx）下 stdout.isTTY 可能为 false
  // 这里以 stdin 是否可交互作为主要判断，尽量让用户能选择模板
  const isInteractive = process.stdin.isTTY === true

  let template = argv.template
  let projectName = argv.projectName

  // 非交互环境（无 TTY）无法让用户“选择模板”，此时要求显式传参，避免静默默认导致误用
  if (!isInteractive) {
    if (template == null) {
      console.error('Error: non-interactive environment detected, please specify template explicitly.')
      console.error(`Available templates: ${available.join(', ')}`)
      console.error('Tip: npm create kwoapp my-app -- --template minimal')
      console.error('Tip: npx create-kwoapp my-app --template minimal')
      process.exit(1)
    }
    if (projectName == null || projectName === '') projectName = 'kwoapp'
  }

  if (isInteractive && (template == null || projectName == null)) {
    const choices = TEMPLATES.filter((t) => available.includes(t.value)).map((t) => ({
      title: `${t.title} - ${t.description}`,
      value: t.value,
    }))
    try {
      const response = await prompts([
        template == null
          ? { type: 'select', name: 'template', message: '请选择模板', choices, initial: 0 }
          : null,
        projectName == null
          ? {
            type: 'text',
            name: 'projectName',
            message: '项目目录名',
            initial: 'kwoapp',
            validate: (v) =>
              v && /^[A-Za-z0-9_-]+$/.test(v.trim())
                ? true
                : '请输入合法目录名（字母、数字、横线、下划线）',
          }
          : null,
      ].filter(Boolean))
      if (response.template != null) template = response.template
      if (response.projectName != null) projectName = response.projectName
    } catch (e) {
      console.error('Error: interactive prompt failed. Please specify template explicitly.')
      console.error(`Available templates: ${available.join(', ')}`)
      console.error('Tip: npm create kwoapp my-app -- --template minimal')
      process.exit(1)
    }
  }

  if (template == null) template = available[0]
  if (projectName == null || projectName === '') projectName = 'kwoapp'
  projectName = projectName.trim()

  if (!available.includes(template)) {
    console.error(`Error: Template "${template}" not found. Available: ${available.join(', ')}`)
    process.exit(1)
  }

  const targetDir = path.resolve(process.cwd(), projectName)
  const templateDir = path.join(TEMPLATES_DIR, template)

  if (fs.existsSync(targetDir)) {
    const list = fs.readdirSync(targetDir)
    if (list.length > 0) {
      console.error(`Error: directory "${projectName}" already exists and is not empty.`)
      console.error('Tip: Specify another name, e.g. npm create kwoapp my-app')
      process.exit(1)
    }
  }

  console.log(`Creating project in ${targetDir} with template "${template}"...`)
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
