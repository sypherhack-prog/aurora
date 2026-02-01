import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingCTA } from '@/components/landing/LandingCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
            <LandingNavbar />
            <LandingHero />
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingTestimonials />
            <LandingCTA />
            <LandingFooter />
        </div>
    )
}
