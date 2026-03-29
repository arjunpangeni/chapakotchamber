import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">डैशबोर्ड गाइड</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          कसरी काम गर्छ — सम्पूर्ण जानकारी
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>खाता जानकारी</CardTitle>
          <CardDescription>आपको Admin खाताको विवरण</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">इमेल</label>
            <p className="text-base sm:text-lg font-semibold mt-1 break-all">{session?.user?.email}</p>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">नाम</label>
            <p className="text-base sm:text-lg font-semibold mt-1">{session?.user?.name || 'सेट गरिएको छैन'}</p>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">भूमिका</label>
            <p className="text-base sm:text-lg font-semibold mt-1 capitalize">
              {session?.user?.role || 'User'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📱</span> यो Dashboard कस्तो काम गर्छ?
          </CardTitle>
          <CardDescription>चापाकोट उद्योग वाणिज्य संघको सम्पूर्ण व्यवस्थापन</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-foreground leading-relaxed">
            यो चापाकोट उद्योग वाणिज्य संघको management system हो। यस dashboard मार्फत तपाईं आफ्नो संगठनका <strong>members, news, jobs, र gallery</strong> सजिलै manage गर्न सक्नुहुन्छ।
          </p>
        </CardContent>
      </Card>

      {/* President Section */}
      <Card className="border-l-4 border-l-sky-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>👑</span> अध्यक्ष 
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-sky-50 dark:bg-sky-950/30 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">कसरी सेट गर्ने:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Members</strong> खण्डमा गएर अध्यक्षको profile मा <strong>Priority = 1</strong> दिनुहोस् — १ नै सर्वोच्च प्राथमिकता हो
              </p>
            </div>
            <Separator className="bg-sky-200 dark:bg-sky-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">Homepage मा दृश्य:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Priority = 1</strong> भएको member (अध्यक्ष) homepage को <strong>"President's Message"</strong> section मा देखिन्छ
              </p>
            </div>
            <Separator className="bg-sky-200 dark:bg-sky-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">उदाहरण:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                राज कुमार सिंहको <strong>Priority = 1</strong> राखेमा उनको फोटो, नाम र सन्देश homepage मा प्रदर्शित हुन्छ
              </p>
            </div>
            <Separator className="bg-sky-200 dark:bg-sky-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">🎯 सुझाव:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground bg-sky-100 dark:bg-sky-900/50 p-2 rounded">
                अध्यक्षको profile photo र Name मिलाएर राखेपछि मात्र Priority set गर्नुहोस्
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs & Contact */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>💼</span> Jobs र सम्पर्क नम्बर
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">⚠️ अनिवार्य:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground bg-amber-100 dark:bg-amber-900/50 p-2 rounded">
                Job post गर्दा <strong>Company नाम छनोट गर्नै पर्छ</strong>
              </p>
            </div>
            <Separator className="bg-amber-200 dark:bg-amber-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">सम्पर्क नम्बरको दृश्यता:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                कुनै company को सम्पर्क नम्बर <strong>तब मात्र सार्वजनिक हुन्छ</strong>, जब त्यो company ले कुनै job post गरेको हुन्छ
              </p>
            </div>
            <Separator className="bg-amber-200 dark:bg-amber-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">उदाहरण:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>ABC Industries</strong> ले "Content Writer" को job post गरेमा ABC को सम्पर्क नम्बर <strong>सबै users लाई देखिन्छ</strong>
              </p>
            </div>
            <Separator className="bg-amber-200 dark:bg-amber-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">🔒 गोपनीयता:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground bg-amber-100 dark:bg-amber-900/50 p-2 rounded">
                यो system ले members को सम्पर्क नम्बर अनावश्यक रूपमा सार्वजनिक हुनबाट जोगाउँछ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership & Job Posting */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>🏢</span> Membership र Job Posting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">मुख्य नियम:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded">
                केवल दर्ता भएका (Registered) Members मात्र job post गर्न पाउँछन्
              </p>
            </div>
            <Separator className="bg-emerald-200 dark:bg-emerald-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">Membership status जाँच्न:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Members</strong> खण्डमा गएर सम्बन्धित member को <strong>"Membership Status"</strong> — Active छ कि छैन हेर्नुहोस्
              </p>
            </div>
            <Separator className="bg-emerald-200 dark:bg-emerald-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">Job post गर्ने तरिका:</h4>
              <div className="text-xs sm:text-sm text-muted-foreground bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded space-y-1">
                <p><strong>Admin</strong> → <strong>Jobs</strong> → <strong>+ New Job</strong></p>
                <p>→ Company छनोट गर्नुस् → विवरण भर्नुस् → <strong>Save</strong></p>
              </div>
            </div>
            <Separator className="bg-emerald-200 dark:bg-emerald-900" />
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-2">उदाहरण:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>XYZ Ltd</strong> को membership active छ भने website मा <strong>XYZ Ltd</strong> का jobs देखिन्छन्
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Features */}
      <Card className="border-l-4 border-l-rose-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>⚙️</span> मुख्य Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-rose-200 dark:border-rose-900">
                  <th className="text-left p-2 font-semibold">Feature</th>
                  <th className="text-left p-2 font-semibold">विवरण</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr className="border-b border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                  <td className="p-2 font-semibold">📰 News</td>
                  <td className="p-2">Articles र news post गर्नुस् — URL ठेगाना (slug) title बाट स्वतः बन्छ</td>
                </tr>
                <tr className="border-b border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                  <td className="p-2 font-semibold">👥 Committee</td>
                  <td className="p-2">संगठनका समिति सदस्यहरूको नामावली राख्नुस्</td>
                </tr>
                <tr className="border-b border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                  <td className="p-2 font-semibold">🏪 Members</td>
                  <td className="p-2">व्यावसायिक members र उनीहरूको विवरण manage गर्नुस्</td>
                </tr>
                <tr className="border-b border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                  <td className="p-2 font-semibold">📸 Gallery</td>
                  <td className="p-2">कार्यक्रमका photo albums upload गर्नुस् — URL ठेगाना (slug) स्वतः तयार हुन्छ</td>
                </tr>
                <tr className="bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40">
                  <td className="p-2 font-semibold">☁️ Storage</td>
                  <td className="p-2"><strong>सबै photos Cloudinary मा सुरक्षित</strong> — छिटो loading र भरपर्दो</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Theme Recommendation */}
      <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>🌙</span> Theme सिफारिस
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm md:text-base mb-2">सर्वोत्तम अनुभवका लागि:</h4>
            <p className="text-xs sm:text-sm text-muted-foreground bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded">
              Dashboard <strong>Light Mode</strong> मा प्रयोग गर्नुस्
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm md:text-base mb-2">कारण:</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Forms र data entry गर्दा Light Mode मा पढ्न र काम गर्न सहज हुन्छ
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm md:text-base mb-2">Theme बदल्न:</h4>
            <p className="text-xs sm:text-sm text-muted-foreground bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded">
              Dashboard को माथि दायाँ कुनामा रहेको <strong>🌙 icon</strong> थिचेर <strong>Light / Dark Mode</strong> बीच सट्न सकिन्छ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚡</span> प्रविधिगत जानकारी
          </CardTitle>
          <CardDescription>System को पृष्ठभूमि</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-muted-foreground mb-1">डेटाबेस</p>
              <p className="font-semibold text-sm">MongoDB</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-xs text-muted-foreground mb-1">फोटो भण्डारा</p>
              <p className="font-semibold text-sm">Cloudinary</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-xs text-muted-foreground mb-1">सुरक्षा प्रणाली</p>
              <p className="font-semibold text-sm">NextAuth.js</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-900">
              <p className="text-xs text-muted-foreground mb-1">फ्रेमवर्क</p>
              <p className="font-semibold text-sm">Next.js 16</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Summary */}
      <Card className="border-l-4 border-l-violet-500">
        <CardHeader>
          <CardTitle>📋 चीट शीट (Quick Reference)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-2">
            <p><strong>✅ नयाँ Member जोडौँ:</strong> Members → + New Member → विवरण भर्नुस् → Save</p>
            <p><strong>✅ Member को Priority सेट गर्न:</strong> Members → Member name → Priority = 1 (अध्यक्षको लागि)</p>
            <p><strong>✅ नोकरी पोस्ट गर्न:</strong> Jobs → + New Job → Company छनोट → विवरण → Save</p>
            <p><strong>✅ समाचार पोस्ट गर्न:</strong> News → + New News → Title दिनुस् (slug स्वतः बन्छ) → Content → Publish</p>
            <p><strong>✅ ग्यालेरी अपलोड गर्न:</strong> Gallery → + New Album → Event Name दिनुस् → Photos अपलोड → Save</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
