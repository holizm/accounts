import { loadGlobalModifiers } from 'core'

export default async (user, trigger) => {
    const augmenters = await loadGlobalModifiers('userSyncAugmenter')
    for (const augmenter of augmenters) await augmenter.method({
        trigger,
        user,
    })
}
