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
    height: 3,
    backgroundColor: colors.accent,
    marginBottom: 44,
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
    width: 130,
    height: 26,
  },
  meta: {
    alignItems: "flex-end",
  },
  invoiceNumber: {
    fontSize: fontSizes.h1,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: -0.3,
  },
  statusBadge: {
    fontSize: fontSizes.small,
    fontWeight: 600,
    textTransform: "uppercase",
    marginTop: spacing.tight,
    letterSpacing: 1.5,
  },
  statusSent: { color: colors.textMuted },
  statusPaid: { color: colors.accent },
  statusOverdue: { color: colors.danger },
  dates: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacing.tight,
    lineHeight: 1.6,
  },
  paidDate: {
    color: colors.accent,
    fontWeight: 600,
  },
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.section,
    gap: 40,
  },
  partyBlock: {},
  partyLabel: {
    fontSize: fontSizes.label,
    fontWeight: 600,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 1.5,
  },
  partyAccent: {
    width: 28,
    height: 1.5,
    backgroundColor: colors.accent,
    marginBottom: spacing.element,
  },
  partyName: {
    fontSize: fontSizes.title,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 3,
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
  table: {
    marginBottom: spacing.block,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: spacing.element,
    marginBottom: spacing.tight,
  },
  tableHeaderCell: {
    fontSize: fontSizes.label,
    fontWeight: 700,
    textTransform: "uppercase",
    color: colors.accent,
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border}`,
    paddingVertical: spacing.element,
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
  totals: {
    width: 260,
    marginLeft: "auto",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.tight,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  totalRowFinal: {
    borderTop: `1px solid ${colors.border}`,
    marginTop: spacing.tight,
    paddingTop: spacing.element,
    fontSize: fontSizes.title,
    fontWeight: 700,
    color: colors.accent,
  },
  footerSection: {
    marginTop: spacing.section,
    paddingTop: spacing.block,
    borderTop: `1px solid ${colors.border}`,
  },
  footerLabel: {
    fontSize: fontSizes.label,
    fontWeight: 600,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 1.5,
  },
  footerAccent: {
    width: 28,
    height: 1.5,
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
    gap: 24,
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

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ status }) {
  const statusStyle =
    status === "overdue"
      ? styles.statusOverdue
      : status === "paid"
        ? styles.statusPaid
        : styles.statusSent;
  return (
    <Text style={[styles.statusBadge, statusStyle]}>
      {status === "overdue" ? "Overdue" : status === "paid" ? "Paid" : status}
    </Text>
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
          {logo && <Image style={styles.logo} src={logo} />}
          <View style={styles.meta}>
            <Text style={styles.invoiceNumber}>{esc(invoice.invoice_number)}</Text>
            <StatusBadge status={invoice.status} />
            <View style={styles.dates}>
              {invoice.created_at && <Text>Issued: {formatDate(invoice.created_at)}</Text>}
              {invoice.due_date && <Text>Due: {formatDate(invoice.due_date)}</Text>}
              {invoice.paid_at && (
                <Text style={styles.paidDate}>Paid: {formatDate(invoice.paid_at)}</Text>
              )}
            </View>
          </View>
        </View>

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

        {items.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.cellDesc]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.cellQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.cellRate]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.cellAmount]}>Amount</Text>
            </View>
            {items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
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

        <View style={styles.totals}>
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
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text>Total</Text>
            <Text>${total.toFixed(2)}</Text>
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
