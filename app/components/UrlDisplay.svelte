<script lang="ts">
    let { url, name }: { url: string; name: string } = $props();

    let copiedURL = $state(false);
    let copiedConfig = $state(false);

    let config = $derived(
        JSON.stringify({ type: "remote", tag: name, url }, null, 2),
    );
</script>

<div class="flex flex-col gap-1">
    <div class="flex gap-0.5 text-xs">
        <p class="text-sm">在 sing-box 中使用：</p>
        <div class="ml-auto flex gap-1">
            <button
                onclick={() => {
                    navigator.clipboard.writeText(url);
                    copiedURL = true;
                    setTimeout(() => (copiedURL = false), 2000);
                }}
                class="min-w-25 rounded px-3 py-1.5 cursor-pointer bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 transition-colors duration-150"
            >
                {copiedURL ? "已复制！" : "仅复制 URL"}
            </button>

            <button
                onclick={() => {
                    navigator.clipboard.writeText(config);
                    copiedConfig = true;
                    setTimeout(() => (copiedConfig = false), 2000);
                }}
                class="min-w-18 rounded px-3 py-1.5 cursor-pointer bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 transition-colors duration-150"
            >
                {copiedConfig ? "已复制！" : "复制"}
            </button>
        </div>
    </div>

    <div
        class="overflow-hidden shadow-sm flex items-stretch w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
    >
        <pre
            class="dark:scrollbar-thumb-slate-700 min-w-0 flex-1 overflow-x-auto font-mono text-xs px-3 py-2 bg-transparent text-gray-600 dark:text-gray-300">{config}</pre>
    </div>
</div>
