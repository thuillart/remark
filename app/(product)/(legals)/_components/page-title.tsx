export function PageTitle({ title }: { title: string }) {
  return (
    <>
      <section className="pt-20 pb-4 md:pt-38 md:pb-18">
        <h1 className="text-4xl/12 font-semibold tracking-tighter md:text-5xl">
          {title}
        </h1>
      </section>
      <hr className="mb-12 md:mb-18" />
    </>
  );
}
