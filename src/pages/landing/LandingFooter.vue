<template>
    <footer>
        <div class="mx-8">
            <div class="m-auto flex h-14 max-w-screen-xl items-center justify-center space-x-3 text-sm text-slate-700">
                <a class="hover:underline" href="#">
                    {{ $t('footer.about') }}
                </a>
                <div class="h-4 w-px bg-slate-500/50" />
                <a class="hover:underline" :href="$app.sourceUrl" target="_blank">
                    {{ $t('footer.source') }}
                </a>
                <div class="h-4 w-px bg-slate-500/50" />
                <a class="hover:underline" href="#"> v0.0.0 </a>
            </div>
        </div>
    </footer>
</template>
