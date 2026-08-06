<script lang="ts">
    import type { Format } from "@/types/geosite.ts";
    import type { Params } from "../lib/params";
    import Entry from "./Entry.svelte";

    let {
        legend,
        id,
        params = $bindable(),
        datalist,
        types,
    }: {
        legend: string;
        id: string;
        params: Params;
        datalist?: string[];
        types?: boolean;
    } = $props();

    let draftValue = $state("");
    let draftMode = $state(false);
    let draftType = $state<Format>("suffix");

    function commit() {
        const value = draftValue.trim();
        if (value === "") return;

        if (!types) {
            if (draftMode) params.et!.push(value);
            else params.t.push(value);
        } else {
            switch (draftType) {
                case "suffix":
                    if (draftMode) params.eds!.push(value);
                    else params.ds!.push(value);
                    break;
                case "full":
                    if (draftMode) params.ed!.push(value);
                    else params.d!.push(value);
                    break;
                case "keyword":
                    if (draftMode) params.edk!.push(value);
                    else params.dk!.push(value);
                    break;
                case "regexp":
                    if (draftMode) params.edr!.push(value);
                    else params.dr!.push(value);
                    break;
            }
        }
        draftValue = "";
    }

    function onKeydown(ev: KeyboardEvent) {
        if (ev.key !== "Enter" || ev.isComposing) return;
        ev.preventDefault();
        commit();
    }
</script>

<fieldset class="border-l-2 p-2">
    <legend>{legend}</legend>

    <ul class="flex flex-col gap-2 text-sm">
        <li class="flex items-center gap-1">
            <label class="cursor-pointer px-2 py-1 whitespace-nowrap bg-muted">
                <input
                    type="checkbox"
                    bind:checked={draftMode}
                    class="peer sr-only"
                />
                {draftMode ? "排除" : "包括"}
            </label>

            {#if types}
                <select
                    class="h-7 w-14 bg-muted outline-none"
                    bind:value={draftType}
                >
                    {#each ["suffix", "full", "keyword", "regexp"] as t}
                        <option value={t}>{t}</option>
                    {/each}
                </select>
            {/if}

            <input
                bind:value={draftValue}
                list={id}
                placeholder="Enter 以添加"
                class="flex-1 border-b p-1 outline-none placeholder:text-xs"
                onkeydown={onKeydown}
            />
            {#if datalist}
                <datalist {id}>
                    {#each datalist as dl}
                        <option value={dl}></option>
                    {/each}
                </datalist>
            {/if}
        </li>

        {#if !types}
            <Entry bind:entries={params.t} name={"包括"} />
            <Entry bind:entries={params.et!} name={"排除"} />
        {:else}
            <Entry types={"full"} bind:entries={params.d!} name={"包括"} />
            <Entry types={"suffix"} bind:entries={params.ds!} name={"包括"} />
            <Entry types={"keyword"} bind:entries={params.dk!} name={"包括"} />
            <Entry types={"regexp"} bind:entries={params.dr!} name={"包括"} />
            <Entry types={"full"} bind:entries={params.ed!} name={"排除"} />
            <Entry types={"suffix"} bind:entries={params.eds!} name={"排除"} />
            <Entry types={"keyword"} bind:entries={params.edk!} name={"排除"} />
            <Entry types={"regexp"} bind:entries={params.edr!} name={"排除"} />
        {/if}
    </ul>
</fieldset>
