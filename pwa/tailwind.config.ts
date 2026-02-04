import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./app/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#F7F9FC",
        surface: "#FFFFFF",
        surfaceAlt: "#F1F5FB",
        accent: "#1746FF",
        accent2: "#0091FF",
        accentSoft: "#D1DAFF",
        ink: "#0B1B3B",
        muted: "#5B6B86",
        line: "#E2E8F0",
        grid: "#CBD5E1",
        success: "#00B48C",
        warning: "#FAC800",
        danger: "#EA465A",
        info: "#B4509B",
        orange: "#FA783C"
      },
      fontFamily: {
        display: [
          "Noto Sans JP",
          "Yu Gothic",
          "YuGothic",
          "Hiragino Kaku Gothic ProN",
          "Meiryo",
          "sans-serif"
        ],
        body: [
          "Noto Sans JP",
          "Yu Gothic",
          "YuGothic",
          "Hiragino Kaku Gothic ProN",
          "Meiryo",
          "sans-serif"
        ]
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)",
        cardSoft: "0 10px 24px rgba(15, 23, 42, 0.08)",
        focus: "0 0 0 4px rgba(23, 70, 255, 0.18)"
      },
      keyframes: {
        radarIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        radarIn: "radarIn 0.8s ease-out both",
        glowPulse: "glowPulse 2.4s ease-in-out infinite",
        float: "float 3.2s ease-in-out infinite",
        reveal: "reveal 0.7s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
