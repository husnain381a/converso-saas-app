import CompanionCard from "@/components/CompanionCard"
import CompanionsList from "@/components/CompanionsList"
import CTA from "@/components/CTA"
import { recentSessions, subjectsColors } from "@/constants"
import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.actions"

const Page = async () => {
  const companions = await getAllCompanions({limit: 3})
  const recentSessionsCompanions = await getRecentSessions(10)
  return (
    <main>
      <h1>Popular Companions</h1>
      <section className="home-section">

        {/* Fetching all companions from db */}
        {companions.map((companion)=>(
          <CompanionCard
          key={companion.id}
          {...companion}
          color= {subjectsColors[companion.subject as keyof typeof subjectsColors]}
          />
        ))}

      </section>
      
      <section className="home-section">
        <CompanionsList
        title="Recently Completed Sessions"
        companions={recentSessionsCompanions}
        classNames="w-2/3 max-lg:w-full"
        />
        <CTA/>
      </section>
    </main>
  )
}

export default Page