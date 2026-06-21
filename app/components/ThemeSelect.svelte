<script lang="ts">
    import IconSunHigh from "../assets/icons/IconSunHigh.svelte";
    import IconMoon from "../assets/icons/IconMoon.svelte";

    let isdark = $state(
        localStorage.theme === "dark" ||
            (localStorage.theme === undefined &&
                globalThis.matchMedia("(prefers-color-scheme: dark)").matches),
    );

    $effect(() => {
        localStorage.theme = isdark ? "dark" : "light";
        document.documentElement.classList.toggle("dark", isdark);
    });
</script>

<label
    for="AcceptConditions"
    class="relative block h-8 w-14 rounded-full bg-gray-300 [-webkit-tap-highlight-color:transparent] dark:has-checked:bg-gray-600 cursor-pointer"
>
    <input
        type="checkbox"
        id="AcceptConditions"
        class="peer sr-only"
        bind:checked={isdark}
    />

    <span
        class="absolute inset-y-0 inset-s-0 m-1 grid size-6 place-content-center rounded-full text-gray-700 transition-[inset-inline-start] peer-checked:inset-s-6 peer-checked:*:first:hidden *:last:hidden peer-checked:*:last:block dark:text-gray-200"
    >
        <IconSunHigh />
        <IconMoon />
    </span>
</label>
