import Image from "next/image";

export function QRISDisplay({ qrisImage, amount }: { qrisImage: string; amount: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800">
        <Image
          src={qrisImage}
          alt="QRIS Payment Code"
          width={260}
          height={260}
          unoptimized
          className="h-64 w-64 object-contain"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Scan with any QRIS-supported e-wallet or banking app
      </p>
    </div>
  );
}
