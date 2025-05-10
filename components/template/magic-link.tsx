import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function MagicLinkTemplate({ url }: { url: string }) {
  return (
    <Html className="antialiased">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Preview>Your magic link</Preview>

          <Container className="mx-auto py-5 pb-12">
            <Heading className="my-4 pt-4 text-2xl/snug font-normal tracking-tight text-neutral-700">
              Your magic link
            </Heading>

            <Section className="py-7">
              <Button
                href={url}
                className="block rounded bg-neutral-900 px-6 py-3 text-center text-base/4 font-semibold text-neutral-50 no-underline"
              >
                Login
              </Button>
            </Section>

            <Text className="text-base/snug text-neutral-600">
              This link and code will only be valid for the next 5 minutes. If
              you didn&apos;t request this, you can safely ignore this email.
            </Text>

            <Hr className="mt-10 mb-6 border-neutral-200" />

            <Text className="text-sm/4 text-neutral-500">Nucleon</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
