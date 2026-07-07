<script lang="ts">
    let { url, name }: { url: string; name: string } = $props();

    let copiedURL = $state(false);
    let copiedConfig = $state(false);

    let config = $derived(
        JSON.stringify({ type: "remote", tag: name, url }, null, 2),
    );
</script>

<div
    class="overflow-hidden shadow-sm flex items-stretch w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
>
    <pre
        class="dark:scrollbar-thumb-slate-700 min-w-0 flex-1 overflow-x-auto font-mono text-xs px-3 py-2 bg-transparent text-gray-600 dark:text-gray-300">{config}</pre>

    <div class="flex flex-col min-w-22 gap-0.5 text-xs">
        <button
            onclick={() => {
                navigator.clipboard.writeText(url);
                copiedURL = true;
                setTimeout(() => (copiedURL = false), 2000);
            }}
            class="flex-1 cursor-pointer bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 transition-colors duration-150"
        >
            {copiedURL ? "Copied!" : "Copy URL"}
        </button>

        <button
            onclick={() => {
                navigator.clipboard.writeText(config);
                copiedConfig = true;
                setTimeout(() => (copiedConfig = false), 2000);
            }}
            class="flex-1 cursor-pointer bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 transition-colors duration-150"
        >
            {copiedConfig ? "Copied!" : "Copy config"}
        </button>
    </div>
</div>
