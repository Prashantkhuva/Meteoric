import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
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
    height: 67,
  },
  metaCol: {
    alignItems: "flex-end",
    maxWidth: "60%",
  },
  invoiceNumber: {
    fontSize: fontSizes.h1,
    fontFamily: fonts.bold,
    color: colors.accent,
    letterSpacing: -0.5,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 3,
    marginTop: 14,
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  statusSent: {
    backgroundColor: colors.accentMuted,
    color: colors.accent,
  },
  statusPaid: {
    backgroundColor: "rgba(74,222,128,0.12)",
    color: colors.success,
  },
  statusOverdue: {
    backgroundColor: "rgba(248,113,113,0.12)",
    color: colors.danger,
  },
  statusDraft: {
    backgroundColor: colors.accentMuted,
    color: colors.textMuted,
  },
  dates: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacing.tight,
    lineHeight: 1.6,
    textAlign: "right",
  },
  dateHighlight: {
    color: colors.accent,
    fontFamily: fonts.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 36,
    gap: 40,
  },
  partyBlock: {},
  partyLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 2,
  },
  partyAccent: {
    width: 24,
    height: 2,
    backgroundColor: colors.accent,
    marginBottom: spacing.element,
  },
  partyName: {
    fontSize: fontSizes.title,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: 2,
    lineHeight: 1.5,
  },
  toBlock: {
    alignItems: "flex-end",
  },
  table: {},
  tableHeader: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 14,
    marginBottom: spacing.tight,
  },
  tableHeaderCell: {
    fontSize: fontSizes.label,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    color: colors.accent,
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border}`,
    paddingVertical: 14,
  },
  tableRowAlt: {
    backgroundColor: colors.accentMuted,
  },
  tableCell: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  tableCellFirst: {
    color: colors.text,
  },
  cellDesc: { flex: 3, paddingRight: 12 },
  cellQty: { flex: 1, textAlign: "right", paddingRight: 8 },
  cellRate: { flex: 1.5, textAlign: "right", paddingRight: 8 },
  cellAmount: { flex: 1.5, textAlign: "right" },
  totalsContainer: {
    marginTop: 28,
    paddingTop: 22,
    borderTop: `1px solid ${colors.border}`,
    alignItems: "flex-end",
  },
  totalsInner: {
    width: 240,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  totalRowFinal: {
    marginTop: spacing.tight,
    paddingTop: 14,
    borderTop: `1px solid ${colors.accent}`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.accentMuted,
  },
  totalLabelFinal: {
    fontSize: fontSizes.body,
    fontFamily: fonts.bold,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  totalValueFinal: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.bold,
    color: colors.accent,
  },
  footerSection: {
    marginTop: 36,
    paddingTop: 22,
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
    marginTop: 40,
    paddingTop: 22,
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

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ status }) {
  const colorMap = {
    overdue: styles.statusOverdue,
    paid: styles.statusPaid,
    sent: styles.statusSent,
    draft: styles.statusDraft,
  };
  const label = status === "overdue" ? "Overdue" : status === "paid" ? "Paid" : status === "draft" ? "Draft" : "Sent";
  return (
    <View style={[styles.statusPill, colorMap[status] || styles.statusSent]}>
      <Text style={[styles.statusText, { color: (colorMap[status] || styles.statusSent).color }]}>
        {label}
      </Text>
    </View>
  );
}

export default function InvoicePDF({ invoice, client, logo }) {
  const items = invoice.items || [];
  const subtotal = items.reduce(
    (s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0),
    0
  );
  const tax = Number(invoice.tax) || 0;
  const total = Number(invoice.total) || subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <View style={styles.logoCol}>
            {logo && <Image style={styles.logo} src={logo} />}
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.invoiceNumber}>{esc(invoice.invoice_number)}</Text>
            <StatusBadge status={invoice.status} />
            <View style={styles.dates}>
              {invoice.created_at && <Text>Issued: {formatDate(invoice.created_at)}</Text>}
              {invoice.due_date && <Text>Due: {formatDate(invoice.due_date)}</Text>}
              {invoice.paid_at && (
                <Text>Paid: <Text style={styles.dateHighlight}>{formatDate(invoice.paid_at)}</Text></Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.parties}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>From</Text>
            <View style={styles.partyAccent} />
            <Text style={styles.partyName}>Meteoric</Text>
            <Text style={styles.partyDetail}>contact@withmeteoric.com</Text>
            <Text style={styles.partyDetail}>withmeteoric.com</Text>
          </View>
          <View style={[styles.partyBlock, styles.toBlock]}>
            <Text style={styles.partyLabel}>To</Text>
            <View style={[styles.partyAccent, { alignSelf: "flex-end" }]} />
            <Text style={styles.partyName}>{esc(client?.name || "\u2014")}</Text>
            {client?.company && (
              <Text style={styles.partyDetail}>{esc(client.company)}</Text>
            )}
            {client?.email && (
              <Text style={styles.partyDetail}>{esc(client.email)}</Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {items.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.cellDesc]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.cellQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.cellRate]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.cellAmount]}>Amount</Text>
            </View>
            {items.map((item, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tableCell, styles.tableCellFirst, styles.cellDesc]}>
                  {esc(item.description)}
                </Text>
                <Text style={[styles.tableCell, styles.cellQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.cellRate]}>
                  ${Number(item.rate).toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.cellAmount]}>
                  ${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.totalsContainer}>
          <View style={styles.totalsInner}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </View>
            {tax > 0 && (
              <View style={styles.totalRow}>
                <Text>Tax</Text>
                <Text>${tax.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabelFinal}>Total Due</Text>
              <Text style={styles.totalValueFinal}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {(invoice.notes || invoice.terms) && (
          <View style={styles.footerSection}>
            {invoice.notes && (
              <>
                <Text style={styles.footerLabel}>Notes</Text>
                <View style={styles.footerAccent} />
                <Text style={styles.footerText}>{esc(invoice.notes)}</Text>
              </>
            )}
            {invoice.terms && (
              <>
                <Text style={styles.footerLabel}>Terms & Conditions</Text>
                <View style={styles.footerAccent} />
                <Text style={styles.footerText}>{esc(invoice.terms)}</Text>
              </>
            )}
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
