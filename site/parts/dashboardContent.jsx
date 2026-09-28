import {
    Slot,
    component$,
} from '@builder.io/qwik'

export default component$(() => <section class='content'>
    <Slot />
</section>)
