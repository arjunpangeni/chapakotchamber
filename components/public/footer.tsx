import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Mail, MapPin, Phone, ExternalLink, Clock3 } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Members', href: '/members' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'News', href: '/news' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ]

  const importantLinks = [
    { label: 'कम्पनी रजिष्ट्रारको कार्यालय', href: 'https://ocr.gov.np/' },
    { label: 'व्यापार तथा निकासी प्रवद्र्धन केन्द्र', href: 'https://tepc.gov.np/' },
    { label: 'उद्योग विभाग', href: 'https://doind.gov.np/' },
    { label: 'वाणिज्य, आपूर्ति तथा उपभोक्ता संरक्षण विभाग', href: 'https://www.doc.gov.np/' },
    { label: 'उद्योग, पर्यटन, वन तथा वातावरण मन्त्रालय (गण्डकी प्रदेश)', href: 'https://motics.gandaki.gov.np/' },
  ]

  return (
    <footer className="news-font bg-card border-t border-primary/10 text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
            <Link href="/" className="inline-flex items-center" aria-label="चापाकोट उद्योग वाणिज्य संघ.">
              <Image
                src="/logo.svg"
                alt="चापाकोट उद्योग वाणिज्य संघ."
                width={340}
                height={110}
                className="h-14 sm:h-16 w-auto dark:invert"
              />
            </Link>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed max-w-xs">
              स्थानीय व्यवसायिक विकास र सामुदायिक समृद्धिमा समर्पित।
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-foreground/70 pt-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span>Chapakot, Syangja</span>
            </div>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-bold text-base text-foreground">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm flex flex-col items-center sm:items-start">
              {quickLinks.map((link) => (
                <li key={link.href} className="block">
                  <Link
                    href={link.href}
                    className="inline-block text-foreground/70 hover:text-primary transition-colors duration-200 relative group w-fit"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full w-0 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-bold text-base text-foreground">महत्वपूर्ण लिंकहरु</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm flex flex-col items-center sm:items-start">
              {importantLinks.map((link) => (
                <li key={link.href} className="block">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-1.5 text-foreground/70 hover:text-primary transition-colors duration-200 group w-fit"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200 flex-1">
                      {link.label}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100 mt-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-bold text-base text-foreground">सम्पर्क जानकारी</h4>
            <div className="space-y-4 flex flex-col items-center sm:items-start">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <a
                  href="https://www.facebook.com/ruhii.shrestha.1?rdid=NzCaK0CsJpy8qwer&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CPnZciHVL%2F#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook page"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200 flex-shrink-0"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <div className="flex flex-col gap-1">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Follow us</span>
                  <span className="text-xs text-foreground/60">Facebook</span>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-foreground/70 hover:text-primary transition-colors duration-200">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <a href="mailto:info@chapakotcc.org" className="hover:underline truncate">
                    chapakotchamber@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-foreground/70 hover:text-primary transition-colors duration-200">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <a href="tel:+9779846703333
" className="hover:underline">
                    9846703333
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-foreground/70">
                  <Clock3 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <span>कार्यालय खुल्ने समय : १०- ४ बजे</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8" />

        <div className="text-center text-xs sm:text-sm text-foreground/60">
          <p className="leading-relaxed">
            © {currentYear} चापाकोट उद्योग वाणिज्य संघ. सबै अधिकार सुरक्षित।
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            <span className="block sm:inline">
              Built by <span className="font-semibold text-rose-500"><a href="https://linktr.ee/arjunpangeni" target="_blank">Arjun Pangeni</a></span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
