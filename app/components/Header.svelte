<script lang="ts">
    import ThemeSelect from "./ThemeSelect.svelte";

    const { title }: { title: string } = $props();
</script>

<header class="flex items-center justify-between flex-row border-b pb-1">
    <a
        href="/"
        class="flex py-1 text-xl leading-8 font-semibold whitespace-nowrap"
    >
        {title}
    </a>
    <div class="flex items-center space-x-4">
        <a
            href="https://github.com/jiang-zhexin/ru-ru"
            class="underline text-m font-semibold"
            target="_blank"
        >
            GitHub
        </a>
        <ThemeSelect />
    </div>
</header>
