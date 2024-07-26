export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <aside>aside</aside>

      <main>{children}</main>
    </div>
  );
}
