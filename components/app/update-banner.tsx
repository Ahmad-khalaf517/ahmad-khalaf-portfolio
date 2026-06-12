// components/UpdateBanner.tsx
export function UpdateBanner({
  onReload,
}: {
  onReload: () => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-xl shadow-lg">
      <p className="text-sm">New version available</p>
      <button
        className="mt-2 px-3 py-1 bg-white text-black rounded"
        onClick={onReload}
      >
        Reload
      </button>
    </div>
  );
}