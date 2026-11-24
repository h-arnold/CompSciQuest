const root = document.querySelector<HTMLDivElement>('#app');

if (root === null) {
  throw new Error('Missing #app element');
}

root.textContent = 'CompSciQuest is under construction.';
