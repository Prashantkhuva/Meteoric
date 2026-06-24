import { Document, Page, View, Text, Image, Link, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, fontSizes, spacing } from "./theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    padding: spacing.page,
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.section,
    paddingBottom: spacing.block,
    borderBottom: `1px solid ${colors.border}`,
  },
  logo: {
    width: 120,
    height: 24,
  },
  meta: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: fontSizes.h1,
    fontWeight: 700,
    color: "#fff",
  },
  statusBadge: {
    fontSize: fontSizes.small,
    fontWeight: 700,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginTop: spacing.tight,
  },
  sentStatus: {
    color: colors.success,
  },
  dateRow: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacing.tight,
  },
  toSection: {
    marginBottom: spacing.section,
  },
  toLabel: {
    fontSize: fontSizes.label,
    fontWeight: 700,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 1,
  },
  toName: {
    fontSize: fontSizes.body,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 2,
  },
  toContact: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  contentBlock: {
    marginBottom: spacing.section,
  },
  paragraph: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: spacing.element,
  },
  heading1: {
    fontSize: fontSizes.h2,
    fontWeight: 700,
    color: "#fff",
    marginTop: spacing.block,
    marginBottom: spacing.element,
  },
  heading2: {
    fontSize: fontSizes.h3,
    fontWeight: 600,
    color: "#fff",
    marginTop: spacing.block,
    marginBottom: spacing.element,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  bullet: {
    width: 16,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
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
    fontWeight: 700,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 1,
  },
  footerText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
    marginBottom: spacing.element,
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
          <Text style={styles.bullet}>{"\u2022"}</Text>
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
          if (mark.type === "bold") text = <Text key={i} style={{ fontFamily: fonts.bold }}>{text}</Text>;
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
  const statusText = status === "sent" ? "Sent" : status === "draft" ? "Draft" : status;
  return (
    <Text style={[styles.statusBadge, status === "sent" && styles.sentStatus]}>
      {statusText}
    </Text>
  );
}

export default function ProposalPDF({ proposal, lead }) {
  const content = proposal.content;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/meteoric-logo.png" />
          <View style={styles.meta}>
            <Text style={styles.title}>{esc(proposal.title)}</Text>
            <StatusBadge status={proposal.status} />
            {proposal.sent_at && (
              <Text style={styles.dateRow}>Sent: {formatDate(proposal.sent_at)}</Text>
            )}
            {proposal.created_at && (
              <Text style={styles.dateRow}>Created: {formatDate(proposal.created_at)}</Text>
            )}
          </View>
        </View>

        <View style={styles.toSection}>
          <Text style={styles.toLabel}>Prepared for</Text>
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
            <Text style={styles.footerText}>{esc(proposal.timeline)}</Text>
          </View>
        )}

        {proposal.terms && (
          <View style={styles.footerSection}>
            <Text style={styles.footerLabel}>Terms & Conditions</Text>
            <Text style={styles.footerText}>{esc(proposal.terms)}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
