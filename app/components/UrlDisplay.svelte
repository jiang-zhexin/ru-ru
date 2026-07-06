<script lang="ts">
    let { url, name }: { url: string; name: string } = $props();

    let copied = $state(false);

    let data = $derived(
        JSON.stringify({ type: "remote", tag: name, url }, null, 2),
    );

    function copy() {
        navigator.clipboard.writeText(url);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 2000);
    }
</script>

<div
    class="overflow-hidden shadow-sm flex items-stretch w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
>
    <pre
        class="w-full font-mono text-xs px-3 py-2 bg-transparent text-gray-600 dark:text-gray-300">{data}</pre>
    <button
        onclick={copy}
        class="cursor-pointer shrink-0 font-medium px-4 py-2 bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 transition-colors duration-150"
    >
        {copied ? "Copied!" : "Copy"}
    </button>
</div>
