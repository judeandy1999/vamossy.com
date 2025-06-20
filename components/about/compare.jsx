"use client";
import { agencyComparison } from "../../data/data";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Compare() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#181818",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "2rem 1rem"
      }}
      ref={ref}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          width: "100%"
        }}
      >
        <motion.h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
            wordBreak: "break-word"
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {agencyComparison.title}
        </motion.h2>
        <motion.div
          style={{
            height: 4,
            width: 80,
            background: "#FFD600",
            margin: "0 auto 18px auto",
            borderRadius: 2
          }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.p
          style={{
            color: "#bbb",
            textAlign: "center",
            marginBottom: 32,
            fontSize: "1rem"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {agencyComparison.subtitle}
        </motion.p>
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap"
          }}
        >
          {agencyComparison.columns.map((col, idx) => (
            <motion.div
              key={col.heading}
              style={{
                background: "#232323",
                borderRadius: 16,
                boxShadow: "0 4px 24px #0004",
                padding: "1.5rem 1rem",
                minWidth: 0,
                flex: "1 1 260px",
                maxWidth: 350,
                marginBottom: 24,
                width: "100%"
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + idx * 0.15 }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: 8,
                  textAlign: "center",
                  wordBreak: "break-word"
                }}
              >
                {col.heading}
              </h3>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 28,
                    color: "#FFD600"
                  }}
                >
                  ▼
                </span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                      color: item.type === "good" ? "#FFD600" : "#fff",
                      opacity: item.type === "bad" ? 0.7 : 1,
                      fontWeight: 500,
                      fontSize: "1rem"
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        color: "#FFD600"
                      }}
                    >
                      {item.type === "good" ? "✔" : "✗"}
                    </span>
                    <span style={{ color: "#fff" }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}