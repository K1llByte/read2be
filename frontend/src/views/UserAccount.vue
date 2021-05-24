<template>
    <div>
        <h1 class="armwrestler x-large dark my-4">My Account</h1>
        <ConsultAccount :idu="$route.params.username" />
    </div>
</template>

<script>
import ConsultAccount from "@/components/ConsultAccount.vue"

export default {
    name: 'UserAccount',
    
    components: {
        ConsultAccount,
    },
}
</script>