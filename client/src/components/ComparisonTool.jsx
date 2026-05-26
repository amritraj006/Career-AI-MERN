import React from 'react';
import { ArrowRight, BarChart2, Clock, DollarSign, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sampleCareers = [
  {
    id: 1,
    title: 'AI Engineer',
    salary: '$158k',
    growth: '38%',
    entry: '24 mo',
    fit: 91,
    skills: ['Python', 'LLMs', 'MLOps'],
  },
  {
    id: 2,
    title: 'Data Scientist',
    salary: '$124k',
    growth: '36%',
    entry: '20 mo',
    fit: 84,
    skills: ['SQL', 'Statistics', 'ML'],
  },
  {
    id: 3,
    title: 'UX Designer',
    salary: '$98k',
    growth: '16%',
    entry: '10 mo',
    fit: 76,
    skills: ['Figma', 'Research', 'Testing'],
  },
];

const metrics = [
  { name: 'Salary', icon: DollarSign, key: 'salary' },
  { name: 'Growth', icon: TrendingUp, key: 'growth' },
  { name: 'Entry Time', icon: Clock, key: 'entry' },
  { name: 'Fit Score', icon: Target, key: 'fit' },
];

const ComparisonTool = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/comparison-tool-page');
    window.scrollTo(0, 0);
  };

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-16 text-slate-950 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              AI-ready comparison
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Compare <span className="text-primary">Career Paths</span>
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Score roles by income, growth, time to entry, work-life fit, and your own priorities.
            </p>
          </div>

          <button
            onClick={handleButtonClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dull"
          >
            Launch Tool
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50">
              <div className="p-4 text-sm font-bold text-slate-600">Metric</div>
              {sampleCareers.map((career) => (
                <div key={career.id} className="border-l border-slate-200 p-4 text-center">
                  <p className="text-sm font-bold text-slate-950">{career.title}</p>
                </div>
              ))}
            </div>

            {metrics.map((metric) => (
              <div key={metric.key} className="grid grid-cols-4 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-2 p-4 text-sm font-semibold text-slate-700">
                  {React.createElement(metric.icon, { className: 'h-4 w-4 text-slate-400' })}
                  {metric.name}
                </div>
                {sampleCareers.map((career) => (
                  <div key={`${career.id}-${metric.key}`} className="border-l border-slate-100 p-4 text-center text-sm font-semibold text-slate-800">
                    {metric.key === 'fit' ? `${career.fit}%` : career[metric.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-950">Weighted Fit Ranking</h3>
                <p className="text-sm text-slate-500">Live scores adjust to your priorities.</p>
              </div>
            </div>

            <div className="space-y-4">
              {sampleCareers.map((career) => (
                <div key={career.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{career.title}</span>
                    <span className="font-bold text-slate-950">{career.fit}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${career.fit}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {career.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTool;
