"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

// おみくじデータの取得関数
async function fetchFortune() {
  try {
    const response = await fetch("https://sheetdb.io/api/v1/5m1yljw92cqfp");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("エラー:", error);
  }
}

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fortuneData, setFortuneData] = useState<fortuneData[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [bgColor, setBgColor] = useState("bg-green-100");


  useEffect(() => {
    setAudio(new Audio("/garagara.mp3"));
  }, []);


  const playSound = () => {
    if (!audio) return; // 🔹 audioがnullの時は何もしない
    audio.currentTime = 0;
    audio.play().catch((error) => console.log("音声再生エラー:", error));
  };

  useEffect(() => {
    async function getData() {
      const data = await fetchFortune();
      setFortuneData(data);
    }
    getData();
  }, []);

  useEffect(() => {
    document.body.className = bgColor;
    return () => {
      document.body.className = "";
    };
  }, [bgColor]);

  const changeBgColor = () => {
    const colors = ["bg-green-100", "bg-yellow-100", "bg-blue-100"];
    const currentIndex = colors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBgColor(colors[nextIndex]);
  };

  type fortuneData = {
    luck: string;
  };

  const drawOmikuji = () => {
    playSound();
    const randomIndex: number = Math.floor(Math.random() * fortuneData.length);
    setResult(fortuneData[randomIndex].luck);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div
        className={`flex flex-col items-center justify-center min-h-screen max-w-[430px] mx-auto ${bgColor} p-4 relative`}
      >
        <button
          onClick={changeBgColor}
          className="absolute top-4 right-4 px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800"
        >
          背景色を変更
        </button>

        <h1 className="text-4xl font-bold mb-6 text-center text-black">
          おみくじゲーム
        </h1>

        <div
          className="w-full max-w-[280px] cursor-pointer"
          onClick={playSound}
        >
          <Image
            src="/omijikuji2.png"
            alt="おみくじの画像"
            width={300}
            height={300}
            className="rounded-lg w-full"
          />
        </div>

        <button
          onClick={drawOmikuji}
          className="px-8 py-4 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-300 transition text-lg mt-6"
        >
          おみくじを引く
        </button>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[280px]">
              <h2 className="text-2xl font-bold text-gray-700">
                おみくじの結果
              </h2>
              <p className="mt-4 text-2xl font-semibold text-red-500">
                {result}
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  閉じる
                </button>
                <Link href={`/detail?luck=${result}`}>
                  <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                    詳細
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}