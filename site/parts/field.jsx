export default ({
    error,
    inputProps,
    label,
    placeholder,
}) => <div class='field'>
    <label
        class='label'
        for={inputProps?.id}
    >
        {label}
    </label>
    <input
        {...inputProps}
        aria-describedby={error ? `${inputProps?.id}Error` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        class='control'
        placeholder={placeholder}
    />
    {
        error && <span
            class='validationMessage'
            id={`${inputProps?.id}Error`}
            role='alert'
        >
            {error}
        </span>
    }
</div>
