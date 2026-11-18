<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const trap = ref(null);
const showTeleported = ref(false);
const errors = ref([]);

// An error thrown inside a MutationObserver callback is uncaught, so it reaches window 'error'.
function onError(event) {
  errors.value.push(String(event.error ?? event.message));
}

onMounted(() => window.addEventListener('error', onError));
onBeforeUnmount(() => window.removeEventListener('error', onError));

function appendChild() {
  const child = document.createElement('div');
  child.textContent = 'Appended with appendChild';
  trap.value.appendChild(child);
}
</script>

<template>
  <main>
    <h1>PrimeVue FocusTrap: null MutationRecord.nextSibling</h1>
    <p>
      Each button below is outside the trap, so it holds focus while the trapped element's
      children change at the END of the element. The directive's MutationObserver then calls
      <code>findNextFocusableElement(mutation.nextSibling)</code> with <code>null</code> and throws.
    </p>

    <button id="append" type="button" @click="appendChild">1. Append a child (appendChild)</button>
    <button id="teleport" type="button" @click="showTeleported = !showTeleported">
      2. Toggle a Vue Teleport into the trap
    </button>

    <div v-focustrap ref="trap" id="trap" style="border: 1px solid #888; padding: 1rem; margin: 1rem 0">
      <button type="button">Inside the trap</button>
    </div>

    <Teleport v-if="showTeleported" to="#trap">
      <div>Teleported into the trap</div>
    </Teleport>

    <h2 id="count">Uncaught errors: {{ errors.length }}</h2>
    <pre id="errors">{{ errors.join('\n') }}</pre>
  </main>
</template>
