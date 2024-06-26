export const enum ColorSpriteName {
  DOOR,
  KEY,
  ITEM_CARD,
  ITEM_CARDS,
  ITEM_GEM,
  ITEM_JUG,
  ITEM_PIECE,
  ITEM_POTION,
  ITEM_DROP,
  ITEM_CROWN,
}

export const ColorSpriteContent = new Map<ColorSpriteName, string>([
  [
    ColorSpriteName.DOOR,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 60 60"><path d="M45 52.5H15v-37c0-2.8 0-4.2.545-5.27a5 5 0 0 1 2.185-2.185C18.8 7.5 20.2 7.5 23 7.5h14c2.8 0 4.201 0 5.27.545a5 5 0 0 1 2.185 2.185C45 11.3 45 12.7 45 15.5z" style="fill:#ff0"/><path d="M7.5 52.5h45m-7.5 0v-37c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.185C41.201 7.5 39.8 7.5 37 7.5H23c-2.8 0-4.2 0-5.27.545a5 5 0 0 0-2.185 2.185C15 11.3 15 12.7 15 15.5v37M37.5 30h.025" style="fill:none;fill-rule:nonzero;stroke:#000;stroke-width:4px"/>',
  ],
  [
    ColorSpriteName.KEY,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 60 60"><path d="M37.575 22.5h.025m-.025 15c8.284 0 15-6.716 15-15s-6.716-15-15-15-15 6.716-15 15q.001 1.027.134 2.018c.146 1.085.219 1.628.17 1.971-.051.358-.116.55-.292.866-.169.303-.468.601-1.064 1.197L8.747 41.329c-.433.432-.649.648-.804.9a2.5 2.5 0 0 0-.299.723c-.069.288-.069.594-.069 1.205V48.5c0 1.4 0 2.1.272 2.635.24.47.623.853 1.093 1.093.535.272 1.235.272 2.635.272h4.343c.611 0 .917 0 1.205-.069.255-.061.499-.162.723-.299.252-.155.468-.371.9-.803l12.777-12.777c.596-.596.894-.894 1.197-1.064.316-.176.508-.241.866-.292.343-.049.886.024 1.972.17q.99.133 2.017.134" style="fill:#ff0;fill-rule:nonzero;stroke:#000;stroke-width:4px"/>',
  ],
  [
    ColorSpriteName.ITEM_CARD,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="m25.73 10.921 22.75 22.75-14.21 14.21L11.52 25.13z" style="fill:#ff0"/><path d="M33.302 50.785c.268.268.618.401.968.401.351 0 .701-.133.969-.401l16.145-16.146a1.367 1.367 0 0 0 0-1.936L26.698 8.016a1.37 1.37 0 0 0-1.936 0L8.616 24.162a1.37 1.37 0 0 0 0 1.937zM25.73 10.921l22.75 22.75-14.21 14.21L11.52 25.13z" style="fill:#000;fill-rule:nonzero"/>',
  ],
  [
    ColorSpriteName.ITEM_CARDS,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="M50.181 40.314a1.368 1.368 0 1 0-1.936 1.936l.235.235-14.21 14.21-22.75-22.751.235-.235a1.368 1.368 0 1 0-1.936-1.936l-1.203 1.203a1.37 1.37 0 0 0 0 1.936l24.686 24.687a1.37 1.37 0 0 0 1.936 0l16.146-16.146a1.37 1.37 0 0 0 0-1.936z" style="fill-rule:nonzero;fill:#000"/><path d="M50.181 32.099a1.37 1.37 0 0 0-1.936 1.937l.235.234-14.21 14.21-22.75-22.75.235-.235a1.37 1.37 0 0 0-1.936-1.937l-1.203 1.203a1.37 1.37 0 0 0 0 1.937l24.686 24.686c.268.268.618.401.968.401.351 0 .701-.133.969-.401l16.145-16.145a1.37 1.37 0 0 0 0-1.937z" style="fill-rule:nonzero;fill:#000"/><path d="m25.73 3.305 22.75 22.751-14.21 14.209-22.75-22.75z" style="fill:#ff0"/><path d="M33.302 43.17a1.37 1.37 0 0 0 1.937 0l16.145-16.146a1.37 1.37 0 0 0 0-1.936L26.698.401a1.37 1.37 0 0 0-1.936 0L8.616 16.547a1.37 1.37 0 0 0 0 1.936zM25.73 3.305l22.75 22.751-14.21 14.209-22.75-22.75z" style="fill-rule:nonzero;fill:#000"/>',
  ],
  [
    ColorSpriteName.ITEM_GEM,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5" viewBox="0 0 60 60"><path d="M47.5 21.25v17.5c0 4.829-3.921 8.75-8.75 8.75h-17.5c-4.829 0-8.75-3.921-8.75-8.75v-17.5c0-4.829 3.921-8.75 8.75-8.75h17.5c4.829 0 8.75 3.921 8.75 8.75" style="fill:#ff0;stroke:#000;stroke-width:4px"/>',
  ],
  [
    ColorSpriteName.ITEM_JUG,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 60 60"><path d="m7.825 13.7 3.325 6.05 1.5 27.875A2.51 2.51 0 0 0 15.15 50H40c1.371 0 2.5-1.129 2.5-2.5v-33a2.51 2.51 0 0 0-2.325-2.5l-30-2a2.51 2.51 0 0 0-2.66 2.495c0 .421.107.836.31 1.205" style="fill:#ff0;fill-rule:nonzero"/><path d="m42.925 35 7.675-1.9a2.51 2.51 0 0 0 1.9-2.5V20c0-1.371-1.129-2.5-2.5-2.5h-7.075m-35.1-3.8 3.325 6.05 1.5 27.875A2.51 2.51 0 0 0 15.15 50H40c1.371 0 2.5-1.129 2.5-2.5v-33a2.51 2.51 0 0 0-2.325-2.5l-30-2a2.51 2.51 0 0 0-2.66 2.495c0 .421.107.836.31 1.205" style="fill:none;fill-rule:nonzero;stroke:#000;stroke-width:5px"/>',
  ],
  [
    ColorSpriteName.ITEM_PIECE,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5" viewBox="0 0 60 60"><circle cx="30" cy="30" r="10" style="fill:#ff0;stroke:#000;stroke-width:4px"/>',
  ],
  [
    ColorSpriteName.ITEM_POTION,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="M25.854 23.781v-4.509a4.15 4.15 0 0 0 1.7.364h4.893c.601 0 1.177-.13 1.699-.364v4.509c0 1.145.928 2.073 2.073 2.073 6.868 0 12.437 5.569 12.437 12.438 0 6.868-5.569 12.437-12.437 12.437H23.781c-6.868 0-12.437-5.569-12.437-12.437 0-6.869 5.569-12.438 12.437-12.438a2.073 2.073 0 0 0 2.073-2.073" style="fill:#ff0"/><path d="M25.854 23.781v-4.509a4.15 4.15 0 0 0 1.7.364h4.893c.601 0 1.177-.13 1.699-.364v4.509c0 1.145.928 2.073 2.073 2.073 6.868 0 12.437 5.569 12.437 12.438 0 6.868-5.569 12.437-12.437 12.437H23.781c-6.868 0-12.437-5.569-12.437-12.437 0-6.869 5.569-12.438 12.437-12.438a2.073 2.073 0 0 0 2.073-2.073m12.438-14.51h-.455a4.147 4.147 0 0 0-4.146-4.146H26.31a4.15 4.15 0 0 0-4.147 4.146h-.455a2.072 2.072 0 0 0 0 4.146v8.42c-8.18 1.02-14.51 7.998-14.51 16.455 0 9.158 7.425 16.583 16.583 16.583h12.438c9.158 0 16.583-7.425 16.583-16.583 0-8.457-6.33-15.435-14.51-16.455v-8.42a2.072 2.072 0 0 0 0-4.146m-11.982 0 1.244 6.219h4.893l1.244-6.219z" style="fill:#000"/>',
  ],
  [
    ColorSpriteName.ITEM_DROP,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="M20.414 24.825q.64-.745 1.33-1.536c2.516-2.892 5.484-6.305 8.256-10.747 2.772 4.442 5.74 7.855 8.256 10.747q.69.791 1.33 1.536C43.063 28.886 45 31.719 45 35.424 45 43.417 38.343 50 30 50s-15-6.583-15-14.576c0-3.705 1.937-6.538 5.414-10.599" style="fill:#ff0"/><path d="m30 2.069 2.22 4.28c3.039 5.862 6.583 9.943 9.786 13.631q.701.805 1.377 1.593C46.833 25.601 50 29.698 50 35.424 50 46.293 40.987 55 30 55s-20-8.707-20-19.576c0-5.726 3.167-9.823 6.617-13.851q.676-.788 1.377-1.593c3.203-3.688 6.747-7.769 9.787-13.631zm-9.586 22.756C16.937 28.886 15 31.719 15 35.424 15 43.417 21.658 50 30 50c8.343 0 15-6.583 15-14.576 0-3.705-1.937-6.538-5.414-10.599q-.64-.745-1.33-1.536C35.74 20.397 32.772 16.984 30 12.542c-2.772 4.442-5.74 7.855-8.256 10.747q-.69.791-1.33 1.536" style="fill:#000"/>',
  ],
  [
    ColorSpriteName.ITEM_CROWN,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 60 60"><path d="m30 17.5 8.75 13.75L52.5 20l-5 30h-35l-5-30 13.75 11.25z" style="fill:#ff0"/><path d="m52.5 20-5 30h-35l-5-30m45 0L38.75 31.25 30 17.5M52.5 20a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5M30 17.5l-8.75 13.75L7.5 20M30 17.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5M7.5 20a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5" style="fill:none;fill-rule:nonzero;stroke:#000;stroke-width:3.75px"/>',
  ],
])
