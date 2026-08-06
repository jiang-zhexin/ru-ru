<script lang="ts">
    import {
        createPaginatedRowModel,
        createTable,
        FlexRender,
        rowPaginationFeature,
        columnFilteringFeature,
        globalFilteringFeature,
        createFilteredRowModel,
        filterFn_includesString,
        tableFeatures,
    } from "@tanstack/svelte-table";
    import type { ColumnDef } from "@tanstack/svelte-table";
    import type { RawDomain } from "@/types/geosite.ts";

    let { results }: { results: RawDomain } = $props();

    const features = tableFeatures({
        rowPaginationFeature,
        paginatedRowModel: createPaginatedRowModel(),
        columnFilteringFeature,
        globalFilteringFeature,
        filteredRowModel: createFilteredRowModel(),
        filterFns: { includesString: filterFn_includesString },
    });

    const columns: Array<ColumnDef<typeof features, RawDomain[number]>> = [
        {
            accessorFn: (row) => row.format,
            header: "类型 (type)",
            cell: (info) => info.getValue(),
        },
        {
            accessorFn: (row) => row.domain,
            header: "域名 (domain)",
            cell: (info) => info.getValue(),
        },
    ];

    const table = createTable({
        features,
        columns,
        get data() {
            return results;
        },
    });
    const pagination = $derived(table.atoms.pagination.get());
    table.setPageSize(15);
</script>

{#if results.length === 0}
    <p class="text-sm">No rules match the current filters.</p>
{:else}
    <div
        class="h-160"
        onwheel={(e) => {
            e.preventDefault();
            if (e.deltaY > 0 && table.getCanNextPage()) table.nextPage();
            else if (e.deltaY < 0 && table.getCanPreviousPage())
                table.previousPage();
        }}
    >
        <table class="border-l-2 w-full">
            <thead class="text-left bg-muted">
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <tr>
                        {#each headerGroup.headers as header (header.id)}
                            <th class="px-3 py-2 w-1/2">
                                {#if !header.isPlaceholder}
                                    <FlexRender {header} />
                                {/if}
                            </th>
                        {/each}
                    </tr>
                {/each}
            </thead>
            <tbody>
                {#each table.getRowModel().rows as row (row.id)}
                    <tr>
                        {#each row.getAllCells() as cell (cell.id)}
                            <td class="px-3 py-2">
                                <FlexRender {cell} />
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="border-l-2 px-2 flex">
        <input
            class="outline-none border-b placeholder:text-foreground"
            type="text"
            value={table.atoms.globalFilter.get() ?? ""}
            oninput={(e) =>
                table.setGlobalFilter((e.target as HTMLInputElement).value)}
            placeholder="Filter Domain..."
        />

        <input
            type="number"
            class="outline-none border-b ml-auto"
            min="1"
            max={table.getPageCount()}
            value={pagination.pageIndex + 1}
            oninput={(e: Event) => {
                const page = (e.target as HTMLInputElement).value
                    ? Number((e.target as HTMLInputElement).value) - 1
                    : 0;
                table.setPageIndex(page);
            }}
        />/ {table.getPageCount().toLocaleString()}
    </div>
{/if}
