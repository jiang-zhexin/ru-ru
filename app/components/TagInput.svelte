<script lang="ts">
    let {
        id,
        items = $bindable(),
        datalist,
    }: {
        id: string;
        items: string[];
        datalist?: string[];
    } = $props();

    let input = $state("");

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
            placeholder="Enter 以键入"
            bind:value={input}
            onkeydown={addItem}
            list={id}
            class="my-1 h-6 w-full px-1.5 border-b outline-none text-sm placeholder:text-xs text-justify"
        />

        {#each items as tag}
            <button
                type="button"
                onclick={() => (items = items.filter((t) => t !== tag))}
                class="m-0.5 px-1 py-0.5 cursor-pointer bg-muted text-sm whitespace-nowrap"
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
