export function Footer({ storeName }: { storeName: string }) {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <p>
        &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
      </p>
    </footer>
  );
}
