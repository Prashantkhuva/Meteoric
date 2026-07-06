import { Document, Page, View, Text, Image, Link, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, fontSizes, spacing } from "./theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    padding: spacing.page,
    paddingTop: 0,
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.text,
    lineHeight: 1.5,
  },
  topBar: {
    height: 4,
    backgroundColor: colors.accent,
    marginBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.block,
  },
  logoCol: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 26,
  },
  metaCol: {
    alignItems: "flex-end",
    maxWidth: "60%",
  },
  title: {
    fontSize: fontSizes.h1,
    fontFamily: fonts.bold,
    color: colors.accent,
    letterSpacing: -0.5,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 3,
    marginTop: spacing.tight,
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  statusDraft: {
    backgroundColor: colors.accentMuted,
    color: colors.textMuted,
  },
  statusSent: {
    backgroundColor: colors.accentMuted,
    color: colors.accent,
  },
  dateRow: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacing.tight,
    lineHeight: 1.6,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.block,
  },
  preparedSection: {
    marginBottom: spacing.section,
  },
  preparedLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 2,
  },
  preparedAccent: {
    width: 24,
    height: 2,
    backgroundColor: colors.accent,
    marginBottom: spacing.element,
  },
  toName: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 3,
  },
  toContact: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  contentBlock: {
    marginBottom: spacing.section,
  },
  paragraph: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.7,
    marginBottom: spacing.element,
  },
  heading1: {
    fontSize: fontSizes.h2,
    fontFamily: fonts.bold,
    color: colors.accent,
    marginTop: spacing.block,
    marginBottom: spacing.element,
    letterSpacing: -0.2,
  },
  heading2: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: spacing.block,
    marginBottom: spacing.element,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.6,
  },
  bullet: {
    width: 14,
    fontSize: fontSizes.body,
    color: colors.accent,
  },
  link: {
    color: colors.accent,
    textDecoration: "underline",
  },
  footerSection: {
    marginTop: spacing.section,
    paddingTop: spacing.block,
    borderTop: `1px solid ${colors.border}`,
  },
  footerLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 2,
  },
  footerAccent: {
    width: 24,
    height: 2,
    backgroundColor: colors.accent,
    marginBottom: spacing.element,
  },
  footerText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.element,
    lineHeight: 1.6,
  },
  contactBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginTop: spacing.section,
    paddingTop: spacing.block,
    borderTop: `1px solid ${colors.border}`,
  },
  contactItem: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 1.5,
  },
});

function esc(text) {
  if (typeof text !== "string") return String(text || "");
  return text;
}

function ProposalContentNode({ node }) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      return (
        <Text style={styles.paragraph}>
          <InlineContent content={node.content} />
        </Text>
      );

    case "heading": {
      const level = node.attrs?.level || 2;
      return (
        <Text style={level === 1 ? styles.heading1 : styles.heading2}>
          <InlineContent content={node.content} />
        </Text>
      );
    }

    case "bulletList":
      return (node.content || []).map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.bullet}>{"\u25E6"}</Text>
          <Text style={{ flex: 1 }}>
            <InlineContent content={item.content} />
          </Text>
        </View>
      ));

    case "orderedList":
      return (node.content || []).map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.bullet}>{i + 1}.</Text>
          <Text style={{ flex: 1 }}>
            <InlineContent content={item.content} />
          </Text>
        </View>
      ));

    default:
      if (node.content && Array.isArray(node.content)) {
        return node.content.map((child, i) => (
          <ProposalContentNode key={i} node={child} />
        ));
      }
      return null;
  }
}

function InlineContent({ content }) {
  if (!content || !Array.isArray(content)) return null;
  return content.map((node, i) => {
    if (node.type === "hardBreak") return "\n";
    if (node.type === "text") {
      let text = esc(node.text);
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === "bold") text = <Text key={i} style={{ fontFamily: fonts.bold, color: colors.text }}>{text}</Text>;
          else if (mark.type === "italic") text = <Text key={i} style={{ fontFamily: fonts.oblique }}>{text}</Text>;
          else if (mark.type === "underline") text = <Text key={i} style={{ textDecoration: "underline" }}>{text}</Text>;
          else if (mark.type === "link") {
            const href = mark.attrs?.href || "";
            const safe = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") ? href : "";
            text = <Link key={i} src={safe} style={styles.link}>{text}</Link>;
          }
        }
      }
      return <Text key={i}>{text}</Text>;
    }
    return null;
  });
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ status }) {
  const style = status === "sent" ? styles.statusSent : styles.statusDraft;
  const label = status === "sent" ? "Sent" : status === "draft" ? "Draft" : status;
  return (
    <View style={[styles.statusPill, style]}>
      <Text style={[styles.statusText, { color: style.color }]}>
        {label}
      </Text>
    </View>
  );
}

export default function ProposalPDF({ proposal, lead, logo }) {
  const content = proposal.content;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <View style={styles.logoCol}>
            {logo && <Image style={styles.logo} src={logo} />}
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.title}>{esc(proposal.title)}</Text>
            <StatusBadge status={proposal.status} />
            {proposal.created_at && (
              <Text style={styles.dateRow}>Created: {formatDate(proposal.created_at)}</Text>
            )}
            {proposal.sent_at && (
              <Text style={styles.dateRow}>Sent: {formatDate(proposal.sent_at)}</Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.preparedSection}>
          <Text style={styles.preparedLabel}>Prepared for</Text>
          <View style={styles.preparedAccent} />
          {lead && (
            <>
              <Text style={styles.toName}>{esc(lead.name)}</Text>
              {lead.email && <Text style={styles.toContact}>{esc(lead.email)}</Text>}
            </>
          )}
        </View>

        <View style={styles.contentBlock}>
          {content && typeof content === "object" && content.type === "doc" && content.content
            ? content.content.map((node, i) => <ProposalContentNode key={i} node={node} />)
            : typeof content === "string" && (
                <Text style={styles.paragraph}>{esc(content)}</Text>
              )}
        </View>

        {proposal.timeline && (
          <View style={styles.footerSection}>
            <Text style={styles.footerLabel}>Timeline</Text>
            <View style={styles.footerAccent} />
            <Text style={styles.footerText}>{esc(proposal.timeline)}</Text>
          </View>
        )}

        {proposal.terms && (
          <View style={styles.footerSection}>
            <Text style={styles.footerLabel}>Terms & Conditions</Text>
            <View style={styles.footerAccent} />
            <Text style={styles.footerText}>{esc(proposal.terms)}</Text>
          </View>
        )}

        <View style={styles.contactBar}>
          <Text style={styles.contactItem}>Meteoric</Text>
          <Text style={styles.contactItem}>contact@withmeteoric.com</Text>
          <Text style={styles.contactItem}>withmeteoric.com</Text>
        </View>
      </Page>
    </Document>
  );
}
