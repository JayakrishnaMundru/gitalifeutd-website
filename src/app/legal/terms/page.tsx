export default function TermsPage() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>Terms</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <h2>General</h2>
      <p>
        This website is provided for informational purposes to share events and resources for the GitaLife UTD student community.
      </p>

      <h2>Event participation</h2>
      <p>
        Participation is voluntary. Please follow UT Dallas policies and treat everyone respectfully.
      </p>

      <h2>Content</h2>
      <p>
        Content may change without notice. We aim to keep event details accurate, but schedules may be updated.
      </p>

      <h2>Contact</h2>
      <p>If you have questions, contact us via the contact page.</p>
    </div>
  )
}
