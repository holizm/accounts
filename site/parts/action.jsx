export default ({
    disabled,
    hasClickHandler,
    href,
    link,
    progress,
    text,
    ...rest
}) => (href || link) && !hasClickHandler
    ?
    <a
        aria-label={text}
        class='action'
        href={href || link}
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
