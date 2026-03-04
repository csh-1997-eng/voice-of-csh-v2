export const siteConfig = {
  name: "Voice of Cole Hoffman",
  shortName: "Cole Hoffman",
  description: "Editorial personal platform for writing, video, and technical insights.",
  location: "New York, NY",
  links: {
    github: "https://github.com/csh-1997-eng",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/",
    youtube: "https://www.youtube.com/@lordcolton.mp3",
    x: "https://x.com/lordcolton_exe",
    cal: process.env.NEXT_PUBLIC_CALCOM_URL || "https://cal.com/csh-1997-eng",
    email: process.env.NEXT_PUBLIC_CALCOM_URL || "https://cal.com/csh-1997-eng",
  },
}
