
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FORWARD LEGAL | Professional Will Drafting',
  description: 'Digital intake platform for Forward Legal. Information provided is forwarded to our lawyers who will prepare a draft for your review.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Work+Sans:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
