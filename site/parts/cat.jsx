import { component$ } from "@builder.io/qwik"
import { merge } from "core"

export default component$(({
    class: internalClass,
    hasClickHandler,
    large,
    link,
    text,
    reverse,
    progress,
    ...rest
}) => {
    const buttonStyle = merge(
        "flex items-center justify-center gap-4 bg-custom-color1 w-full mt-10 py-3 rounded-xl text-custom-color21 disabled:bg-slate-400 disabled:text-slate-800 transition-all hover:scale-110 hover:text-black transition-all duration-300 group",
        large ? "text-lg px-5 py-3" : "",
        reverse ? " bg-custom-color1 text-custom-color21 " : "",
        progress ? " bg-slate-100 text-slate-300 hover:bg-slate-100 hover:text-slate-300 cursor-disabled select-none " : "",
        internalClass
    )

    return <>
        {
            progress
                ?
                <div
                    class={buttonStyle}
                >
                    <span>{text}</span>
                </div>
                :
                hasClickHandler
                    ?
                    <button
                        class={buttonStyle}
                        {...rest}
                    >
                        <p>{text}</p>
                    </button>
                    :
                    <a
                        href={link}
                        class={buttonStyle}
                        aria-label={text}
                    >
                        <p>{text}</p>
                    </a>
        }

    </>
})
