import { useState } from "react";
import searchicon from "./assets/search.svg";
import book from "./assets/book.svg";
import github from "./assets/github.svg";

interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface WordData {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  origin: string;
  meanings: Meaning[];
}
function App() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [meaning, setMeaning] = useState<WordData[]>([]);
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const searchWord = async (e: React.FormEvent, word: string) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(url + word);
      const data = await response.json();
      console.log(data);
      setMeaning(data);
      console.log(meaning);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center py-4 px-2">
      <div className="flex justify-between w-full">
        <img src={book} alt="Book" />
        <form
          className="flex relative w-full max-w-sm"
          onSubmit={(e) => {
            searchWord(e, word);
          }}
        >
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            name="word"
            title="word"
            placeholder="Search for a word"
            required
            className="input input-bordered w-full max-w-xs rounded-e-none"
          />
          <button
            type="submit"
            title="search"
            className="btn btn-neutral rounded-s-none"
          >
            <img src={searchicon} alt="🔍" />
          </button>
        </form>
        <a
          href="http://github.com/Xeven777"
          target="_blank"
          title="Github"
          rel="noopener noreferrer"
        >
          <img src={github} alt="Github" />
        </a>
      </div>

      <div className="flex flex-col w-full p-2 my-5 max-w-3xl">
        <h1 className="text-3xl md:text-6xl font-bold">{word}</h1>
        <div className="flex flex-col">
          <p className="text-xl md:text-2xl poppins-light text-cyan-400 my-2">
            {meaning[0]?.phonetics[0]?.text
              ? meaning[0]?.phonetics[0]?.text
              : meaning[0]?.phonetics[1]?.text ||
                meaning[0]?.phonetics[2]?.text}
          </p>
        </div>
      </div>

      <div className="separate w-full" />

      {!loading ? (
        <div className="flex flex-col w-full p-2 my-5 max-w-3xl gap-4">
          {meaning[0]?.meanings.map((meaning, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-4xl font-semibold">
                {meaning.partOfSpeech} :
              </h2>

              {meaning.definitions.map((definition, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <p className="text-lg md:text-xl poppins-regular">
                    <span className="opacity-70 text-blue-400 text-sm">
                      {index + 1}
                    </span>
                    . {definition.definition}
                  </p>
                  {definition.example && (
                    <p className="text-base md:text-lg text-gray-400 italic">
                      Example: {definition.example}
                    </p>
                  )}

                  {definition.synonyms.length > 0 ? (
                    <div className="flex flex-col">
                      <p className="text-lg md:text-xl">Synonyms :</p>
                      <ul className=" list-inside list-disc pl-5 text-cyan-300">
                        {definition.synonyms.map((synonym, index) => (
                          <li key={index}>{synonym}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {definition.antonyms.length > 0 ? (
                    <div className="flex flex-col">
                      <p className="text-lg md:text-xl">Antonyms :</p>
                      <ul className="list-disc pl-5">
                        {definition.antonyms.map((antonym, index) => (
                          <li key={index}>{antonym}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="separate w-4/6 mx-auto mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-80 flex items-center justify-center">
          <span className="loading loading-infinity loading-lg" />
        </div>
      )}
    </div>
  );
}

export default App;