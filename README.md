# PrimeVue FocusTrap: TypeError on null MutationRecord.nextSibling

Minimal reproduction for a bug in the `v-focustrap` directive (PrimeVue 4.5.5, also 5.0.5).

Open in StackBlitz: https://stackblitz.com/github/Shufflewick/primevue-focustrap-null-sibling-repro

## Steps

1. `npm install`
2. `npm run dev` and open the printed URL.
3. Click "1. Append a child (appendChild)" or "2. Toggle a Vue Teleport into the trap".

## Expected

No error. The trapped element gains a child.

## Actual

An uncaught error, shown on the page by a `window` `error` listener:

```
TypeError: Cannot read properties of null (reading 'nextSibling')
```

## Cause

The directive's MutationObserver (`focustrap/index.mjs`, `bind`) runs when the trapped
element's children change while focus is outside the trap, and calls
`findNextFocusableElement(mutation.nextSibling)`. `MutationRecord.nextSibling` is `null`
when the change happened at the end of the element. The directive appends its own hidden
focusable span as the last child on mount, so anything added after mount with
`appendChild` (including a Vue `<Teleport>` into the trap) lands after it, and the first
call reads `_el.nextSibling` on `null`.

The error is thrown inside a MutationObserver callback, so Vue's error handler never sees it.

## Suggested fix

At the top of `findNextFocusableElement`:

```js
if (!_el) return getFirstFocusableElement(el, this.getComputedSelector(el.$_pfocustrap_focusableselector));
```

With that line added to `node_modules/primevue/focustrap/index.mjs` locally, both buttons
run without an error and focus moves to the first focusable element inside the trap.
