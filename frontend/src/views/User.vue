<template>
    <div>
        <ConsultUser :idu="$route.params.username" />
    </div>
</template>

<script>
import ConsultUser from "@/components/ConsultUser.vue"

export default {
    name: 'User',
    
    components: {
        ConsultUser,
    },
}
</script>