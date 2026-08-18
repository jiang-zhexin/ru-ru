<script lang="ts">
    import type { Format } from "@/types/geosite.ts";

    let {
        entries = $bindable(),
        types,
        name,
    }: {
        entries: string[];
        types?: Format;
        name: string;
    } = $props();
</script>

{#each entries as e, i (e)}
    <li class="flex items-center gap-1">
        <span class="px-2 py-0.5 whitespace-nowrap">
            {name}
        </span>

        {#if types}
            <span class="w-14 px-1">
                {types}
            </span>
        {/if}

        <span class="min-w-0 flex-1 truncate px-1">
            {e}
        </span>

        <button
            type="button"
            class="cursor-pointer bg-muted px-1"
            onclick={() => entries.splice(i, 1)}
        >
            &times;
        </button>
    </li>
{/each}
