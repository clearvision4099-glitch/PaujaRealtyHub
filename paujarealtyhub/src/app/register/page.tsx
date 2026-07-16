export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-md">
        <a href="/" className="text-sm font-bold text-emerald-950">
          ← Back to PaujaRealtyHub
        </a>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-bold tracking-[0.15em] text-amber-600">
            CREATE AN ACCOUNT
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-emerald-950">
            Welcome to PaujaRealtyHub
          </h1>

          <p className="mt-3 text-slate-600">
            Create your account to save properties, contact agents, and list
            your property.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">I am joining as</label>
              <select className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800">
                <option>Property seeker</option>
                <option>Property owner</option>
                <option>Real-estate agent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-emerald-950 px-4 py-3 font-bold text-white"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-emerald-900">
              Log in
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}