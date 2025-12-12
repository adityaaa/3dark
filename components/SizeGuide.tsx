"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";
import type { ProductCategory, AgeGroup } from "@/lib/types";

interface SizeGuideProps {
  readonly category: ProductCategory;
  readonly ageGroup: AgeGroup;
}

// Size chart data
const SIZE_CHARTS = {
  adult: {
    tshirt: {
      title: "Adult T-Shirt Size Guide",
      headers: ["Size", "Chest (inches)", "Length (inches)", "Shoulder (inches)"],
      rows: [
        ["S", "36-38", "26-27", "16-17"],
        ["M", "38-40", "27-28", "17-18"],
        ["L", "40-42", "28-29", "18-19"],
        ["XL", "42-44", "29-30", "19-20"],
        ["XXL", "44-46", "30-31", "20-21"],
        ["XXXL", "46-48", "31-32", "21-22"],
      ],
    },
    shorts: {
      title: "Adult Shorts Size Guide",
      headers: ["Size", "Waist (inches)", "Hip (inches)", "Length (inches)"],
      rows: [
        ["S", "28-30", "36-38", "19-20"],
        ["M", "30-32", "38-40", "20-21"],
        ["L", "32-34", "40-42", "21-22"],
        ["XL", "34-36", "42-44", "22-23"],
        ["XXL", "36-38", "44-46", "23-24"],
        ["XXXL", "38-40", "46-48", "24-25"],
      ],
    },
    pants: {
      title: "Adult Pants Size Guide",
      headers: ["Size", "Waist (inches)", "Hip (inches)", "Length (inches)"],
      rows: [
        ["S", "28-30", "36-38", "38-39"],
        ["M", "30-32", "38-40", "39-40"],
        ["L", "32-34", "40-42", "40-41"],
        ["XL", "34-36", "42-44", "41-42"],
        ["XXL", "36-38", "44-46", "42-43"],
        ["XXXL", "38-40", "46-48", "43-44"],
      ],
    },
    "beanie-hat": {
      title: "Adult Beanie/Hat Size Guide",
      headers: ["Size", "Head Circumference (inches)"],
      rows: [
        ["Free Size", "22-24 (fits most adults)"],
      ],
    },
  },
  kids: {
    tshirt: {
      title: "Kids T-Shirt Size Guide",
      headers: ["Age", "Height (cm)", "Chest (inches)", "Length (inches)"],
      rows: [
        ["2-4 Years", "85-100", "24-26", "16-18"],
        ["4-6 Years", "100-115", "26-28", "18-20"],
        ["6-8 Years", "115-130", "28-30", "20-22"],
        ["8-10 Years", "130-145", "30-32", "22-24"],
        ["10-12 Years", "145-160", "32-34", "24-26"],
        ["12-14 Years", "160-170", "34-36", "26-28"],
      ],
    },
    shorts: {
      title: "Kids Shorts Size Guide",
      headers: ["Age", "Height (cm)", "Waist (inches)", "Length (inches)"],
      rows: [
        ["2-4 Years", "85-100", "20-22", "10-12"],
        ["4-6 Years", "100-115", "22-24", "12-14"],
        ["6-8 Years", "115-130", "24-26", "14-16"],
        ["8-10 Years", "130-145", "26-28", "16-18"],
        ["10-12 Years", "145-160", "28-30", "18-20"],
        ["12-14 Years", "160-170", "30-32", "20-22"],
      ],
    },
    pants: {
      title: "Kids Pants Size Guide",
      headers: ["Age", "Height (cm)", "Waist (inches)", "Length (inches)"],
      rows: [
        ["2-4 Years", "85-100", "20-22", "18-20"],
        ["4-6 Years", "100-115", "22-24", "20-24"],
        ["6-8 Years", "115-130", "24-26", "24-28"],
        ["8-10 Years", "130-145", "26-28", "28-32"],
        ["10-12 Years", "145-160", "28-30", "32-36"],
        ["12-14 Years", "160-170", "30-32", "36-38"],
      ],
    },
    "beanie-hat": {
      title: "Kids Beanie/Hat Size Guide",
      headers: ["Age", "Head Circumference (inches)"],
      rows: [
        ["2-4 Years", "18-19"],
        ["4-6 Years", "19-20"],
        ["6-8 Years", "20-21"],
        ["8-10 Years", "21-22"],
        ["10-12 Years", "21-22"],
        ["12-14 Years", "22-23"],
      ],
    },
  },
};

const SIZING_TIPS = {
  adult: {
    tshirt: [
      "Measure your chest at the fullest part",
      "If between sizes, we recommend sizing up for a relaxed fit",
      "All measurements are approximate and may vary by 0.5-1 inch",
      "Our t-shirts have a comfortable, regular fit",
    ],
    shorts: [
      "Measure your waist at the narrowest point",
      "Measure your hips at the fullest part",
      "For a comfortable fit, choose based on waist measurement",
      "All measurements are approximate and may vary by 0.5-1 inch",
    ],
    pants: [
      "Measure your waist at the narrowest point",
      "Measure your hips at the fullest part",
      "Length is measured from waist to ankle",
      "All measurements are approximate and may vary by 0.5-1 inch",
    ],
    "beanie-hat": [
      "Free size fits most adults",
      "Stretchy material for comfortable fit",
      "Head circumference: 22-24 inches (56-61 cm)",
    ],
  },
  kids: {
    tshirt: [
      "Choose size based on your child's age and height",
      "If your child is between sizes, size up for growth room",
      "All measurements are approximate",
      "Soft, comfortable cotton blend suitable for active kids",
    ],
    shorts: [
      "Choose size based on your child's age and height",
      "Elastic waistband for comfortable fit",
      "If your child is between sizes, size up for growth room",
      "All measurements are approximate",
    ],
    pants: [
      "Choose size based on your child's age and height",
      "If your child is between sizes, size up for growth room",
      "Elastic waistband for comfortable fit",
      "All measurements are approximate",
    ],
    "beanie-hat": [
      "Choose based on your child's age",
      "Stretchy material for comfortable fit",
      "All measurements are approximate",
    ],
  },
};

export default function SizeGuide({ category, ageGroup }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeChart = SIZE_CHARTS[ageGroup][category];
  const tips = SIZING_TIPS[ageGroup][category];

  return (
    <>
      {/* Size Guide Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-neon hover:underline"
      >
        <Ruler className="h-3.5 w-3.5" />
        Size Guide
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-b from-black to-gray-900 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/95 backdrop-blur-sm p-6">
              <div>
                <h2 className="text-xl font-semibold text-white">{sizeChart.title}</h2>
                <p className="mt-1 text-xs text-white/60">
                  Find your perfect fit with our detailed size chart
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      {sizeChart.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold text-neon uppercase tracking-wide"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.rows.map((row) => (
                      <tr
                        key={row[0]}
                        className="border-b border-white/5 transition hover:bg-white/5"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={`${row[0]}-${cellIdx}`}
                            className={`px-4 py-3 text-sm ${
                              cellIdx === 0
                                ? "font-semibold text-white"
                                : "text-white/70"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sizing Tips */}
              <div className="rounded-xl border border-neon/20 bg-neon/5 p-5">
                <h3 className="text-sm font-semibold text-neon mb-3">📏 Sizing Tips</h3>
                <ul className="space-y-2">
                  {tips.map((tip) => (
                    <li key={tip.substring(0, 20)} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-1 text-neon">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Measure */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">📐 How to Measure</h3>
                <div className="space-y-3 text-sm text-white/70">
                  {(category === "tshirt" || category === "shorts" || category === "pants") && (
                    <>
                      <p>
                        <strong className="text-white">Chest:</strong> Measure around the fullest
                        part of your chest, keeping the tape horizontal.
                      </p>
                      <p>
                        <strong className="text-white">Waist:</strong> Measure around your natural
                        waistline at the narrowest point.
                      </p>
                      {(category === "shorts" || category === "pants") && (
                        <p>
                          <strong className="text-white">Hip:</strong> Measure around the fullest
                          part of your hips, keeping the tape horizontal.
                        </p>
                      )}
                      <p>
                        <strong className="text-white">Length:</strong> Measure from the highest
                        point of the shoulder down to the desired length.
                      </p>
                    </>
                  )}
                  {category === "beanie-hat" && (
                    <p>
                      <strong className="text-white">Head Circumference:</strong> Wrap a measuring
                      tape around your head, positioning it about 1 inch above your eyebrows.
                    </p>
                  )}
                </div>
              </div>

              {/* Support Note */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-center">
                <p className="text-xs text-white/60">
                  Still not sure about sizing?{" "}
                  <a
                    href="mailto:support@3dark.in"
                    className="text-neon hover:underline"
                  >
                    Contact us
                  </a>{" "}
                  with your measurements and we&apos;ll help you find the perfect fit!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
