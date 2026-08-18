<script lang="ts">
    import { onMount } from "svelte";
    import EntryList from "./EntryList.svelte";
    import { DEFAULT_PARAMS, type Params } from "@/lib/params";
    import { client } from "@/lib/client";

    let {
        paramarray = $bindable(),
        cursor = $bindable(),
        params = $bindable(),
    }: {
        paramarray: Params[];
        cursor: number;
        params: Params;
    } = $props();

    let suggestions: string[] = $state([]);
    onMount(async () => {
        const resp = await client.tags.$get();
        if (resp.ok) suggestions = await resp.json();
    });

    $effect(() => {
        if (paramarray.length === 0)
            cursor = paramarray.push(structuredClone(DEFAULT_PARAMS)) - 1;
    });
</script>

<div class="flex gap-1">
    <select
        class="min-h-8 w-full pl-1 sm:text-sm focus:outline-none bg-muted"
        value={cursor}
        onchange={(e) => {
            const c = Number(e.currentTarget.value);
            if (c === -1) {
                cursor = paramarray.push(structuredClone(DEFAULT_PARAMS)) - 1;
            } else {
                cursor = c;
            }
        }}
    >
        {#each paramarray.entries() as [c, v]}
            <option value={c}>{`${v.name}`}</option>
        {/each}
        <option value={-1}> + 新建配置 </option>
    </select>

    <button
        type="button"
        class="w-1/4 cursor-pointer py-1 bg-accent transition-colors duration-150 text-xs"
        popovertarget="deletePopover"
    >
        删除
    </button>
</div>

<fieldset class="border-l-2 p-2">
    <legend class="flex items-center justify-between">
        文件名 (filename)
    </legend>
    <div class="flex items-start gap-2">
        <input
            bind:value={params.name}
            class="p-1 w-full text-sm outline-none border-b"
            required
        />
    </div>
</fieldset>

<fieldset class="border-l-2 p-2">
    <legend class="flex items-center justify-between">
        扩展名 (extension)
    </legend>
    <div class="flex items-start gap-2">
        {#each ["srs", "json"] as v}
            <label
                class="grid place-items-center w-18 text-sm p-1 cursor-pointer bg-muted has-checked:bg-accent"
            >
                <input
                    type="radio"
                    name="format"
                    value={v}
                    bind:group={params.format}
                    class="peer sr-only"
                />
                {v}
            </label>
        {/each}
    </div>
</fieldset>

<fieldset class="border-l-2 p-2">
    <legend class="flex items-center justify-between">
        srs 版本 (version)
    </legend>
    <div class="flex items-start gap-2">
        {#each ["1", "2", "3", "4", "5"] as v}
            <label
                class="grid place-items-center text-sm w-6 h-6 cursor-pointer bg-muted has-checked:bg-accent"
            >
                <input
                    type="radio"
                    name="version"
                    value={v}
                    bind:group={params.v}
                    class="peer sr-only"
                />
                {v}
            </label>
        {/each}
    </div>
</fieldset>

<fieldset class="border-l-2 p-2">
    <legend class="flex items-center justify-between"> 域名类型 (type) </legend>
    <div class="flex items-start gap-2">
        {#each ["suffix", "full", "keyword", "regexp"] as f}
            <label
                class="grid place-items-center w-18 text-sm p-1 cursor-pointer bg-muted has-checked:bg-accent"
            >
                <input
                    type="checkbox"
                    name="format"
                    value={f}
                    bind:group={params.f}
                    class="peer sr-only"
                />
                {f}
            </label>
        {/each}
    </div>
</fieldset>

<EntryList
    legend="标签 (tags)"
    id="tag-input"
    bind:params
    datalist={suggestions}
/>

<EntryList
    legend="额外/排除域名 (domain)"
    id="domain-input"
    bind:params
    types={true}
/>

<dialog
    id="deletePopover"
    popover
    class="fixed inset-0 m-auto px-8 py-6 bg-background text-foreground backdrop:bg-black/40 border-l-2"
>
    <p>是否删除 <span class="font-mono">{params.name}</span>？</p>
    <button
        popovertarget="deletePopover"
        popovertargetaction="hide"
        class="block ml-auto mt-4 px-4 py-2 bg-accent"
        onclick={(e) => {
            if (paramarray.length > 1) {
                paramarray.splice(cursor, 1);
                cursor = 0;
            } else {
                paramarray[cursor] = structuredClone(DEFAULT_PARAMS);
            }
        }}
    >
        确认
    </button>
</dialog>
