<script lang="ts">
    import type { RawDomain } from "@/types/geosite.ts";
    import {
        createTable,
        Render,
        Subscribe,
    } from "@humanspeak/svelte-headless-table";
    import { addVirtualScroll } from "@humanspeak/svelte-headless-table/plugins";
    import { writable } from "svelte/store";

    let { results }: { results: RawDomain } = $props();

    // svelte-ignore state_referenced_locally
    const table = createTable(writable(results), {
        virtualScroll: addVirtualScroll({
            estimatedRowHeight: 48,
            bufferSize: 10,
        }),
    });
    const columns = table.createColumns([
        table.column({ header: "类型 (type)", accessor: "format" }),
        table.column({ header: "域名 (domain)", accessor: "domain" }),
    ]);

    const {
        headerRows,
        pageRows,
        tableAttrs,
        tableBodyAttrs,
        pluginStates,
        visibleColumns,
    } = table.createViewModel(columns);

    const {
        virtualScroll,
        topSpacerHeight,
        bottomSpacerHeight,
        measureRowAction,
    } = pluginStates.virtualScroll;
</script>

{#if results.length === 0}
    <p class="text-sm">No rules match the current filters.</p>
{:else}
    <div
        class="overflow-y-auto max-h-180 dark:scrollbar-thumb-slate-700 rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 content-visibility-auto [contain-intrinsic-size:0_500px]"
        use:virtualScroll
    >
        <table
            class="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700"
            {...$tableAttrs}
        >
            <thead
                class="ltr:text-left rtl:text-right sticky top-0 dark:bg-gray-800 bg-white"
            >
                {#each $headerRows as headerRow (headerRow.id)}
                    <tr class="*:font-medium *:text-gray-900 dark:*:text-white">
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <th class="px-3 py-2">
                                    <Render of={cell.render()} /></th
                                >
                            </Subscribe>
                        {/each}
                    </tr>
                {/each}
            </thead>
            <tbody
                class="divide-y divide-gray-200 dark:divide-gray-700"
                {...$tableBodyAttrs}
            >
                {#if $topSpacerHeight > 0}
                    <tr>
                        <td
                            colspan={$visibleColumns.length}
                            style="height: {$topSpacerHeight}px; padding: 0; border: none;"
                        ></td>
                    </tr>
                {/if}

                {#each $pageRows as row (row.id)}
                    <Subscribe attrs={row.attrs()} let:attrs>
                        <tr
                            class="*:text-gray-900 *:first:font-medium dark:*:text-white"
                            use:measureRowAction={row.id}
                        >
                            {#each row.cells as cell (cell.id)}
                                <Subscribe attrs={cell.attrs()} let:attrs>
                                    <td class="px-3 py-2">
                                        <Render of={cell.render()} />
                                    </td>
                                </Subscribe>
                            {/each}
                        </tr>
                    </Subscribe>
                {/each}

                {#if $bottomSpacerHeight > 0}
                    <tr>
                        <td
                            colspan={$visibleColumns.length}
                            style="height: {$bottomSpacerHeight}px; padding: 0; border: none;"
                        ></td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
{/if}
