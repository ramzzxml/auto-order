import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="mb-2 text-6xl">🔍</p>
      <h1 className="mb-2 text-2xl font-bold">Not Found</h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        The page or resource you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
