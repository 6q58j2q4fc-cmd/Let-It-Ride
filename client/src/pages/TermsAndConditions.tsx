import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText } from "lucide-react";
import { Link } from "wouter";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[oklch(0.14_0.03_148)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium mb-5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Legal
            </div>
            <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
              Terms &amp; <span className="text-gradient-amber">Conditions</span>
            </h1>
            <p className="text-white/60 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="container">
          <div className="max-w-3xl mx-auto">

            {/* SMS Program Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-6">Pedego Electric Bikes Bend SMS Program</h2>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  When you opt in to our SMS program, you may receive messages related to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Appointment reminders and confirmations</li>
                  <li>Customer support responses</li>
                  <li>Automated replies outside business hours</li>
                  <li>Post-purchase review invitations</li>
                </ul>

                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                  <h3 className="font-semibold text-foreground mb-2">How to Cancel</h3>
                  <p>
                    You can cancel the SMS service at any time. Just text <strong className="text-foreground">"STOP"</strong> to us. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-primary/5 border border-primary/15">
                  <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                  <p>
                    If you are experiencing issues with the messaging program you can reply with the keyword <strong className="text-foreground">HELP</strong> for more assistance, or you can get help directly at{' '}
                    <a href="mailto:info@pedegobend.com" className="text-primary font-medium hover:underline">info@pedegobend.com</a>.
                  </p>
                </div>

                <p>
                  Carriers are not liable for delayed or undelivered messages.
                </p>

                <p>
                  As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency varies. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.
                </p>

                <p>
                  If you have any questions regarding privacy, please read our{' '}
                  <Link href="/privacy-policy" className="text-primary font-medium hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            {/* General Terms */}
            <div className="border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground mb-6">General Terms of Use</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Use of Website</h3>
                  <p>
                    By accessing and using the Let It Ride Electric Bikes website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Booking and Reservations</h3>
                  <p>
                    All tour and rental bookings are subject to availability. Reservations are confirmed upon receipt of payment. Cancellations made more than 48 hours in advance will receive a full refund. Cancellations within 48 hours of the scheduled tour may be subject to a cancellation fee.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Liability Waiver</h3>
                  <p>
                    All participants in e-bike tours and rentals are required to sign a liability waiver prior to participation. Participants must wear helmets at all times. Let It Ride Electric Bikes is not responsible for injuries resulting from failure to follow safety guidelines.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Intellectual Property</h3>
                  <p>
                    All content on this website, including text, images, logos, and graphics, is the property of Let It Ride Electric Bikes and is protected by applicable copyright and trademark laws. Unauthorized use is prohibited.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Changes to Terms</h3>
                  <p>
                    We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the new terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Contact Us</h3>
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us at{' '}
                    <a href="mailto:info@pedegobend.com" className="text-primary font-medium hover:underline">info@pedegobend.com</a>{' '}
                    or call{' '}
                    <a href="tel:+15416472331" className="text-primary font-medium hover:underline">(541) 647-2331</a>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
