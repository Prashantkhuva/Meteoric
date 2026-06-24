import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
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
  invoiceNumber: {
    fontSize: fontSizes.h1,
    fontWeight: 700,
    color: "#fff",
  },
  statusBadge: {
    fontSize: fontSizes.small,
    fontWeight: 700,
    textTransform: "uppercase",
    marginTop: spacing.tight,
  },
  statusSent: { color: colors.textMuted },
  statusPaid: { color: colors.success },
  statusOverdue: { color: colors.danger },
  dates: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacing.tight,
    lineHeight: 1.6,
  },
  paidDate: {
    color: colors.success,
    fontWeight: 700,
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
    fontWeight: 700,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.tight,
    letterSpacing: 1,
  },
  partyName: {
    fontSize: fontSizes.body,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: 1,
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
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border.replace("0.06", "0.04")}`,
    paddingVertical: spacing.element,
  },
  tableCell: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  tableCellFirst: {
    color: colors.text,
  },
  cellDesc: { flex: 3 },
  cellQty: { flex: 1, textAlign: "right" },
  cellRate: { flex: 1.5, textAlign: "right" },
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
  },
  totalRowFinal: {
    borderTop: `1px solid ${colors.textMuted}40`,
    marginTop: 2,
    paddingTop: spacing.element,
    fontSize: fontSizes.title,
    fontWeight: 700,
    color: "#fff",
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

export default function InvoicePDF({ invoice, client }) {
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
        <View style={styles.header}>
          <Image style={styles.logo} src="/meteoric-logo.png" />
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
            <Text style={styles.partyName}>Meteoric</Text>
            <Text style={styles.partyDetail}>contact@withmeteoric.com</Text>
          </View>
          <View style={[styles.partyBlock, styles.toBlock]}>
            <Text style={styles.partyLabel}>To</Text>
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
                <Text style={styles.footerText}>{esc(invoice.notes)}</Text>
              </>
            )}
            {invoice.terms && (
              <>
                <Text style={styles.footerLabel}>Terms & Conditions</Text>
                <Text style={styles.footerText}>{esc(invoice.terms)}</Text>
              </>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
