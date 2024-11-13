import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
interface ResultsInterface {
  id: number;
  title: string;
  summary: string;
}

const SearchBar = () => {
  const [inputData, setInputData] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>("");
  const [results, setResults] = useState<ResultsInterface[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  console.log(results);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedInput(inputData);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputData]);

  useEffect(() => {
    if (debouncedInput) {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/posts/search/?q=${debouncedInput}`
          );
          setResults(response.data);
          setIsOpen(true);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchSearchResults();
    } else {
      setIsOpen(false);
    }
  }, [debouncedInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full" ref={searchRef}>
      <input
        type="text"
        placeholder="Search for any title or summary"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded-full p-4 bg-gray-200"
      />

      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-15 left-0 w-full bg-gray-200 shadow-xl shadow-gray-300 rounded-lg m-2 z-20 max-h-60 overflow-y-auto"
        >
          <ul>
            {inputData == ""
              ? ""
              : results.map((result, index) => (
                  <li
                    key={index}
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer "
                    onClick={() => {
                      router.push(`/${result.id}`);
                    }}
                  >
                    {result.title}
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
