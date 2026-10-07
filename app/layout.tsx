import "./globals.css";
export const metadata={title:"LOCKED IN",description:"Tu sistema personal de disciplina",manifest:"/manifest.webmanifest",appleWebApp:{capable:true,title:"LOCKED IN",statusBarStyle:"black-translucent"}};
export const viewport={width:"device-width",initialScale:1,maximumScale:1,themeColor:"#0b0d10"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}