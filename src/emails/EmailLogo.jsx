import { Text } from "react-email";

export default function EmailLogo() {
  return (
    <Text
      style={{
        margin: "0 0 24px 0",
        padding: 0,
        lineHeight: "16px",
        fontSize: "12px",
      }}
    >
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          color: "#FFFFFF",
        }}
      >
        meteor
      </span>
      <span
        style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontStyle: "italic",
          fontWeight: 600,
          color: "#FFFFFF",
        }}
      >
        ic
      </span>
    </Text>
  );
}
