<template>
    <ConsultAuthor :ida="$route.params.name" mensagem="Teste" />
</template>

<script>
import ConsultAuthor from "@/components/ConsultAuthor.vue"

export default {
    name: 'Authors',
    
    components: {
        ConsultAuthor
    },
}
</script>