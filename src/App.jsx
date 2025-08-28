import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Onboarding from './components/Onboarding.jsx'
import Welcome from './pages/Welcome.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/Home.jsx'
import Booths from './pages/Booths.jsx'
import Map from './pages/Map.jsx'
import PlanVisit from './pages/PlanVisit.jsx'
import Scanner from './pages/Scanner.jsx'
import Profile from './pages/Profile.jsx'
import DriversLicenseSignup from './pages/DriversLicenseSignup.jsx'
import SignupName from './pages/SignupName.jsx'
import SignupDOB from './pages/SignupDOB.jsx'
import SignupGender from './pages/SignupGender.jsx'
import SignupAddress from './pages/SignupAddress.jsx'
import SignupPhone from './pages/SignupPhone.jsx'
import SignupVerify from './pages/SignupVerify.jsx'
import SignupReview from './pages/SignupReview.jsx'
import { getToken } from './utils/auth.js'
import ProfileInformation from './pages/ProfileInformation.jsx'
import LikedItems from './pages/LikedItems.jsx'
import MyFamily from './pages/MyFamily.jsx'
import MyCouponsRewards from './pages/MyCouponsRewards.jsx'

function RootRedirect() { /* unchanged */ }

export default function App() {
  /* unchanged useEffect */
  return (
    <BrowserRouter>
              <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/booths" element={<Booths />} />
          <Route path="/map" element={<Map />} />
          <Route path="/plan-visit" element={<PlanVisit />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/signup/drivers-license" element={<DriversLicenseSignup />} />
          <Route path="/signup/name" element={<SignupName />} />
          <Route path="/signup/dob" element={<SignupDOB />} />
          <Route path="/signup/gender" element={<SignupGender />} />
          <Route path="/signup/address" element={<SignupAddress />} />
          <Route path="/signup/phone" element={<SignupPhone />} />
          <Route path="/signup/verify" element={<SignupVerify />} />
          <Route path="/signup/review" element={<SignupReview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/information" element={<ProfileInformation />} />
          <Route path="/profile/liked-items" element={<LikedItems />} />
          <Route path="/profile/family" element={<MyFamily />} />
          <Route path="/profile/coupons" element={<MyCouponsRewards />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  )
}