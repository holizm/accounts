import assert from 'assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import test from 'node:test'
import { fileURLToPath } from 'url'
import getSitePartAliases from '../../../core/commands/site/getSitePartAliases.js'

test('accountsPersonDashboardLayout resolves through part composition', t => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'siteOwnership'))
    t.after(() => fs.rmSync(directory, {
        force: true,
        recursive: true,
    }))
    const source = fileURLToPath(new URL('./personDashboardLayout.jsx', import.meta.url))
    const parts = path.join(directory, 'parts', 'accounts')
    const barrels = path.join(directory, 'partBarrels', 'accounts')
    fs.mkdirSync(parts, { recursive: true })
    fs.mkdirSync(barrels, { recursive: true })
    fs.symlinkSync(path.dirname(source), path.join(parts, 'parts'))
    const aliases = getSitePartAliases(directory)
    assert.equal(aliases.accountsPersonDashboardLayout, './src/partBarrels/accounts/personDashboardLayout')
    const barrel = fs.readFileSync(path.join(barrels, 'personDashboardLayout.jsx'), 'utf8')
    const specifier = barrel.match(/from '([^']+)'/)[1]
    assert.equal(fs.realpathSync(path.resolve(barrels, specifier)), source)
})
