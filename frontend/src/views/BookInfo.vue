<template>
    <div>
        <ConsultBook :idb="$route.params.isbn" />
    </div>
</template>

<script>
import ConsultBook from "@/components/ConsultBook.vue"

export default {
    name: 'BookInfo',
    
    components: {
        ConsultBook,
    },
}
</script>