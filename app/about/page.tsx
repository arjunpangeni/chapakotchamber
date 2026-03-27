import Navigation from '@/components/public/navigation'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen public-sky">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <PageIntro
          title="About Chapakot Chamber of Commerce"
          subtitle="Supporting business growth and community development since our establishment"
          eyebrow="About"
          align="left"
        />

        {/* Our Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="sky-card">
            <CardContent className="p-6 space-y-4">
              <Target className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To promote sustainable business growth and foster a thriving entrepreneurial
                  ecosystem in Chapakot and surrounding areas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="sky-card">
            <CardContent className="p-6 space-y-4">
              <Heart className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading business organization that champions economic prosperity and
                  social development in our community.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="sky-card">
            <CardContent className="p-6 space-y-4">
              <Users className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                <p className="text-muted-foreground">
                  Integrity, collaboration, innovation, and community commitment guide all our
                  actions and decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Who We Are</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Chapakot Chamber of Commerce is a membership organization dedicated to advancing
              the business interests of our community. We bring together entrepreneurs, business
              owners, and professionals from various sectors to collaborate, network, and grow.
            </p>
            <p>
              Our diverse membership spans retail, hospitality, manufacturing, technology, tourism,
              education, healthcare, and many other industries. We work collectively to create an
              environment where businesses can thrive and contribute to our local economy.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Networking & Connections</h3>
              <p className="text-muted-foreground">
                We facilitate meaningful connections between businesses, creating opportunities
                for partnerships, collaborations, and mutual growth.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Business Resources</h3>
              <p className="text-muted-foreground">
                Our members gain access to valuable resources, information, and support to help
                their businesses succeed and scale.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Employment Opportunities</h3>
              <p className="text-muted-foreground">
                We maintain an active job board connecting skilled professionals with promising
                employment opportunities in our community.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Community Advocacy</h3>
              <p className="text-muted-foreground">
                We advocate for policies and initiatives that support business development and
                economic growth in our region.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Events & Training</h3>
              <p className="text-muted-foreground">
                We organize regular events, workshops, and training programs to enhance skills
                and knowledge of our members.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">News & Updates</h3>
              <p className="text-muted-foreground">
                Stay informed with our regular news updates covering industry trends, member
                achievements, and community developments.
              </p>
            </div>
          </div>
        </div>

        {/* Membership Section */}
        <Card className="bg-primary/10 sky-card">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold">Join Our Community</h2>
            <p className="text-muted-foreground max-w-2xl">
              Whether you're an established business or just starting out, Chapakot Chamber of
              Commerce welcomes you. Membership provides access to networking opportunities,
              resources, and support to help your business succeed.
            </p>
            <p className="text-muted-foreground max-w-2xl">
              Become part of our growing community of business leaders and entrepreneurs committed
              to creating a thriving local economy.
            </p>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="sky-card">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">Chapakot, Makwanpur, Nepal</p>
              </CardContent>
            </Card>

            <Card className="sky-card">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+977-XXXXXXXXX</p>
              </CardContent>
            </Card>

            <Card className="sky-card">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">info@chapakotchamber.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
