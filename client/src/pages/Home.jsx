import React from 'react'
import MainBanner from '../components/MainBanner'
import HowItWorks from '../components/HowItWorks'
import CareerPathways from '../components/CareerPathways'
import SkillsHub from '../components/SkillsHub'
import IndustryTrends from '../components/IndustryTrends'
import ComparisonTool from '../components/ComparisonTool'
import Faq from '../components/Faq'
import FinalCTA from '../components/FinalCTA'



const Home = () => {
  return (
    <div>
        <MainBanner />
        <HowItWorks/>
        <CareerPathways />
        <SkillsHub />
        <IndustryTrends />
        <ComparisonTool />
        <Faq />
        <FinalCTA />
        
       
        
    </div>
  )
}

export default Home
