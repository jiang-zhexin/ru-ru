<script lang="ts">
    import type { RawDomain } from "@/types/geosite.ts";

    let { results }: { results: RawDomain } = $props();
</script>

{#if results.length === 0}
    <p class="text-sm">No rules match the current filters.</p>
{:else}
    <div
        class="overflow-y-auto max-h-180 dark:scrollbar-thumb-slate-700 rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 content-visibility-auto [contain-intrinsic-size:0_500px]"
    >
        <table
            class="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700"
        >
            <thead class="ltr:text-left rtl:text-right">
                <tr class="*:font-medium *:text-gray-900 dark:*:text-white">
                    <th class="px-3 py-2">#</th>
                    <th class="px-3 py-2">类型 (type)</th>
                    <th class="px-3 py-2">域名 (domain)</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each results as row, i}
                    <tr
                        class="*:text-gray-900 *:first:font-medium dark:*:text-white"
                    >
                        <td class="px-3 py-2">{i + 1}</td>
                        <td class="px-3 py-2">{row.format}</td>
                        <td class="px-3 py-2">{row.domain}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
