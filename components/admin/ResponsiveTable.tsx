"use client";

import { ReactNode } from "react";

type ResponsiveTableProps = {
  desktopTable: ReactNode;
  mobileCards: ReactNode;
};

export default function ResponsiveTable({ desktopTable, mobileCards }: Readonly<ResponsiveTableProps>) {
  return (
    <>
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block">
        {desktopTable}
      </div>
      {/* Mobile Cards - Hidden on desktop */}
      <div className="md:hidden space-y-4">
        {mobileCards}
      </div>
    </>
  );
}
