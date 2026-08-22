import { component$ } from '@builder.io/qwik'
import { Action } from 'accounts'

export default component$(({
    class: internalClass,
    hasClickHandler,
    link,
    text,
    progress,
    ...rest
}) => {
    return <Action
        {...rest}
        class={internalClass}
        disabled={rest.disabled}
        href={
            hasClickHandler
                ?
                undefined
                :
                link
        }
        progress={progress}
        text={text}
    />
})
