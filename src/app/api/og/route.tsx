import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "The City's Block";
    const price = searchParams.get("price") || "Verified Properties";
    const city = searchParams.get("city") || "Ahmedabad & Gandhinagar";
    const type = searchParams.get("type") || "Real Estate";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#1B4332",
            padding: "80px",
            fontFamily: "sans-serif",
            color: "white",
            position: "relative",
          }}
        >
          {/* Top Brand Logo & Border Accent */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#C9A84C",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                The City's Block
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: "4px",
                }}
              >
                Ahmedabad & Gandhinagar Property Portal
              </span>
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: "30px",
                backgroundColor: "rgba(201, 168, 76, 0.15)",
                border: "1px solid rgba(201, 168, 76, 0.3)",
                color: "#C9A84C",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {type}
            </div>
          </div>

          {/* Main Title Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "40px",
              maxWidth: "900px",
            }}
          >
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                lineHeight: "1.2",
                color: "white",
                margin: "0",
                display: "-webkit-box",
                overflow: "hidden",
                wordBreak: "break-all",
              }}
            >
              {title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "20px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "8px" }}
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{city}</span>
            </div>
          </div>

          {/* Bottom Price Details Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "32px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                Offered Price
              </span>
              <span
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#C9A84C",
                  marginTop: "4px",
                }}
              >
                {price}
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              Verified Listing • thecitysblock.in
            </div>
          </div>

          {/* Golden Highlight Accent Ribbon */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              height: "6px",
              backgroundColor: "#C9A84C",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("Failed to generate OG image", e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
