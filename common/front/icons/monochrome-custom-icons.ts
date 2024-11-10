export const enum MonochromeCustomIconsName {
  BACKWARD = "backward",
  FAST_BACKWARD = "fast-backward",
  FORWARD = "forward",
  LOAD = "load",
  SAVE = "save",
}

export const MonochromeCustomIcons = new Map<MonochromeCustomIconsName, string>([
  [
    MonochromeCustomIconsName.BACKWARD,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="M42.093 11.94c-.852-.357-1.825-.148-2.495.477L16.507 34.838 39.598 57.26a2.3 2.3 0 0 0 1.613.655c.304 0 .578-.06.882-.179.852-.357 1.4-1.161 1.4-2.054V13.995c0-.893-.548-1.727-1.4-2.055Zm-3.164 38.352L23.138 34.838l15.791-15.453z" style="fill-rule:nonzero;stroke:#000;stroke-width:1px"/>',
  ],
  [
    MonochromeCustomIconsName.FAST_BACKWARD,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="M55.223 11.94c-.852-.357-1.825-.148-2.495.477L32.282 32.426V13.995c0-.893-.548-1.727-1.4-2.055-.852-.357-1.825-.148-2.495.477L7.941 32.426V13.995c0-1.221-1.034-2.233-2.282-2.233s-2.282 1.012-2.282 2.233v41.687c0 1.22 1.035 2.233 2.282 2.233s2.282-1.013 2.282-2.233V37.25l20.446 20.01a2.3 2.3 0 0 0 1.613.655c.304 0 .578-.06.882-.179.852-.357 1.4-1.161 1.4-2.054V37.25l20.446 20.01a2.3 2.3 0 0 0 1.613.655c.304 0 .578-.06.882-.179.852-.357 1.4-1.161 1.4-2.054V13.995c0-.893-.548-1.727-1.4-2.055ZM27.718 50.292 11.927 34.838l15.791-15.453zm24.341 0L36.268 34.838l15.791-15.453z" style="fill-rule:nonzero;stroke:#000;fill:#000"/>',
  ],
  [
    MonochromeCustomIconsName.FORWARD,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 60 60"><path d="M17.907 11.94c.852-.357 1.825-.148 2.495.477l23.091 22.421L20.402 57.26a2.3 2.3 0 0 1-1.613.655c-.304 0-.578-.06-.882-.179-.852-.357-1.4-1.161-1.4-2.054V13.995c0-.893.548-1.727 1.4-2.055Zm3.164 38.352 15.791-15.454-15.791-15.453z" style="fill-rule:nonzero;stroke:#000;stroke-width:1px"/>',
  ],
  [
    MonochromeCustomIconsName.LOAD,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 60 60"><path fill="none" d="M52.5 31.5v16.998c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185c-1.069.545-2.47.545-5.27.545h-29c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185c-.545-1.07-.545-2.47-.545-5.27V31.5m12.5-10 10-10m0 0 10 10m-10-10v30" style="fill-opacity:0;stroke:#000;stroke-width:5px"/>',
  ],
  [
    MonochromeCustomIconsName.SAVE,
    'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 60 60"><path fill="none" d="M52.5 31.5v16.998c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185c-1.069.545-2.47.545-5.27.545h-29c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185c-.545-1.07-.545-2.47-.545-5.27V31.5m12.5 0 10 10m0 0 10-10m-10 10v-30" style="fill-opacity:0;stroke:#000;stroke-width:5px"/>',
  ],
])
