import SectionHeading from './SectionHeading';

export default function FlowSection() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 md:py-24">
      <SectionHeading
        eyebrow="Flow"
        title="From sign-up to live listing"
        subtitle="Guests can’t post—sign in, then add your property from your account."
      />

      <ol className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {[
          { step: '01', title: 'Register & open account', body: 'One login for profile, listings, and leads.' },
          { step: '02', title: 'Create your listing', body: 'Add details and submit—track status in your dashboard.' },
          { step: '03', title: 'We approve or follow up', body: 'Approve, request verification, or reject with a clear reason.' },
        ].map((item, i) => (
          <li
            key={item.step}
            className="group relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-200/90 hover:shadow-lg"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-500 text-sm font-bold text-white shadow-md shadow-teal-600/30">
              {item.step}
            </span>
            {i < 2 && (
              <span
                className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-teal-300 to-transparent md:block"
                aria-hidden
              />
            )}
            <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

