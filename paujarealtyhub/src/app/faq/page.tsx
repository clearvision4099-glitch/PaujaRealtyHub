export default function FAQPage() {
  const faqs = [
    {
      question: "What is PaujaRealtyHub?",
      answer:
        "PaujaRealtyHub is a global real estate platform connecting buyers, sellers, renters, agents, developers, and property professionals.",
    },
    {
      question: "Can I list my property?",
      answer:
        "Yes. Property owners, agents, and developers can list residential and commercial properties on the platform.",
    },
    {
      question: "Which countries are supported?",
      answer:
        "Our vision is to support property transactions across Africa and eventually the rest of the world.",
    },
    {
      question: "Do I need an account?",
      answer:
        "You can browse properties without an account, but creating one unlocks favorites, enquiries, and many other features.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h1>

        <p className="text-center text-gray-600 mb-12">
          Answers to some of the most common questions about
          PaujaRealtyHub.
        </p>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-3">
                {faq.question}
              </h2>

              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}