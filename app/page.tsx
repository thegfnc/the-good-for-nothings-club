import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <section className='py-16 text-center md:px-8 md:py-24 xl:px-16'>
        <div className='mx-auto max-w-[1792px]'>
          <h1 className='text-hero-banner-heading leading-[83.33%] tracking-[-0.06em]'>
            <span>Good For</span>
            <br /> <span className='font-sansGlitch font-normal'>Nothings</span>
          </h1>
        </div>
      </section>
      <section className='md:px-8 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <p className='text-2xl leading-tight sm:text-[32px] 2xl:text-[48px]'>
            <em>The Good for Nothings Club</em> is a creators club from Austin,
            TX made up of designers, engineers, filmmakers, musicians, and
            writers. Club members bring projects and meet weekly to lend
            expertise, collaborate, and hold each other accountable on progress.
            Good for nothings. Great at everything.
          </p>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Projects
          </h2>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Members
          </h2>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Happenings
          </h2>
        </div>
      </section>
    </main>
  )
}
