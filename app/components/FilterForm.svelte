<script lang="ts">
    import { onMount } from "svelte";
    import TagInput from "./TagInput.svelte";
    import { DEFAULT_PARAMS, type Params } from "../lib/params";
    import { client } from "../lib/client";
    import MutableSelect from "./MutableSelect.svelte";

    let {
        paramarray = $bindable(),
        cursor = $bindable(),
        params = $bindable(),
    }: {
        paramarray: Params[];
        cursor: number;
        params: Params;
    } = $props();

    let tags: string[] = $state([]);
    onMount(async () => {
        const resp = await client.tags.$get();
        if (resp.ok) tags = await resp.json();
    });
</script>

<form>
    <MutableSelect
        bind:values={paramarray}
        bind:cursor
        draftValue={structuredClone(DEFAULT_PARAMS)}
        addInfo="新建配置"
    />
    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            文件名 (filename)
        </legend>
        <div class="flex items-start gap-2">
            <input
                value={params.name}
                onchange={(e) => (params.name = e.currentTarget.value)}
                class="my-1 h-6 w-full rounded px-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-900 invalid:border-red-500"
                required
            />
        </div>
    </fieldset>

    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            扩展名 (extension)
        </legend>
        <div class="flex items-start gap-2">
            {#each ["srs", "json"] as v}
                <label
                    class="grid place-items-center w-18 text-sm p-1 rounded-md cursor-pointer bg-gray-300 dark:bg-gray-600 has-checked:bg-sky-500"
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

    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            srs 版本 (version)
        </legend>
        <div class="flex items-start gap-2">
            {#each ["1", "2", "3", "4", "5"] as v}
                <label
                    class="grid place-items-center text-xs w-6 h-6 rounded-md cursor-pointer bg-gray-300 dark:bg-gray-600 has-checked:bg-sky-500"
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

    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            域名类型 (type)
        </legend>
        <div class="flex items-start gap-1">
            {#each ["suffix", "full", "keyword", "regexp"] as f}
                <label
                    class="grid place-items-center w-18 text-sm p-1 rounded-md cursor-pointer bg-gray-300 dark:bg-gray-600 has-checked:bg-sky-500"
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

    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            标签 (tags)
        </legend>
        <TagInput bind:items={params.t} id="include tags" datalist={tags} />
        <TagInput bind:items={params.et!} id="exclude tags" datalist={tags} />
    </fieldset>

    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            额外的域名 (extra domain)
        </legend>
        <div class="grid grid-cols-2 gap-1">
            <TagInput bind:items={params.d!} id="extra full" />
            <TagInput bind:items={params.ds!} id="extra suffix" />
            <TagInput bind:items={params.dk!} id="extra keyword" />
            <TagInput bind:items={params.dr!} id="extra regex" />
        </div>
    </fieldset>

    <fieldset class="rounded-sm border border-base-300 gap-1 p-2">
        <legend class="-mb-1 flex items-center justify-between gap-2 px-2">
            排除的域名 (exclude domain)
        </legend>
        <div class="grid grid-cols-2 gap-1">
            <TagInput bind:items={params.ed!} id="exclude full" />
            <TagInput bind:items={params.eds!} id="exclude suffix" />
            <TagInput bind:items={params.edk!} id="exclude keyword" />
            <TagInput bind:items={params.edr!} id="exclude regex" />
        </div>
    </fieldset>
</form>

<button
    class="w-full rounded cursor-pointer p-2 my-2 bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 transition-colors duration-150"
    popovertarget="deletePopover"
>
    删除此配置
</button>

<dialog
    id="deletePopover"
    popover
    class="fixed inset-0 m-auto px-8 py-6 rounded dark:bg-gray-800 dark:text-white backdrop:bg-black/40"
>
    <p>是否删除 {params.name}？</p>
    <button
        popovertarget="deletePopover"
        popovertargetaction="hide"
        class="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-400 dark:hover:bg-sky-600 rounded"
        onclick={(e) => {
            if (paramarray.length > 1) {
                paramarray.splice(cursor, 1);
                cursor = 0;
            } else {
                paramarray[cursor] = structuredClone(DEFAULT_PARAMS);
            }
        }}>确认</button
    >
</dialog>
