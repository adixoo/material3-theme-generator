import {
   argbFromHex,
   themeFromSourceColor,
   Hct,
} from "@material/material-color-utilities";
import convert from "color-convert";

import { tones, roles, shortFormWord } from "./data";

function redFromArgb(argb) {
   return (argb >> 16) & 255;
}
function greenFromArgb(argb) {
   return (argb >> 8) & 255;
}
function blueFromArgb(argb) {
   return argb & 255;
}

function hslFromArgb(argb) {
   const r = redFromArgb(argb);
   const g = greenFromArgb(argb);
   const b = blueFromArgb(argb);
   const outParts = [r.toString(16), g.toString(16), b.toString(16)];
   for (const [i, part] of outParts.entries()) {
      if (part.length === 1) {
         outParts[i] = "0" + part;
      }
   }
   const hexValue = "#" + outParts.join(""); // Your hex color

   const [h, s, l] = convert.hex.hsl(hexValue);

   return `${h}deg ${s}% ${l}%`;
}
function camelToKebab(str) {
   return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function shortWord(string) {
   let result = string;
   Object.keys(shortFormWord).forEach((key) => {
      const regex = new RegExp(`\\b${key}\\b`, "g");
      result = result.replace(regex, shortFormWord[key]);
   });

   return result;
}

export function getColorCode(color) {
   const theme = themeFromSourceColor(argbFromHex(color));
   const scheme = {};
   const darkScheme = [];
   const lightScheme = [];
   const tailwindConfig = [];
   for (let palette of Object.keys(theme.palettes)) {
      for (let tone of tones) {
         const hctColor = Hct.from(
            theme.palettes[palette].hue,
            theme.palettes[palette].chroma,
            tone
         );
         const argb = hctColor.toInt();
         scheme[camelToKebab(palette) + tone] = hslFromArgb(argb);
      }
   }
   for (let role of Object.keys(roles)) {
      const paletteColor = roles[role];
      const hslDark = scheme[paletteColor.dark];
      const hslLight = scheme[paletteColor.light];
      const shortFormRole = shortWord(role);
      darkScheme.push(`--${shortFormRole}: ${hslDark}; /* ${role} */`);
      lightScheme.push(`--${shortFormRole}: ${hslLight}; /* ${role} */`);
      tailwindConfig.push(
         `"${shortFormRole}": "hsl(var(--${shortFormRole}))",`
      );
   }

   return [
      `@layer base {\n\t:root {\n\t\t${lightScheme.join(
         "\n\t\t"
      )}\n\t}\n\t.dark {\n\t\t${darkScheme.join("\n\t\t")}\n\t}\n  }`,
      `{\n\t${tailwindConfig.join("\n\t")}\n  }`,
   ];
}
