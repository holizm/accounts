import {
    component$,
    Slot,
} from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import {
    checkLogin,
    loadDashboard,
    SignOut,
} from 'accounts'
import { Menu } from 'dashboard'

export const onRequest = event => {
    checkLogin(event)
}

export default component$(({ }) => {

    const data = loadDashboard().value
    const { translations } = data
    const { url } = useLocation()

    return <div class='min-h-[50vh] p-4'>
        <div class='flex flex-col sm:flex-row max-w-6xl mx-auto bg--100 rounded-md my-10 sm:p-2'>
            <div class='sm:w-[30%] flex flex-col sm:flex-none p-2 gap-y-2'>
                {
                    Menu?.map((item, index) => {
                        return <button
                            class={`p-2 block rounded-md ${url.pathname.includes(item.path) ? 'bg-custom-color1 text-white' : 'bg-gray-200 hover:bg-custom-color1/40 duration-300'}`}
                            key={index + 1}
                            onClick$={() => {
                                window.location.href = `/dashboard${item.path}`
                            }}
                        >
                            {translations[item.title]}
                        </button>
                    })
                }
                <SignOut>
                    <button class='p-2 block rounded-md text-white bg-red-600 hover:bg-red-400 duration-300 w-full cursor-pointer mt-10'>
                        {translations.accountsSignOut}
                    </button>
                </SignOut>
            </div>
            <div class='flex-1 p-2 overflow-x-auto max-h-[50vh] overflow-h-auto'>
                <Slot />
            </div>
        </div>
    </div>
})


export { loadDashboard }
