import { cn } from "@/lib/utils";

let reviews = [
  {
    name: "Aaliyah",
    email: "aaliyah.ng@example.org",
    body: "Wish there was an option to sort my items by date added.",
  },
  {
    name: "Carlos",
    email: "carlito89@fastmail.com",
    body: "Can you add a dark mode? My eyes get tired using the bright interface after a while.",
  },
  {
    name: "Fatima",
    email: "fatima_hassan@gmail.com",
    body: "I'm missing a way to export my data as CSV or PDF.",
  },
  {
    name: "Liam",
    email: "liam_o.conner@outlook.co.uk",
    body: "Sometimes notifications don't show up since the last update.",
  },
  {
    name: "Sophia",
    email: "sophialovescode@mail.com",
    body: "Syncing between devices is slow. Would appreciate an offline mode or faster sync.",
  },
  {
    name: "Raj",
    email: "raj.patel123@inbox.lv",
    body: "Got an error when uploading images, please support more file types.",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  name,
  body,
  email,
}: {
  name: string;
  body: string;
  email: string;
}) => {
  return (
    <figure className={cn("relative h-fit w-64 rounded-xl border px-4 py-3")}>
      <div className="flex flex-row items-center gap-2">
        <div className="text-muted-foreground ring-border flex size-8 items-center justify-center rounded-full ring ring-inset">
          {name.slice(0, 1)}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium">{name}</figcaption>
          <p className="text-muted-foreground text-xs font-medium">{email}</p>
        </div>
      </div>
      <blockquote className="mt-2 line-clamp-2 text-sm">{body}</blockquote>
    </figure>
  );
};

function ContactsMarquee() {
  return (
    <div className="relative flex size-full flex-col justify-center gap-2 overflow-hidden py-4">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.email} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.email} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-r to-25%" />
      <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-l to-25%" />
    </div>
  );
}

function Marquee({
  reverse,
  children,
  className,
  pauseOnHover,
}: {
  reverse?: boolean;
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex gap-2 [--duration:40s] [--gap:0.5rem]",
        className,
      )}
    >
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={cn(
              "animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)]",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]",
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export { ContactsMarquee };
