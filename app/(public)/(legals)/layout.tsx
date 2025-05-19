export default function LegalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container">
      <div className="pt-16 md:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">{children}</div>
      </div>
    </main>
  );
}
