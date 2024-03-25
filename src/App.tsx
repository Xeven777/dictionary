import { useEffect, useRef, useState } from "react";
import searchicon from "./assets/search.svg";
import book from "./assets/book.svg";
import play from "./assets/play.svg";
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
  sourceUrls: string[];
}
function App() {
  const [word, setWord] = useState("");
  const [playing, setPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const handleClick = () => {
    if (playing) {
      setPlaying(false);
      audioRef.current?.pause();
    } else {
      setPlaying(true);
      audioRef.current?.play();
    }
  };
  useEffect(() => {
    if (audioSrc) {
      audioRef.current?.load();
    }
  }, [audioSrc]);
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
      setAudioSrc(
        data[0]?.phonetics[0]?.audio ||
          data[0]?.phonetics[1]?.audio ||
          data[0]?.phonetics[2]?.audio ||
          data[0]?.phonetics[3]?.audio ||
          data[0]?.phonetics[4]?.audio
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center py-4 px-2">
      <div className="flex justify-between w-full">
        <div className="btn">
          <img src={book} alt="Book" />
          <p className="text-lg hidden md:block">Dictionary</p>
        </div>
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
          className="btn btn-circle btn-neutral"
        >
          <img src={github} alt="Github" />
        </a>
      </div>

      <div className="flex flex-col w-full md:my-7 px-3 my-5 max-w-3xl">
        <h1 className="text-3xl md:text-6xl font-bold">
          {meaning.length !== 0 ? word : "Search anything"}
        </h1>
        <div className="flex justify-between md:pr-12 pr-2 items-center">
          <p className="text-xl md:text-2xl poppins-light text-cyan-400 my-2">
            {meaning[0]?.phonetics[0]?.text
              ? meaning[0]?.phonetics[0]?.text
              : meaning[0]?.phonetics[1]?.text ||
                meaning[0]?.phonetics[2]?.text}
          </p>
          {audioSrc !== "" && (
            <button
              type="button"
              title="music"
              onClick={handleClick}
              className="btn btn-circle btn-primary md:btn-lg"
            >
              <img src={play} alt="O" width={30} height={30} />
              <audio ref={audioRef}>
                <source src={audioSrc} type="audio/mp3" />
              </audio>
            </button>
          )}
        </div>
      </div>

      <div className="separate w-full" />

      {!loading ? (
        <div className="flex flex-col w-full p-2 my-5 max-w-3xl gap-4">
          {meaning.map((word) =>
            word.meanings.map((meaning, index) => (
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
            ))
          )}
          {meaning[0]?.sourceUrls[0] && (
            <p>
              Source :{" "}
              <a
                href={meaning[0].sourceUrls[0]}
                target="_blank"
                className="link link-primary"
              >
                {meaning[0].sourceUrls[0]}
              </a>
            </p>
          )}
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
