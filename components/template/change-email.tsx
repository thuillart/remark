import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function ChangeEmailTemplate({
  url,
  email,
  newEmail,
}: {
  url: string;
  email: string;
  newEmail: string;
}) {
  return (
    <Html className="antialiased">
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Preview>Confirm your new email address</Preview>

          <Container className="mx-auto mb-16 bg-white pt-5 pb-12">
            <Section className="px-12">
              <Img
                src="https://vmi38b7ue8.ufs.sh/f/0N7fV27pufGcHhRRROL9CEWzkdhuPNYgIXGo1OVxJ8Fbp5tA"
                alt="Nucleon"
                width={20}
                height={20}
              />

              <Hr className="my-5 border-slate-200" />

              <Text className="my-4 text-left text-base/6 text-slate-600">
                Hello,
              </Text>

              <Text className="my-4 whitespace-pre-line text-left text-base/6 text-slate-600">
                Someone's trying to change your email to{" "}
                <strong className="font-semibold text-slate-600">
                  {newEmail}
                </strong>
                . If this was you, you can accept the change here:
              </Text>

              <Button
                href={url}
                className="block rounded-md bg-slate-800 p-2.5 text-center font-semibold text-base/none text-white no-underline"
              >
                Change my email
              </Button>

              <Text className="my-4 whitespace-pre-line text-left text-base/6 text-slate-600">
                If you don't want to change your email or didn't request this,
                just ignore and delete this message.
              </Text>

              <Text className="my-4 text-left text-base/6 text-slate-600">
                Happy building!
              </Text>

              <Hr className="my-5 border-slate-200" />

              <Text className="text-slate-500 text-xs">
                This email was sent to{" "}
                <strong className="font-medium text-slate-500">{email}</strong>.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
