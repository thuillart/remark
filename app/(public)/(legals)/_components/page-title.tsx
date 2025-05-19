import { format } from "date-fns";

export function PageTitle({
  title,
  updatedAt,
}: {
  title: string;
  updatedAt: Date;
}) {
  return (
    <>
      <section className="pt-9 pb-2 md:pt-20 md:pb-12">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl/12 font-semibold tracking-tighter md:text-5xl">
            {title}
          </h1>
          <p className="text-muted-foreground">
            Last updated on {format(updatedAt, "MMMM d, yyyy")}.
          </p>
        </div>
      </section>
      <hr className="mb-12 md:mb-18" />
    </>
  );
}
