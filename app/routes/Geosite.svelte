<script lang="ts">
    import type { RawDomain } from "@/types/geosite.ts";
    import FilterForm from "../components/FilterForm.svelte";
    import PreviewTable from "../components/PreviewTable.svelte";
    import UrlDisplay from "../components/UrlDisplay.svelte";
    import {
        DEFAULT_PARAMS,
        filterParams,
        type Params,
    } from "../lib/params.ts";
    import { loadState } from "../lib/storage.ts";
    import { client, defaultUrl } from "../lib/client.ts";

    const geositeState = "geosite";
    let { paramarray, cursor } = $state(
        loadState(geositeState, {
            paramarray: [structuredClone(DEFAULT_PARAMS)],
            cursor: 0,
        }),
    );
    $effect(() =>
        localStorage.setItem(
            geositeState,
            JSON.stringify({ paramarray, cursor }),
        ),
    );

    let params = $derived(paramarray[cursor]!);

    let url = $derived.by(() => {
        if (params.t.length === 0) return defaultUrl;

        switch (params.format) {
            case "json":
                return client[":filename{.+\\.json}"].$url({
                    query: filterParams(params),
                    param: {
                        filename: `${encodeURIComponent(params.name)}.json`,
                    },
                });
            case "srs":
                return client[":filename{.+\\.srs}"].$url({
                    query: filterParams(params),
                    param: {
                        filename: `${encodeURIComponent(params.name)}.srs`,
                    },
                });
        }

        return defaultUrl;
    });

    let resultPromise = $derived.by(async (): Promise<RawDomain | null> => {
        if (params.t.length === 0) return null;
        const resp = await client.index.$get({ query: filterParams(params) });
        if (!resp.ok)
            throw new Error(
                `Bad Response (${resp.status}): ${await resp.text()}`,
            );
        return resp.json();
    });
</script>

<div class="flex flex-col lg:flex-row gap-4 flex-1">
    <aside class="lg:w-85 shrink-0">
        <FilterForm bind:paramarray bind:cursor bind:params />
    </aside>

    <main class="flex-1 min-w-0 place-items-center">
        {#await resultPromise}
            <p>加载中，请等待...</p>
        {:then results}
            {#if !results}
                <p>至少选择一个标签 (tags)！</p>
            {:else}
                <div class="w-full flex flex-col gap-2">
                    <p class="text-sm">在 sing-box 中使用：</p>
                    <UrlDisplay url={url.toString()} name={params.name} />
                    <PreviewTable {results} />
                </div>
            {/if}
        {:catch err}
            <p class="text-red-600">{err}</p>
        {/await}
    </main>
</div>
