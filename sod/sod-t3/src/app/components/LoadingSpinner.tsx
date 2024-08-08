export default function LoadingSpinner() {
  return (
    <div className="flex h-32 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
    </div>
  );
}
