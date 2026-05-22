import Button from '../ui/Button';
import { site } from '../../data/site';

export default function Hero() {
  const { hero } = site;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white"
    >

      <div className="relative flex flex-col lg:min-h-screen lg:flex-row">
        <div className="flex w-full items-center justify-center px-6 pb-10 sm:px-10 md:px-12 lg:w-1/2 lg:px-16 lg:pb-12 xl:px-20">
          <div className="w-full max-w-md">
            <span
              aria-hidden="true"
              className="mb-4 block h-1 w-12 bg-primary"
            />
            <p className="mb-4 font-sans text-base font-semibold text-dark">
              {hero.role}
            </p>
            <h1
              id="hero-heading"
              className="font-serif text-4xl leading-tight text-dark md:text-5xl lg:text-[56px] lg:leading-[1.2]"
            >
              {hero.title}
              <br />
              {hero.name}
            </h1>
            <p className="mt-6 font-sans text-base leading-relaxed text-muted">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="primary" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button variant="outline" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex w-full items-start lg:w-1/2 lg:pt-6">
          <img
            src="/assets/images/hero.png"
            alt="Madelyn Torff, UI/UX designer, smiling with a yellow flower"
            loading="eager"
            className="h-auto w-full object-contain object-top object-right"
          />
        </div>
      </div>
    </section>
  );
}
