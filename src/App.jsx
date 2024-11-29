import ColorInput from "./ColorInput";
import { GithubIcon } from "./Icon";

function App() {
   return (
      <>
         <header className="max-w-5xl mx-auto flex items-center justify-between py-4 mb-20">
            <h1 className="text-base ">
               <span className="font-bold text-xl block">
                  {" "}
                  Material 3 Theme Generator
               </span>
               <span className="italic font-normal">for Tailwindcss v3</span>
            </h1>
            <a href="" className="btn btn-square rounded-2xl">
               <GithubIcon />
            </a>
         </header>
         <ColorInput />
      </>
   );
}

export default App;
