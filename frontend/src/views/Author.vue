<template>
    <div>
        <ConsultAuthor :ida="$route.params.name" />
    </div>
</template>

<script>
import ConsultAuthor from "@/components/ConsultAuthor.vue"

export default {
    name: 'Author',
    
    components: {
        ConsultAuthor,
    },
}
</script>