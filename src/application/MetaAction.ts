// Canonical union from application-and-ui.md §4.1.
export type MetaAction =
  | { readonly kind: 'save' }
  | { readonly kind: 'load' }
  | { readonly kind: 'download' }
  | { readonly kind: 'import'; readonly text: string }
  | { readonly kind: 'restart' };
