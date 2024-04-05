interface HeaderMeetingProps {
  label: string
}

export function BaseHeader({ label }: Readonly<HeaderMeetingProps>) {
  return (
    <section className="mb-6 flex justify-between">
      <h1 className="text-3xl">{label}</h1>
    </section>
  )
}
