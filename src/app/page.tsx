"use client";

import { useEffect, useState } from "react";

type Runbook = {
  id: number;
  title: string;
  symptom: string;
  action: string;
  tags: string[];
  createdAt: string;
};

export default function Home() {
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [form, setForm] = useState({
    title: "",
    symptom: "",
    action: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/runbooks");
    setRunbooks(await res.json());
  }

  useEffect(() => {
    let cancelled = false;
  
    async function load() {
      const res = await fetch("/api/runbooks");
      const data = await res.json();
      if (!cancelled) {
        setRunbooks(data);
      }
    }
  
    load();
  
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
  
    await fetch("/api/runbooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
  
    setForm({ title: "", symptom: "", action: "", tags: "" });
  
    // 重新抓資料（原本是 await load()，現在自己抓）
    const res = await fetch("/api/runbooks");
    setRunbooks(await res.json());
  
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">My Runbooks</h1>

      {/* 新增表單 */}
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
        <input
          className="border p-2 w-full rounded"
          placeholder="標題（例如：EC2 CPU 100%）"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="症狀"
          value={form.symptom}
          onChange={(e) => setForm({ ...form, symptom: e.target.value })}
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="處理動作"
          value={form.action}
          onChange={(e) => setForm({ ...form, action: e.target.value })}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="標籤（用逗號分隔，例如 aws,network）"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "新增中..." : "新增 Runbook"}
        </button>
      </form>

      {/* 列表 */}
      <div className="space-y-4">
        {runbooks.length === 0 && (
          <p className="text-gray-500">目前沒有 Runbook</p>
        )}
        {runbooks.map((rb) => (
          <div key={rb.id} className="border p-4 rounded space-y-1">
            <h2 className="font-semibold text-lg">{rb.title}</h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">症狀：</span>
              {rb.symptom}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">處理：</span>
              {rb.action}
            </p>
            <div className="flex gap-2 pt-1">
              {rb.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}