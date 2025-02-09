"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

type FortuneData = {
  id: string;
  luck: string;
  colour: string;
  message: string;
};

export default function Detail() {
  const [fortuneDetail, setFortuneDetail] = useState<FortuneData | null>(null);

  useEffect(() => {
    async function fetchFortuneDetail() {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/5m1yljw92cqfp");
        const data = await response.json();

        // URLからluckパラメータを取得
        const params = new URLSearchParams(window.location.search);
        const luck = params.get("luck");

     
        const detail = data.find((item: FortuneData) => item.luck === luck);
        setFortuneDetail(detail || null);
      } catch (error) {
        console.error("エラー:", error);
      }
    }

    fetchFortuneDetail();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen max-w-[430px] mx-auto bg-green-100 p-4">
        <h1 className="text-3xl font-bold mb-8 text-black">おみくじ詳細</h1>

        {fortuneDetail ? (
          <div className="bg-white p-6 rounded-lg shadow-lg w-[280px]">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: fortuneDetail.colour }}
            >
              {fortuneDetail.luck}
            </h2>
            <p className="text-lg mb-6 text-black">{fortuneDetail.message}</p>
          </div>
        ) : (
          <p className="text-3xl text-black">読み込み中...</p>
        )}

        <Link href="/">
          <button className="mt-8 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
