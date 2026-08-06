<script lang="ts">
    interface value {
        name: string;
    }

    let {
        cursor = $bindable(),
        values = $bindable(),
        draftValue,
        addInfo = "add a draft element",
    }: {
        cursor: number;
        values: value[];
        draftValue: value;
        addInfo?: string;
    } = $props();

    $effect(() => {
        if (values.length === 0) cursor = values.push(draftValue) - 1;
    });
</script>

<div class="flex gap-1">
    <select
        class="min-h-8 w-full pl-1 sm:text-sm focus:outline-none bg-muted"
        value={cursor}
        onchange={(e) => {
            const c = Number(e.currentTarget.value);
            if (c === -1) {
                /** add a element */
                cursor = values.push(draftValue) - 1;
            } else {
                cursor = c;
            }
        }}
    >
        {#each values.entries() as [c, v]}
            <option value={c}>{`${c + 1}. ${v.name}`}</option>
        {/each}
        <option value={-1}> + {addInfo} </option>
    </select>

    <button
        type="button"
        class="w-1/4 cursor-pointer py-1 bg-accent transition-colors duration-150 text-xs"
        popovertarget="deletePopover"
    >
        删除
    </button>
</div>
