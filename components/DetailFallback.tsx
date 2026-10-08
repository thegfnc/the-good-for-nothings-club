/**
 * App Shell placeholder for project and member pages: the page card's
 * frame, empty. Clicking a link shows this instantly while the (static,
 * cached) page content arrives.
 */
export default function DetailFallback() {
  return (
    <main>
      <section className='md:px-8 xl:px-16'>
        <div className='bg-background mx-auto min-h-[70vh] max-w-(--page-max-width) border-b-2 border-black md:border-x-2' />
      </section>
    </main>
  )
}
