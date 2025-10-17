
export default function ContentsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container mx-auto text-base">
        {children}
      </body>
    </html>
  );
}
