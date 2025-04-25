import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import dedent from "dedent";
import {
  type ShikiTransformer,
  type ThemeRegistration,
  createHighlighter,
} from "shiki";

import { cn } from "@/lib/utils";

const theme: ThemeRegistration = {
  fg: "var(--color-white)",
  bg: "var(--color-neutral-950)",
  type: "dark",
  name: "remark",
  settings: [
    {
      scope: [
        "operator",
        "variable",
        "variable.other",
        "variable.parameter",
        "entity.name.function",
      ],
      settings: {
        foreground: "var(--color-white)",
      },
    },
    {
      scope: [
        "type",
        "string",
        "comment",
        "keyword",
        "constant",
        "function",
        "storage.type",
        "string.template",
        "storage.modifier",
        "entity.name.type",
        "constant.numeric",
        "entity.name.class",
        "constant.character",
        "storage.type.async",
        "storage.type.export",
        "storage.type.default",
        "storage.type.function",
        "punctuation.definition.comment",
      ],
      settings: {
        foreground: "var(--color-neutral-400)",
      },
    },
  ],
};

const highlighter = await createHighlighter({
  langs: ["ts", "tsx", "vue", "sh"],
  themes: [theme],
});

function ts(strings: TemplateStringsArray, ...args: string[]) {
  return { lang: "ts", code: dedent(strings, ...args) };
}

function tsx(strings: TemplateStringsArray, ...args: string[]) {
  return { lang: "tsx", code: dedent(strings, ...args) };
}

function CodeExample({
  example,
  unstyled = false,
  filename,
  className,
  showLineNumbers = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  example: { code: string; lang: string };
  filename?: string;
  unstyled?: boolean;
  showLineNumbers?: boolean;
}) {
  return (
    <div className={cn("bg-background rounded-xl", className)} {...props}>
      <div className="dark:inset-ring-border rounded-xl p-1 text-sm dark:inset-ring">
        {filename && (
          <div className="dark text-muted-foreground px-3 pt-1 pb-1.5 text-xs">
            {filename}
          </div>
        )}
        <HighlightedCode example={example} showLineNumbers={showLineNumbers} />
      </div>
    </div>
  );
}

function linesToDiv(): ShikiTransformer {
  return {
    name: "lines-to-div",
    line(node) {
      node.tagName = "div";
    },
  };
}

function HighlightedCode({
  example,
  showLineNumbers = false,
  className,
}: React.HTMLAttributes<HTMLDivElement> & {
  example: { code: string; lang: string };
  showLineNumbers?: boolean;
}) {
  const output = highlighter
    .codeToHtml(example.code, {
      lang: example.lang,
      theme,
      transformers: [
        transformerNotationHighlight({
          classActiveLine:
            "-mx-5 pl-[calc(var(--spacing)*5-2px)] border-l-2 pr-5 border-white bg-white/10",
        }),
        transformerNotationDiff({
          classLineAdd:
            "relative -mx-5 border-l-4 border-teal-400 bg-teal-300/15 pr-5 pl-8 before:absolute before:left-4 before:text-teal-400 before:content-['+']",
          classLineRemove:
            "relative -mx-5 border-l-4 border-red-400 bg-red-300/15 pr-5 pl-8 before:absolute before:left-4 before:text-red-400 before:content-['-']",
          classActivePre: "[:where(&_.line)]:pl-4",
        }),
        transformerNotationWordHighlight({
          classActiveWord:
            "highlighted-word relative before:absolute before:-inset-x-0.5 before:-inset-y-0.25 before:-z-10 before:block before:rounded-sm before:bg-[lab(19.93_-1.66_-9.7)] [.highlighted-word_+_&]:before:rounded-l-none",
        }),
        linesToDiv(),
      ],
    })
    .replaceAll("\n", "");

  return (
    <div
      className={cn(
        "dark:*:inset-ring-border *:bg-background/2.5! *:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:p-5 *:inset-ring *:focus-visible:outline-none **:[.line]:isolate **:[.line]:not-last:min-h-[1lh]",
        showLineNumbers &&
          "[&_.line]:before:text-muted-foreground/40 [&_.line]:ml-9 [&_.line]:[counter-increment:line] [&_.line]:before:absolute [&_.line]:before:left-0 [&_.line]:before:w-6 [&_.line]:before:text-right [&_.line]:before:font-mono [&_.line]:before:content-[counter(line)] [&_.line]:before:select-none max-sm:[&_.line]:ml-0 max-sm:[&_.line]:before:hidden [&_code]:relative [&_code]:[counter-reset:line]",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized by shiki
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
}

export { CodeExample, HighlightedCode, ts, tsx };
