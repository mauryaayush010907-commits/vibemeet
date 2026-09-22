export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-10 px-6">
      {icon && <div className="w-12 h-12 mx-auto rounded-full bg-card-2 grid place-items-center text-muted">{icon}</div>}
      <div className="font-display text-xl mt-4">{title}</div>
      {description && <div className="text-sm text-muted mt-2 max-w-md mx-auto">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
