import { Star } from 'lucide-react';

const testimonials = [
  {
    initials: 'SK',
    name: 'Sarah K.',
    role: 'Former Marketing → UX Designer',
    rating: 5,
    quote:
      'PathCraft helped me pivot from marketing to UX design. The career test pinpointed my strengths, and the roadmap gave me a clear 6-month plan I could actually follow.',
  },
  {
    initials: 'MR',
    name: 'Marcus R.',
    role: 'CS Student → Software Engineer',
    rating: 5,
    quote:
      'The comparison tool and pathway details made choosing between backend and full-stack so much easier. I landed my first internship within 3 months of starting.',
  },
  {
    initials: 'PL',
    name: 'Priya L.',
    role: 'Biology Major → Data Scientist',
    rating: 5,
    quote:
      'As a non-CS major, I felt lost. The AI roadmap broke down exactly what to learn each week. Interview prep questions were spot-on for my data analyst interviews.',
  },
  {
    initials: 'JT',
    name: 'James T.',
    role: 'IT Support → Cybersecurity Analyst',
    rating: 4,
    quote:
      'Saved my favorite pathways and tracked everything on the dashboard. The cybersecurity assessment showed me exactly where to focus my study time.',
  },
];

const Testimonials = () => (
  <section className="py-16 md:py-24 bg-white text-gray-900">
    <div className="container mx-auto px-6">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Students Who <span className="text-primary">Transformed</span> Their Careers
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real stories from learners who used PathCraft to discover their path and land their dream roles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>

            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star
                  key={si}
                  className={`w-4 h-4 ${si < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed flex-grow">&ldquo;{t.quote}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
