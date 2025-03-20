// import { FaSearch } from "react-icons/fa";
// import { SearchContent } from "@/interfaces/markdown";
// import contentIndexer from "@/lib/client/ContentIndexer";
// import { useRouter } from "next/router";
// import { ChangeEvent, useEffect, useRef, useState } from "react";

// const ContentSearch = () => {
//   const ref = useRef<HTMLInputElement>(null);
//   const [results, setResults] = useState<SearchContent[]>([]);
//   const [query, setQuery] = useState<string>("");
//   const router = useRouter();

//   const handleClickOutside = () => {
//     setResults([]);
//     setQuery("");
//   };

//   useEffect(() => {
//     const callback = (event: MouseEvent) => {
//       if (
//         results.length > 0 &&
//         ref.current &&
//         !ref.current.contains(event.target as Node)
//       ) {
//         handleClickOutside();
//       }
//     };

//     const escapeKeyCallback = (event: KeyboardEvent) => {
//       if (event.key === "Escape" && results.length > 0) {
//         handleClickOutside();
//       }
//     };

//     // MouseEvent
//     document.addEventListener("click", callback);
//     // KeyboardEvent
//     document.addEventListener("keydown", escapeKeyCallback);

//     // clean up
//     return () => {
//       document.removeEventListener("click", callback);
//       document.removeEventListener("keydown", escapeKeyCallback);
//     };
//   }, [results.length]);

//   const performSearch = (event: ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;
//     const results = contentIndexer.search(value);
//     setResults(results);
//     setQuery(value);
//   };

//   return (
//     <>
//       <label htmlFor="search" className="sr-only">
//         Search
//       </label>
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
//         </div>
//         <input
//           ref={ref}
//           value={query}
//           id="search-input"
//           autoComplete="off"
//           type="text"
//           className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
//           placeholder="Search for anything"
//           onChange={performSearch}
//         />
//       </div>
//       {results.length > 0 && (
//         <ul
//           className="w-80 border-solid border rounded-md z-10 bg-white max-h-80 overflow-auto absolute select is-multiple"
//           role="listbox"
//         >
//           {results.map((result) => (
//             <li
//               key={result.slug}
//               onClick={() => router.push(`/${result.category}/${result.slug}`)}
//               className={`hover:bg-teal-600 hover:text-white p-3 relative cursor-pointer`}
//             >
//               <div className="font-bold text-sm truncate">{result.title}</div>
//               <p className="truncate text-sm">{result.description}</p>
//               <span className="mt-2 text-xs text-white bg-gray-800 px-2 py-1 rounded-xl">
//                 {result.category}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </>
//   );
// };

// export default ContentSearch;
