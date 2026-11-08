export const metadata = {
  title: 'Kubernetes 3-Tier Web App',
  description: 'Next.js Frontend with FastAPI and PostgreSQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}