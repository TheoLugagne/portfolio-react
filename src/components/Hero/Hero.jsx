import Container from '../layout/Container';
import Button from '../ui/Button';
import { site } from '../../data/site';
import HeroBlob from './HeroBlob';

export default function Hero() {
  const { hero } = site;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="bg-white py-4 md:py-8 lg:py-12"
    >
      <Container>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full max-w-xl lg:flex-1">
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
            <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-muted">
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
          <div className="relative mx-auto w-full max-w-md flex-shrink-0 lg:mx-0 lg:max-w-none lg:flex-1">
            <div className="relative mx-auto aspect-[396/496] w-full max-w-[396px]">
              <HeroBlob />
              <img
                src={'/assets/images/hero.png'}
                alt="Madelyn Torff, UI/UX designer, smiling with a yellow flower"
                width={396}
                height={496}
                loading="eager"
                className="relative z-10 h-full w-full object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
