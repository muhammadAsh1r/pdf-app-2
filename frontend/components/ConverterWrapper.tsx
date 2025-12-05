"use client";

import MessageBox from "./MessageBox";

export default function ConverterWrapper({
  title,
  description,
  children,
  message,
  loading,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  message: { type: "success" | "error" | null; text: string | null } | null | undefined;
  loading?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h1>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>

      {children}

      <div className="mt-4">
        <MessageBox type={message?.type} text={message?.text} />
      </div>
    </div>
  );
}
