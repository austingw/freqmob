"use client";

import { Modal, createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "wild-pink",
  primaryShade: { light: 6, dark: 3 },
  colors: {
    "cool-blue": [
      "#dffcff",
      "#cbf4ff",
      "#9ae6ff",
      "#64d9ff",
      "#3ccdfe",
      "#24c5fe",
      "#00BBF9",
      "#00aae4",
      "#0098cc",
      "#0083b5",
    ],
    "electric-teal": [
      "#e1fffd",
      "#ccfff9",
      "#9cfff2",
      "#67ffea",
      "#42fee4",
      "#2dfee0",
      "#00F5D4",
      "#00e3c4",
      "#00caae",
      "#00af96",
    ],
    "happy-yellow": [
      "#fffce0",
      "#fff8ca",
      "#fef199",
      "#fee963",
      "#fee337",
      "#fedf19",
      "#FEE440",
      "#e2c300",
      "#c8ad00",
      "#ac9500",
    ],
    "wild-pink": [
      "#f470bf",
      "#f470bf",
      "#f470bf",
      "#f470bf",
      "#f470bf",
      "#f470bf",
      "#F15BB5",
      "#F15BB5",
      "#F15BB5",
      "#F15BB5",
    ],
    "swag-purp": [
      "#f7ebff",
      "#e7d5fc",
      "#cba8f3",
      "#ad7aeb",
      "#9451e3",
      "#8438df",
      "#9B5DE5",
      "#6a1dc6",
      "#5e19b2",
      "#51129c",
    ],
  },
  components: {
    Modal: Modal.extend({
      vars: (theme) => {
        return {
          root: {},
          title: {
            fontSize: theme.fontSizes.lg,
            fontWeight: 500,
          },
        };
      },
    }),
  },
});
