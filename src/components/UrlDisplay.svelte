<script lang="ts">
    let { url, name }: { url: string; name: string } = $props();

    let copiedURL = $state(false);
    let copiedConfig = $state(false);

    let config = $derived(
        JSON.stringify({ type: "remote", tag: name, url }, null, 2),
    );
</script>

<div class="flex flex-col gap-1 border-l-2">
    <div class="min-h-8 flex gap-0.5 text-xs">
        <p class="ml-2 self-center text-sm">在 sing-box 中使用：</p>
        <div class="ml-auto flex gap-1">
            <button
                onclick={() => {
                    navigator.clipboard.writeText(url);
                    copiedURL = true;
                    setTimeout(() => (copiedURL = false), 2000);
                }}
                class="min-w-25 px-3 py-1.5 cursor-pointer bg-accent transition-colors duration-150"
            >
                {copiedURL ? "已复制！" : "仅复制 URL"}
            </button>

            <button
                onclick={() => {
                    navigator.clipboard.writeText(config);
                    copiedConfig = true;
                    setTimeout(() => (copiedConfig = false), 2000);
                }}
                class="min-w-18 px-3 py-1.5 cursor-pointer bg-accent transition-colors duration-150"
            >
                {copiedConfig ? "已复制！" : "复制"}
            </button>
        </div>
    </div>

    <div class="overflow-hidden flex items-stretch w-full">
        <pre
            class="scrollbar-thumb-muted-foreground min-w-0 flex-1 overflow-x-auto font-mono text-xs px-3 py-2 bg-transparent text-muted-foreground">{config}</pre>
    </div>
</div>
