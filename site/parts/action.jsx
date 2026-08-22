export default ({
    disabled,
    href,
    progress,
    text,
    ...rest
}) => href
    ?
    <a
        aria-label={text}
        class='action'
        href={href}
        {...rest}
    >
        {text}
    </a>
    :
    <button
        aria-busy={
            progress
                ?
                'true'
                :
                'false'
        }
        class='action'
        disabled={disabled || progress}
        type='button'
        {...rest}
    >
        {text}
    </button>
