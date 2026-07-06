<script lang="ts">
    import ThemeSelect from "./ThemeSelect.svelte";
</script>

<header class="flex items-center justify-between flex-row border-b pb-1">
    <a href="/" class="py-1 text-xl font-semibold"> るーる </a>
    <div class="flex gap-10">
        <a href="/geosite" class="font-bold hover:underline"> Geosite </a>
        <a href="/geoip" class="font-bold hover:underline"> Geoip </a>
    </div>
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
