export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <aside>aside</aside>

      <main>{children}</main>
    </div>
  );
}
