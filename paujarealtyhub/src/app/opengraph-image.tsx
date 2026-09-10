import { ImageResponse } from "next/og";

export const alt =
  "PaujaRealtyHub - Property Marketplace in Nigeria";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#061426",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "22px",
              background: "#C9A227",
              color: "#08192E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: 900,
            }}
          >
            P
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: 800,
            }}
          >
            PaujaRealtyHub
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "68px",
            lineHeight: 1.1,
            fontWeight: 900,
            maxWidth: "1000px",
          }}
        >
          <div style={{ display: "flex" }}>
            Discover Property.
          </div>

          <div style={{ display: "flex" }}>
            Connect With Confidence.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "35px",
            fontSize: "30px",
            color: "#D1D5DB",
            maxWidth: "950px",
            lineHeight: 1.4,
          }}
        >
          Properties, agents, businesses and property services across Nigeria.
        </div>

        <div
          style={{
            marginTop: "55px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "24px",
            fontWeight: 700,
            color: "#C9A227",
          }}
        >
          PROPERTY • TRUST • INTELLIGENCE
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}