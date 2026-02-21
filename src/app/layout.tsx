import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anotações',
  description: 'Seu app de anotações pessoais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
