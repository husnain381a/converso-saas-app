import CompanionCard from "@/components/CompanionCard";
import { subjectsColors } from "@/constants";
import { getAllCompanions } from "@/lib/actions/companion.actions"

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {

  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : ''
  const topic = filters.topic ? filters.topic : ''

  const companions = await getAllCompanions({ subject, topic })
  
  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Companion Library</h1>
        <div className="flex gap-4">Filters</div>
      </section>

      <section className="companions-grid">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={subjectsColors[companion.subject as keyof typeof subjectsColors]}
          />

        ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary
