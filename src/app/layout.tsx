import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Catchmail Automation Hub - Enterprise Grade Multi-Tenant SaaS',
  description: 'Automated high-throughput inbox processing engines and instant PayQRIS accounting settlements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
