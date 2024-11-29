import React, { useState } from "react";
import { getColorCode } from "./getColorCode";

export default function ColorInput() {
   const [color, setColor] = useState("#ffffff"); // Default color is white
   const [input, setInput] = useState("#ffffff");
   const [output, setOutput] = useState(null);
   // Handle color picker change
   const handleColorPickerChange = (event) => {
      const newColor = event.target.value;
      setColor(newColor); // Update the state with the selected color
      setInput(newColor);
   };

   // Handle text input change
   const handleTextInputChange = (event) => {
      let input = event.target.value.trim(); // Trim any unnecessary whitespace

      setInput(input);

      // Regex to match valid hex formats: #abc, #abcdef, abc, or abcdef
      const hexRegex = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/;

      if (hexRegex.test(input)) {
         // Ensure the value starts with a #
         let newColor = input.startsWith("#") ? input : `#${input}`;

         // Convert shorthand hex (#abc) to full hex (#aabbcc)
         if (newColor.length === 4) {
            newColor = `#${newColor[1]}${newColor[1]}${newColor[2]}${newColor[2]}${newColor[3]}${newColor[3]}`;
         }

         setColor(newColor);
      }
   };
   const generateTheme = () => {
      const [cssCode, tailwind] = getColorCode(color);
      setOutput({
         css: cssCode,
         tailwind: tailwind,
      });
   };
   return (
      <>
         <div className="border border-neutral rounded-full w-max p-3 flex items-center mx-auto">
            <label
               className="cursor-pointer size-12 rounded-full"
               style={{ backgroundColor: color }}
            >
               <input
                  type="color"
                  className="cursor-pointer opacity-0"
                  value={color}
                  onChange={handleColorPickerChange}
               />
            </label>
            <input
               type="text"
               className="bg-transparent outline-none pl-5 text-lg font-mono font-semibold"
               value={input}
               placeholder={"#ffffff"}
               onChange={handleTextInputChange}
            />
            <button
               onClick={generateTheme}
               className="btn btn-primary rounded-full px-6"
            >
               Generate
            </button>
         </div>
         {output && (
            <>
               <CodeBox code={output.css} />
               <CodeBox code={output.tailwind} />
            </>
         )}
      </>
   );
}
function CodeBox({ code }) {
   const [buttonText, setButtonText] = useState("Copy");

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(code);
         setButtonText("Copied!");
         setTimeout(() => setButtonText("Copy"), 2000);
      } catch (error) {
         setButtonText("Failed");
         setTimeout(() => setButtonText("Copy"), 2000);
      }
   };

   return (
      <>
         <div className="mockup-code max-w-4xl mx-auto mt-20 relative">
            <button onClick={handleCopy} className="btn absolute top-4 right-4">
               {buttonText}
            </button>
            <code>
               <pre>{code}</pre>
            </code>
         </div>
      </>
   );
}
