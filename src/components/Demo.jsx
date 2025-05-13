import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import loader from "../assets/loader.svg";
import "../index.css";
import { useLazyGetSummaryQuery } from "../services/article";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Demo = () => {
  const [article, setArticle] = useState({ url: "", summary: "" });
  const [allArticles, setAllArticles] = useState([]);
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [mode, setMode] = useState("url");
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const cleanedSummary = removeNumbering(data.summary);
      const newArticle = { ...article, summary: cleanedSummary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const removeNumbering = (text) => {
    return text.replace(/^\d+\.\s+|^-+\s+/gm, "");
  };

  const highlightImportantWords = (text) => {
    const importantWords = ["FoundIt", "QR code", "reward system", "Administrative", "branding", "centralized reporting"];
    const regex = new RegExp(`\\b(${importantWords.join("|")})\\b`, "gi");

    return text.split(regex).map((part, index) => {
      if (importantWords.includes(part)) {
        return (
          <span key={index} className="highlight">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const exportSummary = (summary, type) => {
    const blob = new Blob(
      [type === "txt" ? summary : `<html><body><p>${summary}</p></body></html>`],
      { type: type === "txt" ? "text/plain" : "text/html" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `summary.${type}`;
    a.click();
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        const typedArray = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          fullText += pageText + " ";
        }

        const cleanedSummary = summarizeText(fullText);
        const newArticle = { url: pdfFile.name, summary: cleanedSummary };
        const updatedAllArticles = [newArticle, ...allArticles];

        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      } catch (error) {
        console.error("Error processing PDF:", error);
        alert("An error occurred while processing the PDF.");
      }
    };

    fileReader.readAsArrayBuffer(pdfFile);
  };

  const summarizeText = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const wordFreq = {};

    text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).forEach((word) => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const ranked = sentences.map((sentence) => {
      const words = sentence.toLowerCase().split(/\s+/);
      const score = words.reduce((acc, word) => acc + (wordFreq[word] || 0), 0);
      return { sentence, score };
    });

    ranked.sort((a, b) => b.score - a.score);
    const topSentences = ranked.slice(0, 5).map((s) => s.sentence.trim());
    return topSentences.join(" ");
  };

  return (
    <section className="mt-16 w-full max-w-xl mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${mode === "url" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
          onClick={() => {
            setMode("url");
            setArticle({ url: "", summary: "" });
          }}
        >
          Summarize URL
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === "pdf" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
          onClick={() => {
            setMode("pdf");
            setArticle({ url: "", summary: "" });
          }}>
          Summarize PDF
        </button>
      </div>

      {mode === "url" ? (
        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 w-full max-w-md mx-auto mb-6">
          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="flex-1 p-3 bg-transparent border border-gray-600 text-white rounded-md"
          />
          <button
            type="submit"
            className="backdrop-blur-lg bg-white bg-opacity-10 rounded-xl px-6 py-2 transition-all duration-300 ease-in-out hover:bg-opacity-20 hover:scale-105 active:scale-95 active:bg-opacity-30 ">
            Submit
          </button>
        </form>


      ) : (
        <form onSubmit={handlePdfSubmit} className="flex items-center justify-center gap-4 w-full max-w-md mx-auto mb-6">
        <label className="flex-1 p-3 bg-transparent border border-gray-600 text-white rounded-md">
          <input
        type="file"
        accept=".pdf"
        onChange={(e) => setPdfFile(e.target.files[0])}
        required
        className="hidden"
    />
    {pdfFile ? pdfFile.name : "Upload PDF"}
  </label>

  <button
    type="submit"
    className="backdrop-blur-lg bg-white bg-opacity-10 rounded-xl px-6 py-2 transition-all duration-300 ease-in-out hover:bg-opacity-20 hover:scale-105 active:scale-95 active:bg-opacity-30"
  >
    Submit
  </button>
</form>

      )}

      <div className="my-10">
        {isFetching ? (
          <img src={loader} alt="Loading..." className="w-20 h-20 mx-auto" />
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error?.data?.error}</p>
        ) : article.summary && (
          <div className="flex flex-col gap-3 backdrop-blur-lg bg-opacity-10 rounded-xl p-7 mt-10">
            <h2 className="font-inter text-white-500 text-center font-bold text-[3rem]">
              Summary
            </h2>
            <div className="summary-box px-11 pb-10">
              <p className="w-full text-white text-justify text-lg">
                {highlightImportantWords(article.summary)}
              </p>

              <div className="flex mt-4 gap-4">
                <button onClick={() => navigator.clipboard.writeText(article.summary)}>
                  <CopyIcon className="w-6 h-6 text-white-500" />
                </button>
                <button onClick={() => exportSummary(article.summary, "html")}>
                  <DownloadIcon className="w-6 h-6 text-white-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const CopyIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 8h8a2 2 0 002-2V8a2 2 0 00-2-2h-2m-6 8v4a2 2 0 002 2h4a2 2 0 002-2v-4" />
  </svg>
);
CopyIcon.propTypes = {
  className: PropTypes.string,
};

export const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
  </svg>
);
DownloadIcon.propTypes = {
  className: PropTypes.string,
};

export default Demo;

