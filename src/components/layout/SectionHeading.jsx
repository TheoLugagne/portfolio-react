export default function SectionHeading({ children, className = '', id }) {
  return (
    <header className={`text-center${className ? ` ${className}` : ''}`}>
      <h2
        id={id}
        className="font-serif text-3xl text-dark md:text-4xl"
      >
        {children}
      </h2>
      <span
        aria-hidden="true"
        className="mx-auto mt-2 block h-1 w-12 bg-primary"
      />
    </header>
  );
}
