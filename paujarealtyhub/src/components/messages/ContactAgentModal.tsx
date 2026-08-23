"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { sendMessage } from "@/services/messages";

type ContactAgentModalProps = {
  open: boolean;
  onClose: () => void;

  propertyId: number;
  propertyTitle: string;

  receiverId: string;
  phone?: string;
  email?: string;
};

export default function ContactAgentModal({
  open,
  onClose,
  propertyId,
  propertyTitle,
  receiverId,
  phone,
  email,
}: ContactAgentModalProps) {
  const router = useRouter();

  const [message, setMessage] = useState(
    `Hello,

I'm interested in "${propertyTitle}".

Is it still available?`
  );

  const [sending, setSending] = useState(false);

  if (!open) return null;

  async function handleSend() {
    setSending(true);

    const result = await sendMessage({
      receiverId,
      propertyId,
      message,
    });

    if (result.loginRequired) {
      sessionStorage.setItem(
        "pending_message",
        JSON.stringify({
          receiverId,
          propertyId,
          propertyTitle,
          message,
        })
      );

      router.push("/login");
      return;
    }

    if (result.success) {
      alert("Message sent successfully.");

      onClose();
    }

    setSending(false);
  }

  function openWhatsApp() {
    if (!phone) return;

    const text = encodeURIComponent(message);

    window.open(
      `https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`,
      "_blank"
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">

      <div className="bg-white rounded-2xl w-full max-w-xl p-8">

        <h2 className="text-2xl font-bold mb-2">
          Contact Agent
        </h2>

        <p className="text-gray-500 mb-6">
          {propertyTitle}
        </p>

        <textarea
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-xl p-4 resize-none"
        />

        <div className="grid gap-3 mt-6">

          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800"
          >
            {sending ? "Sending..." : "💬 Send Message"}
          </button>

          {phone && (
            <button
              onClick={openWhatsApp}
              className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
            >
              🟢 WhatsApp
            </button>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="bg-gray-800 text-white py-3 rounded-xl text-center"
            >
              📞 Call Agent
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="border py-3 rounded-xl text-center"
            >
              ✉ Email
            </a>
          )}

          <button
            onClick={onClose}
            className="border py-3 rounded-xl"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}