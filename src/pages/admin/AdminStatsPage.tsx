import { Link } from 'react-router-dom';
import { useAdminStats } from '../../hooks/useAdminStats';
import Skeleton from '../../components/ui/Skeleton';

interface KpiCardProps {
  label: string;
  value: number;
  description: string;
  linkTo?: string;
  linkLabel?: string;
  accent?: 'primary' | 'green' | 'muted';
}

function KpiCard({
  label,
  value,
  description,
  linkTo,
  linkLabel,
  accent = 'primary',
}: KpiCardProps) {
  const accentClasses = {
    primary: 'bg-primary/20 text-dark',
    green: 'bg-green-100 text-green-800',
    muted: 'bg-dark/10 text-muted',
  };

  return (
    <article className="rounded-card bg-white p-6 shadow-card">
      <p className="font-sans text-sm font-semibold text-muted">{label}</p>
      <p
        className={`mt-3 inline-block rounded-lg px-4 py-2 font-serif text-3xl ${accentClasses[accent]}`}
      >
        {value}
      </p>
      <p className="mt-3 font-sans text-sm text-muted">{description}</p>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="mt-4 inline-block font-sans text-sm font-semibold text-dark underline hover:no-underline"
        >
          {linkLabel} →
        </Link>
      )}
    </article>
  );
}

function KpiSkeleton() {
  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-12 w-20" />
      <Skeleton className="mt-3 h-4 w-full" />
    </div>
  );
}

export default function AdminStatsPage() {
  const { stats, loading, error } = useAdminStats();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-dark">Dashboard</h2>
        <p className="mt-1 font-sans text-sm text-muted">
          Dashboard KPIs and analytics overview.
        </p>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && stats && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Projects"
            value={stats.projectCount}
            description="Total portfolio projects in the database."
            linkTo="/admin/projects"
            linkLabel="Manage projects"
          />
          <KpiCard
            label="Unread messages"
            value={stats.unreadContacts}
            description="Contact form submissions awaiting review."
            linkTo="/admin/contacts"
            linkLabel="View contacts"
            accent={stats.unreadContacts > 0 ? 'primary' : 'muted'}
          />
          <KpiCard
            label="Active testimonials"
            value={stats.activeTestimonials}
            description="Testimonials currently visible on the homepage."
            linkTo="/admin/testimonials"
            linkLabel="Manage testimonials"
            accent="green"
          />
          <KpiCard
            label="Total contacts"
            value={stats.totalContacts}
            description="All contact form submissions received."
            linkTo="/admin/contacts"
            linkLabel="View all messages"
            accent="muted"
          />
        </div>
      )}
    </div>
  );
}
