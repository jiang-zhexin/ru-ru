<script lang="ts">
    let {
        id,
        items = $bindable(),
        placeholder,
        datalist,
    }: {
        id: string;
        items: string[];
        placeholder?: string;
        datalist?: string[];
    } = $props();

    let input = $state("");

    placeholder = "Enter 以键入";

    function addItem(ev: KeyboardEvent) {
        if (ev.key !== "Enter") return;
        ev.preventDefault();
        const val = input.trim();
        if (val === "") return;
        if (!items.includes(val)) items.push(val);
        input = "";
    }
</script>

<label>
    <span class="text-sm font-medium">
        {id}
    </span>
    <div>
        <input
            {placeholder}
            bind:value={input}
            onkeydown={addItem}
            list={id}
            class="my-1 h-6 w-full rounded px-1.5 border bg-gray-200 border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-sm placeholder:text-xs text-justify"
        />

        {#each items as tag}
            <button
                type="button"
                onclick={() => (items = items.filter((t) => t !== tag))}
                class="m-0.5 px-1 rounded-md cursor-pointer bg-gray-300 dark:bg-gray-600"
            >
                {tag} &times;
            </button>
        {/each}
    </div>

    <datalist {id}>
        {#each datalist as dl}
            <option value={dl}></option>
        {/each}
    </datalist>
</label>
