import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function VerifyEmail({
  url,
  firstName,
}: { url: string; firstName: string }) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Preview>Verify your email address</Preview>
          <Container className="mx-auto py-5 pb-12">
            <Text className="text-base/relaxed">Hey {firstName} 👋,</Text>

            <Text className="text-base/relaxed">
              Please verify your email - click the button below and we'll do it
              for you.
            </Text>

            <Section className="text-center">
              <Button
                href={url}
                className="block rounded bg-neutral-950 px-3 py-3 text-center text-base text-neutral-200 no-underline"
              >
                Get started
              </Button>
            </Section>

            <Text className="text-base/relaxed ">
              This link will only be valid for the next 5 minutes. If it doesn't
              work, you can copy/paste it into your browser:
            </Text>

            <Text className="rounded bg-neutral-50 px-1 py-px font-bold font-mono text-neutral-700 text-xl tracking-tight">
              {url}
            </Text>

            <Hr className="my-5 border-neutral-200" />

            <Text className="text-base/relaxed">
              Best,
              <br />
              The Nucleon team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
