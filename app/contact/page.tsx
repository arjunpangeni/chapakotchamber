import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import Link from 'next/link'
import { Mail, MapPin, MapPinned, PhoneCall } from 'lucide-react'
import DirectionsButton from '@/components/public/directions-button'

export default function ContactPage() {
  return (
    <div className="min-h-screen public-sky">
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20 space-y-10 md:space-y-12">
        <PageIntro
          title="सदस्यता जानकारी"
          subtitle="सदस्यता प्रक्रिया, सम्पर्क विवरण र कार्यालयको स्थान एकै ठाउँमा हेर्नुहोस्।"
          eyebrow="Contact"
        />

        <section className="card-modern sky-card p-8 md:p-10 border-2 border-primary/10 hover:border-primary/20 group">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors duration-300">सदस्यता कसरी लिने ?</h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-8">
       सदस्यता लिनका लागि, तपाईंले हाम्रो कार्यालयमा उपस्थित भई आवेदन फारम भर्नुहोस्, आवश्यक कागजातहरू पेश गर्नुहोस् र वार्षिक सदस्यता शुल्क भुक्तानी गर्नुहोस्। हाम्रो समितिले प्रस्तावित सदस्यताको समीक्षा गरी अनुमति दिएपछि तपाईंलाई औपचारिक रूपमा सदस्यता प्रदान गरिनेछ।
          </p>
          <ol className="list-decimal list-inside space-y-3 text-foreground/80 text-base md:text-lg">
            <li>कार्यालय भ्रमण: हाम्रो कार्यालयमा आएर सदस्यता आवेदन फारम लिनुहोस् र भर्नुहोस्।</li>
            <li>कागजात पेश: फारमको साथमा आफ्नो पहिचान पत्र र व्यवसाय दर्ता प्रमाणपत्रको प्रतिलिपि बुझाउनुहोस्।</li>
            <li>शुल्क भुक्तानी: सदस्यता शुल्क बैंक मार्फत वा कार्यालयकै नगद काउन्टरमा जम्मा गरी भुक्तानीको प्रमाण (रसिद) प्रदान गर्नुहोस्।</li>
            <li>अनुमोदन: समितिले निर्णय गरेपछि तपाईंको सदस्यता पुष्टि भएको जानकारी दिइनेछ।</li>
          </ol>
        </section>

        <section className="card-modern sky-card group border-2 border-primary/10 p-8 hover:border-primary/20 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 group-hover:text-primary transition-colors duration-300">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="sky-card hover-lift rounded-2xl border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-green-100/60 p-6 transition-all duration-300 hover:border-emerald-400 dark:from-emerald-950/40 dark:to-green-900/30">
              <div className="mb-4 inline-flex rounded-full bg-emerald-500 p-2.5 text-white shadow-md shadow-emerald-500/30">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Phone</h3>
              <Link href="tel:+977846703333" className="text-lg font-semibold text-foreground underline-offset-4 hover:underline">
                +977846703333
              </Link>
            </div>
            <div className="sky-card hover-lift rounded-2xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50 to-cyan-100/60 p-6 transition-all duration-300 hover:border-blue-400 dark:from-blue-950/40 dark:to-cyan-900/30">
              <div className="mb-4 inline-flex rounded-full bg-blue-500 p-2.5 text-white shadow-md shadow-blue-500/30">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Email</h3>
              <Link href="mailto:chapakotchamber@gmail.com" className="break-all text-lg font-semibold text-foreground underline-offset-4 hover:underline">
                chapakotchamber@gmail.com
              </Link>
            </div>
            <div className="sky-card hover-lift rounded-2xl border-2 border-rose-200/60 bg-gradient-to-br from-rose-50 to-orange-100/60 p-6 transition-all duration-300 hover:border-rose-400 dark:from-rose-950/40 dark:to-orange-900/30">
              <div className="mb-4 inline-flex rounded-full bg-rose-500 p-2.5 text-white shadow-md shadow-rose-500/30">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">Address</h3>
              <p className="text-lg font-semibold text-foreground">Chapakot-9, SuntaliTar</p>
            </div>
          </div>
        </section>

        <section className="hover-lift overflow-hidden rounded-2xl border-2 border-primary/10 shadow-lg hover:border-primary/30">
          <div className="flex flex-col gap-3 border-b border-primary/10 bg-gradient-to-r from-white/80 via-sky-50/80 to-blue-50/80 p-4 backdrop-blur md:flex-row md:items-center md:justify-between dark:from-slate-950/70 dark:via-slate-900/70 dark:to-sky-950/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
              <MapPinned className="h-4 w-4 text-primary" />
              Find us quickly on Google Maps
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DirectionsButton />
              <Link
                href="https://www.google.com/maps/place/27.8877989,83.820377"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-primary/20 bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
              >
                Open Full Map
              </Link>
            </div>
          </div>
          <iframe
            src="https://www.google.com/maps?q=27.8877989,83.820377&z=17&output=embed"
            width="100%"
            height="420"
            loading="lazy"
            className="w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
            title="Chapakot Chamber Location"
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}
