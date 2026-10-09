import { Html, Preview, Body, Container, Text, Hr, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import {
  page,
  container,
  eyebrow,
  greeting,
  paragraph,
  strong,
  label,
  value,
  divider,
  inset,
  hr,
  closing,
  signoff,
  footer,
  link,
} from "./theme";
import type { CSSProperties } from "react";

interface FollowUpReminderProps {
  leadName?: string | null;
  company?: string | null;
  when: string;
  minutes: number;
  note?: string | null;
}

const box: CSSProperties = { ...inset, margin: "20px 0" };
const boxLabel: CSSProperties = { ...label, margin: "0 0 4px 0" };
const boxValue: CSSProperties = { ...value, margin: "0 0 12px 0" };

export default function FollowUpReminder({
  leadName,
  company,
  when,
  minutes,
  note,
}: FollowUpReminderProps) {
  return (
    <Html>
      <EmailHead />
      <Preview>
        {`Follow-up with ${leadName || "a lead"} in ${minutes} minutes`}
      </Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Follow-up" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Lead follow-up reminder</Text>
          <Text style={greeting}>Reminder:</Text>
          <Text style={paragraph}>
            Follow-up with{" "}
            <strong style={strong}>{leadName || "this lead"}</strong>
            {company ? ` (${company})` : ""} is in{" "}
            <strong style={strong}>{`${minutes} minutes`}</strong>.
          </Text>
          <div className="email-inset" bgcolor="#fafaf7" style={box}>
            <Text style={boxLabel}>Scheduled</Text>
            <Text style={{ ...boxValue, marginBottom: 0 }}>{when}</Text>
            {note && (
              <>
                <div style={divider} />
                <Text style={boxLabel}>Note</Text>
                <Text style={{ ...boxValue, marginBottom: 0 }}>{note}</Text>
              </>
            )}
          </div>
          <Hr style={hr} />
          <Text style={closing}>
            Timezone: IST (Asia/Kolkata). This reminder was sent automatically.
          </Text>
          <Text style={signoff}>Meteoric Admin</Text>
          <Text style={footer}>
            <Link href="https://withmeteoric.com" style={link}>
              withmeteoric.com
            </Link>{" "}
            · Web development &amp; SaaS agency
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
