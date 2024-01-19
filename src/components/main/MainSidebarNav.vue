<template>
    <nav class="px-4 py-6">
        <ul>
            <li v-for="list of $workspace.lists" :key="list.id">
                {{ list.name }}
                <span v-if="$tasksList.id === list.id">(active)</span>
            </li>
        </ul>
    </nav>
</template>
