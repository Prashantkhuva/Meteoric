import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import { colors, fonts, fontSizes, spacing } from "./theme";

const WISE_BASE = "https://wise.com/pay/business/khuvaprashantdayanandbhai1";
const PAYPAL_ME = "https://paypal.me/Prashantkhuva";

const WISE_LOGO =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDYgMjQiIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiMxNjMzMDAiIGQ9Ik01OC43Mzc3LjM1ODgwM2g2LjQ5ODJMNjEuOTY2OCAyMy42ODFoLTYuNDk4M0w1OC43Mzc3LjM1ODgwM1ptLTguMTkyMiAwTDQ2LjE2MDIgMTMuNzk0IDQ0LjI0NjUuMzU4ODAzaC00LjU0NDhMMzMuOTYwOCAxMy43NTQxIDMzLjI0MzMuMzU4ODAzaC02LjI5OTFMMjkuMTM2OSAyMy42ODFoNS4yMjI2TDQwLjgxOCA4LjkzMDIyIDQzLjA5MDQgMjMuNjgxaDUuMTQyOEw1Ni43MjQ5LjM1ODgwM2gtNi4xNzk0Wk0xMDUuMTAzIDEzLjkxMzZIODkuNjc0NGMuMDc5OCAzLjAyOTkgMS44OTM3IDUuMDIzMyA0LjU2NDggNS4wMjMzIDIuMDEzMyAwIDMuNjA4LTEuMDc2NSA0Ljg0MzktMy4xMjk2bDUuMjA3OSAyLjM2NzRDMTAyLjUwMSAyMS43MDE3IDk4LjcyOSAyNCA5NC4wNzk4IDI0IDg3Ljc0MSAyNCA4My41MzUgMTkuNzM0MiA4My41MzUgMTIuODc3MSA4My41MzUgNS4zNDIyMSA4OC40Nzg0IDAgOTUuNDU1MiAwYzYuMTM5OCAwIDEwLjAwNjggNC4xNDYxOCAxMC4wMDY4IDEwLjYwNDYgMCAxLjA3NjUtLjEyIDIuMTUyOC0uMzU5IDMuMzA5Wm0tNS43ODA3LTQuNDY1MTJjMC0yLjcxMDk1LTEuNTE1LTQuNDI1MjUtMy45NDY4LTQuNDI1MjUtMi41MTE3IDAtNC41ODQ4IDEuNzk0MDItNS4xNDMgNC40MjUyNWg5LjA4OThaTTYuNjMzMjYgNy4zODY4NSAwIDE1LjEzODloMTEuODQ0bDEuMzMwOS0zLjY1NTNIOC4wOTk2NWwzLjEwMTA1LTMuNTg1NTUuMDEtLjA5NTExTDkuMTk0MjQgNC4zMzE5aDkuMDcxOTZsLTcuMDMyMyAxOS4zNDkyaDQuODEyNEwyNC41MzguMzU4ODIzSDIuNjAwMjFMNi42MzMyNiA3LjM4Njg1Wm02OS4xNjc0NC0yLjM2MzZjMi4yOTIzIDAgNC4zMDEgMS4yMzI3MyA2LjA1NTEgMy4zNDU2NWwuOTIxNi02LjU3NDg4QzgxLjE0MjkuNjg3NzA3IDc4LjkzMDMgMCA3NiAwYy01LjgyMDUgMC05LjA4OTYgMy40MDg2NS05LjA4OTYgNy43MzQyMSAwIDIuOTk5OTkgMS42NzQ0IDQuODMzODkgNC40MjUyIDYuMDE5ODlsMS4zMTU2LjU5OGMyLjQ1MTggMS4wNDY2IDMuMTA5NyAxLjU2NDkgMy4xMDk3IDIuNjcxMiAwIDEuMTQ2MS0xLjEwNjQgMS44NzM3LTIuNzkwNyAxLjg3MzctMi43ODA4LjAxLTUuMDMzMi0xLjQxNTMtNi43Mjc2LTMuODQ3MmwtLjkzOSA2LjY5OUM2Ny4yMzMyIDIzLjIyMDEgNjkuNzA2NyAyNCA3Mi45NzAyIDI0YzUuNTMxNSAwIDguOTMwMi0zLjE4OTQgOC45MzAyLTcuNjE0NyAwLTMuMDA5OS0xLjMzNTUtNC45NDM0LTQuNzA0NC02LjQ1ODRsLTEuNDM1MS0uNjc3NzJjLTEuOTkzNC0uODg3MDgtMi42NzExLTEuMzc1NDMtMi42NzExLTIuMzUyMTYgMC0xLjA1NjQ3LjkyNjktMS44NzM3NyAyLjcxMDktMS44NzM3N1oiLz48L3N2Zz4=";
const UPI_LOGO =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NiAyNCI+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjEyIiByPSI3LjUiIGZpbGw9IiM1RjI1OUYiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjEyIiByPSI3LjUiIGZmlsbD0iI0ZGNkYwMCIvPgogIDxjaXJjbGUgY3g9IjQxIiBjeT0iMTIiIHI9IjcuNSIgZmlsbD0iIzAwOUU2MCIvPgogIDx0ZXh0IHg9IjU0IiB5PSIxNy41IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRkZGRkZGIj5VUEk8L3RleHQ+Cjwvc3ZnPg==";
const PAYPAL_LOGO =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCI+DQogIDxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjQ1IiBkPSJNMTYuMTMgMzkuMTE1SDguMzY3YTEuMDQxIDEuMDQxIDAgMCAxLTEuMDI2LTEuMmw1LjIzNC0zMy4xNzZhMS4yNzkgMS4yNzkgMCAwIDEgMS4yNjEtMS4wNzloMTMuMzM1YzYuMzE1IDAgMTAuOTA5IDQuNTkyIDEwLjggMTAuMTU3IDMuNzM1IDEuOTUgNS45MTUgNS45MSA1LjIzNCAxMC4yNDdhMTIuNTQ4IDEyLjU0OCAwIDAgMS0xMi4zOSAxMC42MkgyNi44OWExLjI3NSAxLjI3NSAwIDAgMC0xLjI2MSAxLjA4TDIzLjg3IDQ2LjlhMS4yNzYgMS4yNzYgMCAwIDEtMS4yNjIgMS4wNzlIMTUuOTRhMS4wNCAxLjA0IDAgMCAxLTEuMDI2LTEuMTk5bDEuMjE1LTcuNjY0di0uMDAyWiIvPg0KICA8cGF0aCBmaWxsPSIjZmZmIiBmaWwsLW9wYWNpdHk9Ii40NSIgZD0iTTM3Ljk3MyAxMy44MTdhMTEuNjY4IDExLjY2OCAwIDAgMC01LjQ0MS0xLjI5NEgyMS40MTRhMS4yNzcgMS4yNzcgMCAwIDAtMS4yNjEgMS4wOGwtMi4wOTggMTMuMjkzLjAwNi0uMDM1YTEuMjggMS4yOCAwIDAgMSAxLjI1Ni0xLjA0Mmg2LjE0NGExMi41NTMgMTIuNTUzIDAgMCAwIDEyLjM5LTEwLjYyYy4wNzEtLjQ1Ny4xMTMtLjkyLjEyMi0xLjM4MloiLz4NCiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE2LjEzMyAzOS4xMTVIOC4zNjhhMS4wNDEgMS4wNDEgMCAwIDEtMS4wMjYtMS4ybDUuMjM0LTMzLjE3NmExLjI3OSAxLjI3OSAwIDAgMSAxLjI2MS0xLjA3OWgxMy4zMzVjNi4zMTUgMCAxMC45MDkgNC41OTIgMTAuODAxIDEwLjE1N2ExMS42NyAxMS42NyAwIDAgMC01LjQ0MS0xLjI5NEgyMS40MTRhMS4yNzcgMS4yNzcgMCAwIDAtMS4yNjEgMS4wOGwtMi4wOTggMTMuMjkzLjAwNi0uMDM1LTEuOTI4IDEyLjI1NFoiLz4NCjwvc3ZnPg==";

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
    gap: 12,
  },
  invoiceNumber: {
    fontSize: fontSizes.h1,
    fontFamily: fonts.bold,
    color: colors.accent,
    letterSpacing: -0.5,
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
  bankSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.border}`,
  },
  bankTitle: {
    fontSize: fontSizes.caption,
    fontFamily: fonts.bold,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  bankLine: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    lineHeight: 1.8,
  },
  bankLabel: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
  },
  paySection: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  wiseButton: {
    backgroundColor: colors.wiseGreen,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wiseLogo: {
    width: 48,
    height: 11,
  },
  paypalButton: {
    backgroundColor: "#0070BA",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  paypalLogo: {
    width: 18,
    height: 18,
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
  upiButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  upiLogo: {
    width: 52,
    height: 16,
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
  const config = {
    draft: {
      bg: "#161616",
      border: "#333333",
      color: "#999999",
      dot: "#999999",
    },
    sent: {
      bg: "#222225",
      border: "#E8E4FF",
      color: "#E8E4FF",
      dot: "#E8E4FF",
    },
    paid: {
      bg: "#0D2818",
      border: "#4ade80",
      color: "#4ade80",
      dot: "#4ade80",
    },
    overdue: {
      bg: "#2D1215",
      border: "#f87171",
      color: "#f87171",
      dot: "#f87171",
    },
  };
  const c = config[status] || config.sent;
  const label =
    status === "overdue"
      ? "Overdue"
      : status === "paid"
        ? "Paid"
        : status === "draft"
          ? "Draft"
          : "Sent";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 4,
        marginTop: 14,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.bg,
      }}
    >
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: c.dot,
          marginRight: 6,
        }}
      />
      <Text
        style={{
          fontSize: 9,
          fontFamily: fonts.bold,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: c.color,
          lineHeight: 1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function InvoicePDF({ invoice, client, logo, wiseCurrency, previewUrl }) {
  const items = invoice.items || [];
  const subtotal = items.reduce(
    (s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0),
    0,
  );
  const tax = Number(invoice.tax) || 0;
  const total = Number(invoice.total) || subtotal + tax;
  const curr = wiseCurrency || invoice.currency || "USD";
  const sym = ({ USD: "$", EUR: "\u20AC", GBP: "\u00A3", INR: "\u20B9", CAD: "CA$", AUD: "AU$", SGD: "S$", JPY: "\u00A5" })[curr] || "$";
  const wiseUrl = `${WISE_BASE}?currency=${curr}&amount=${total.toFixed(2)}`;
  const paypalUrl = `${PAYPAL_ME}/${total.toFixed(2)}${curr}`;
  const isPaid = invoice.status === "paid";
  const bank = invoice.bank_account || null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />

        <View style={styles.header}>
          <View style={styles.logoCol}>
            {logo && <Image style={styles.logo} src={logo} />}
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.invoiceNumber}>
              {esc(invoice.invoice_number)}
            </Text>
            <StatusBadge status={invoice.status} />
            <View style={styles.dates}>
              {invoice.created_at && (
                <Text>Issued: {formatDate(invoice.created_at)}</Text>
              )}
              {invoice.due_date && (
                <Text>Due: {formatDate(invoice.due_date)}</Text>
              )}
              {invoice.paid_at && (
                <Text>
                  Paid:{" "}
                  <Text style={styles.dateHighlight}>
                    {formatDate(invoice.paid_at)}
                  </Text>
                </Text>
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
            <Text style={styles.partyName}>
              {esc(client?.name || "\u2014")}
            </Text>
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
              <Text style={[styles.tableHeaderCell, styles.cellDesc]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, styles.cellQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.cellRate]}>
                Rate
              </Text>
              <Text style={[styles.tableHeaderCell, styles.cellAmount]}>
                Amount
              </Text>
            </View>
            {items.map((item, i) => (
              <View
                key={i}
                style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellFirst,
                    styles.cellDesc,
                  ]}
                >
                  {esc(item.description)}
                </Text>
                <Text style={[styles.tableCell, styles.cellQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.cellRate]}>
                  {sym}{Number(item.rate).toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.cellAmount]}>
                  {sym}
                  {(
                    (Number(item.quantity) || 0) * (Number(item.rate) || 0)
                  ).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.totalsContainer}>
          <View style={styles.totalsInner}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{sym}{subtotal.toFixed(2)}</Text>
            </View>
            {tax > 0 && (
              <View style={styles.totalRow}>
                <Text>Tax</Text>
                <Text>{sym}{tax.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabelFinal}>Total Due</Text>
              <Text style={styles.totalValueFinal}>{sym}{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {!isPaid && bank && (
          <View style={styles.bankSection}>
            <Text style={styles.bankTitle}>Bank Transfer Details</Text>
            {bank.bank_name && <Text style={styles.bankLine}><Text style={styles.bankLabel}>Bank: </Text>{esc(bank.bank_name)}</Text>}
            {bank.account_holder && <Text style={styles.bankLine}><Text style={styles.bankLabel}>Name: </Text>{esc(bank.account_holder)}</Text>}
            {bank.account_number && <Text style={styles.bankLine}><Text style={styles.bankLabel}>Account No: </Text>{esc(bank.account_number)}</Text>}
            {bank.iban && <Text style={styles.bankLine}><Text style={styles.bankLabel}>IBAN: </Text>{esc(bank.iban)}</Text>}
            {bank.swift_bic && <Text style={styles.bankLine}><Text style={styles.bankLabel}>SWIFT/BIC: </Text>{esc(bank.swift_bic)}</Text>}
            {bank.routing_number && <Text style={styles.bankLine}><Text style={styles.bankLabel}>Routing: </Text>{esc(bank.routing_number)}</Text>}
            {bank.ifsc && <Text style={styles.bankLine}><Text style={styles.bankLabel}>IFSC: </Text>{esc(bank.ifsc)}</Text>}
            {bank.currency && <Text style={styles.bankLine}><Text style={styles.bankLabel}>Currency: </Text>{esc(bank.currency)}</Text>}
            {bank.country && <Text style={styles.bankLine}><Text style={styles.bankLabel}>Country: </Text>{esc(bank.country)}</Text>}
          </View>
        )}

        {!isPaid && curr !== "INR" && (
          <View style={styles.paySection}>
            <Link src={wiseUrl} style={styles.wiseButton}>
              <Image src={WISE_LOGO} style={styles.wiseLogo} />
            </Link>
            <Link src={paypalUrl} style={styles.paypalButton}>
              <Image src={PAYPAL_LOGO} style={styles.paypalLogo} />
            </Link>
          </View>
        )}

        {!isPaid && curr === "INR" && previewUrl && (
          <View style={styles.paySection}>
            <Link src={previewUrl + "&rp=1"} style={styles.upiButton}>
              <Image src={UPI_LOGO} style={styles.upiLogo} />
            </Link>
          </View>
        )}

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
