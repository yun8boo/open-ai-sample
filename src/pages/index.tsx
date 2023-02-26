import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          OpenAI Sample
        </h1>
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          {!loading && (
            <button onClick={(e) => generateBio(e)}>
              generate
            </button>
          )}
          {loading && (
            <button disabled>
              loading
            </button>
          )}
        </div>
        <hr />
      {generatedBios && (
        <>
          <div>
            <h2>
              generated
            </h2>
          </div>
          <div>
            {generatedBios
              .substring(generatedBios.indexOf("1") + 3)
              .split("2.")
              .map((generatedBio) => {
                return (
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(generatedBio);
                    }}
                    key={generatedBio}
                  >
                    <p>{generatedBio}</p>
                  </div>
                );
              })}
          </div>
        </>
      )}
      </main>
    </div>
  );
};
