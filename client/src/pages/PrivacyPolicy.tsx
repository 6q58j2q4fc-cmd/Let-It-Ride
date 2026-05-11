import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[oklch(0.14_0.03_148)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium mb-5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Legal
            </div>
            <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
              Privacy <span className="text-gradient-amber">Policy</span>
            </h1>
            <p className="text-white/60 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-slate prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">

            <p className="text-base leading-relaxed text-muted-foreground mb-8">
              Welcome to our website. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines the types of information we collect from visitors, how we use that information, and the steps we take to protect it.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-3">When you visit our website, we may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Name</li>
              <li>Phone Number</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-3">
              By providing your name and phone number, you consent to receive text messages from us. We may use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>To send you offers and promotional information via text message.</li>
              <li>To provide you with updates about our products, services, and events.</li>
              <li>To respond to your inquiries and provide customer support.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              We do not share mobile contact information with third parties or affiliates for marketing or promotional purposes. Information may be shared with service providers who support our operations, such as customer service. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Text Messaging</h2>
            <p className="text-muted-foreground mb-6">
              By submitting your phone number, you authorize us to send text messages to the number you provided. These messages may be sent using automated technology. Please note that message and data rates may apply. Your consent to receive text messages is not a condition of purchase.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We take reasonable measures to protect the personal information we collect from unauthorized access, disclosure, alteration, or destruction.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Opt-out of receiving text messages at any time by following the instructions provided in the messages.</li>
              <li>Request access to the personal information we hold about you.</li>
              <li>Request that we update or correct any inaccurate or outdated personal information.</li>
              <li>Request that we delete your personal information, subject to certain exceptions required by law.</li>
            </ul>

            <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/15">
              <p className="text-sm text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:info@pedegobend.com" className="text-primary font-medium hover:underline">info@pedegobend.com</a>{' '}
                or call us at{' '}
                <a href="tel:+15416472331" className="text-primary font-medium hover:underline">(541) 647-2331</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
