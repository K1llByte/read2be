<template>
    <div>
        <ConsultGenre :idg="$route.params.genre" />
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