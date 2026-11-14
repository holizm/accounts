import { loadGlobalModifiers } from 'core'

export default async user => {
    const augmenters = await loadGlobalModifiers('userSyncAugmenter')
    for (const augmenter of augmenters) await augmenter.method({ user })
}
