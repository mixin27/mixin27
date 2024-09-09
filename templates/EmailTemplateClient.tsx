import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface KoalaWelcomeEmailProps {
  name: string;
}

export const KoalaWelcomeEmail = ({ name }: KoalaWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          Thanks you for contacting us regarding software services. We
          appreciate your interest and would be happy to discuss how we can
          assit you with your project.
        </Text>
        <Text style={paragraph}>
          Could you please provide more details about your requirements, such as
          type of software you&apos;re looking for, the features you&apos;d like
          included, and any specific goals or deadlines? This will help us
          better understand your needs and propose an ideal solution.
        </Text>
        <Text style={paragraph}>
          Once we have this information, we can schedule a call or meeting to
          explore further.
        </Text>
        <Text style={paragraph}>Looking forward to hearing from you!</Text>
        {/* <Section style={btnContainer}>
          <Button style={button} href="https://getkoala.com">
            Get started
          </Button>
        </Section> */}
        <Text style={paragraph}>
          Best Regards,
          <br />
          Kyaw Zayar Tun
          <br />
          +95 9 799 967 189
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Mingaladon, Yangon, Myanmar</Text>
      </Container>
    </Body>
  </Html>
);

export default KoalaWelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
