export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-6">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 mb-12">
          We'd love to hear from you. Whether you're buying, selling,
          investing or partnering with us, our team is here to help.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-10">
          <form className="space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg p-4"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg p-4"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg p-4"
            />

            <textarea
              placeholder="Your Message"
              rows={6}
              className="w-full border rounded-lg p-4"
            ></textarea>

            <button
              className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}