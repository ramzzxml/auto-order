"use client";

import { useEffect, useState } from "react";

interface SettingsForm {
  storeName: string;
  storeLogo: string;
  gatewayApiKey: string;
  gatewayBaseUrl: string;
}

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SettingsForm>({
    storeName: "",
    storeLogo: "",
    gatewayApiKey: "",
    gatewayBaseUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setValues({
        storeName: data.settings?.storeName || "",
        storeLogo: data.settings?.storeLogo || "",
        gatewayApiKey: data.settings?.gatewayApiKey || "",
        gatewayBaseUrl: data.settings?.gatewayBaseUrl || ""
      });
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Store Name</label>
          <input
            required
            className="input"
            value={values.storeName}
            onChange={(e) => setValues((v) => ({ ...v, storeName: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Store Logo URL</label>
          <input
            type="url"
            className="input"
            placeholder="https://..."
            value={values.storeLogo}
            onChange={(e) => setValues((v) => ({ ...v, storeLogo: e.target.value }))}
          />
        </div>

        <hr className="border-gray-200 dark:border-gray-800" />

        <div>
          <label className="label">Payment Gateway Base URL</label>
          <input
            type="url"
            className="input"
            placeholder="https://payqris.web.id"
            value={values.gatewayBaseUrl}
            onChange={(e) => setValues((v) => ({ ...v, gatewayBaseUrl: e.target.value }))}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave blank to use the PAYMENT_GATEWAY_BASE_URL environment variable.
          </p>
        </div>
        <div>
          <label className="label">Payment Gateway API Key</label>
          <input
            type="password"
            className="input"
            placeholder="•••••••••••••"
            value={values.gatewayApiKey}
            onChange={(e) => setValues((v) => ({ ...v, gatewayApiKey: e.target.value }))}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave blank to use the PAYMENT_GATEWAY_API_KEY environment variable. Setting a
            value here overrides it and is stored in the database.
          </p>
        </div>

        {message && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
