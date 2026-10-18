import assert from 'assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import test from 'node:test'
import { fileURLToPath } from 'url'
import getSitePartAliases from '../../../core/commands/site/getSitePartAliases.js'

test('accountsPersonDashboardWelcome resolves through part composition', t => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'siteOwnership'))
    t.after(() => fs.rmSync(directory, {
        force: true,
        recursive: true,
    }))
    const source = fileURLToPath(new URL('./personDashboardWelcome.jsx', import.meta.url))
    const parts = path.join(directory, 'parts', 'accounts')
    const barrels = path.join(directory, 'partBarrels', 'accounts')
    fs.mkdirSync(parts, { recursive: true })
    fs.mkdirSync(barrels, { recursive: true })
    fs.symlinkSync(path.dirname(source), path.join(parts, 'parts'))
    const aliases = getSitePartAliases(directory)
    assert.equal(aliases.accountsPersonDashboardWelcome, './src/partBarrels/accounts/personDashboardWelcome')
    const barrel = fs.readFileSync(path.join(barrels, 'personDashboardWelcome.jsx'), 'utf8')
    const specifier = barrel.match(/from '([^']+)'/)[1]
    assert.equal(fs.realpathSync(path.resolve(barrels, specifier)), source)
})
