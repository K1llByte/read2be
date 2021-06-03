<template>
    <div>
        <ConsultGenre :ida="$route.params.name" />
    </div>
</template>

<script>
import ConsultGenre from "@/components/ConsultGenre.vue"

export default {
    name: 'Genre',
    
    components: {
        ConsultGenre,
    },
}
</script>