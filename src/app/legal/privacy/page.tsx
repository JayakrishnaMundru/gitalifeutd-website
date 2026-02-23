export default function PrivacyPage() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <h2>What we collect</h2>
      <ul>
        <li>Event RSVPs (name, email, optional phone, student status, dietary preference, notes).</li>
        <li>Messages you send via the contact form.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To manage event attendance and communicate event details.</li>
        <li>To improve our programs and community outreach.</li>
      </ul>

      <h2>Sharing</h2>
      <p>We do not sell your data. We only share it with organizers to run club events.</p>

      <h2>Contact</h2>
      <p>If you have privacy questions, contact us via the contact page.</p>
    </div>
  )
}
