import { createRequire } from 'module'
import path from 'path'
import { pathToFileURL } from 'url'
export default async () => {
    const directory = path.dirname(createRequire(import.meta.url).resolve('core'))
    const { default: fixtures } = await import(pathToFileURL(path.join(directory, 'testing/data/visibility/visibilityEnvironmentProvider.js')).href)
    const { parseId } = await import(pathToFileURL(path.join(directory, 'data/write/id.js')).href)
    const fixture = await fixtures()
    const result = {
        ...fixture,
        clientError: code => {
            const e = new Error(code)
            e.code = code
            throw e
        },
        parseId
    }
    return result
}
