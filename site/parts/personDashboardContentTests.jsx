import assert from 'assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import test from 'node:test'
import { fileURLToPath } from 'url'
import getSitePartAliases from '../../../core/commands/site/getSitePartAliases.js'

test('accountsPersonDashboardContent resolves through part composition', t => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'siteOwnership'))
    t.after(() => fs.rmSync(directory, {
        force: true,
        recursive: true,
    }))
    const source = fileURLToPath(new URL('./personDashboardContent.jsx', import.meta.url))
    const parts = path.join(directory, 'parts', 'accounts')
    const barrels = path.join(directory, 'partBarrels', 'accounts')
    fs.mkdirSync(parts, { recursive: true })
    fs.mkdirSync(barrels, { recursive: true })
    fs.symlinkSync(path.dirname(source), path.join(parts, 'parts'))
    const aliases = getSitePartAliases(directory)
    assert.equal(aliases.accountsPersonDashboardContent, './src/partBarrels/accounts/personDashboardContent')
    const barrel = fs.readFileSync(path.join(barrels, 'personDashboardContent.jsx'), 'utf8')
    const specifier = barrel.match(/from '([^']+)'/)[1]
    assert.equal(fs.realpathSync(path.resolve(barrels, specifier)), source)
})
