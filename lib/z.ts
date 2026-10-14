// The only z-index values on the page. Mirrored as CSS variables in app/globals.css.
// The lightbox uses the native top layer (<dialog>.showModal()), so it needs no value.
export const Z = {
  base: 0,
  stage: 10,
  sticky: 40,
  menu: 50,
  skip: 60,
} as const;
