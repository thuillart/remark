import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function UsageSkeleton() {
  return (
    <main className="container">
      {["1", "2"].map((key) => (
        <UsageCard
          key={key}
          title={key === "1" ? "External" : "Internal"}
          description={
            key === "1"
              ? "Integrate feedback into your app using the ${APP_NAME} API."
              : "Know who's behind the feedback and segment them."
          }
          limits={
            key === "1"
              ? [
                  {
                    title: "Monthly limit",
                  },
                  {
                    title: "Daily limit",
                  },
                ]
              : [
                  {
                    title: "Contacts limit",
                  },
                  {
                    title: "Segments limit",
                  },
                ]
          }
        />
      ))}
    </main>
  );
}

function UsageCard({ title, limits, description }) {
  return (
    <div className="flex flex-col border-slate-4 border-b py-4 md:flex-row md:pt-8 md:pb-16">
      <div className="flex w-full justify-between md:block md:w-1/2">
        <h2 className="mb-1 font-bold text-xl tracking-tight">{title}</h2>
        <span className="mb-4 hidden text-muted-foreground text-sm md:block md:w-1/2">
          {description}
        </span>
        <Button size="sm" loading>
          Upgrade
        </Button>
      </div>
      <div className="w-full md:w-1/2">
        <Skeleton className="mb-2 h-4 w-10" />
        <div className="relative w-full overflow-x-auto overflow-y-hidden">
          <table className="m-0 mb-2 w-max min-w-full border-separate border-spacing-0 border-none p-0 py-4 text-left md:w-full">
            <tbody>
              {limits.map((limit) => (
                <tr key={limit.title}>
                  <td className="h-10 w-[32px] overflow-hidden text-ellipsis whitespace-nowrap border-b px-0 text-center text-sm">
                    <svg
                      width="22"
                      height="22"
                      className="flip -mt-[1px] rotate-180"
                    >
                      <title>Usage</title>
                      <circle
                        r={8}
                        cx={11}
                        cy={11}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={3}
                        className="text-muted"
                      />
                    </svg>
                  </td>
                  <td className="h-10 w-3/5 overflow-hidden text-ellipsis whitespace-nowrap border-b px-0 py-3.5 text-sm">
                    {limit.title}
                  </td>
                  <td className="h-10 overflow-hidden text-ellipsis whitespace-nowrap border-b px-0 text-right text-sm">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
