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

<select
    class="min-h-8 w-full rounded pl-1 border border-gray-300 sm:text-sm dark:border-gray-600 dark:bg-gray-900"
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
