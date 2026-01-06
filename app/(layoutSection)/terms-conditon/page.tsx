import Footer from "@/app/component/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Warr Nutrition",
  description:
    "Terms and Conditions for Warr Nutrition - Read our policies on orders, shipping, returns, and product usage.",
};

export default function TermsConditionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <div className="w-24 h-1 bg-rose-600 mx-auto mt-6"></div>
          </div>

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-gray-700 leading-relaxed text-lg">
              Welcome to <strong>Warr Nutrition</strong>. By using our website{" "}
              <a
                href="https://www.warrnutrition.com"
                className="text-rose-600 font-medium hover:underline"
              >
                https://www.warrnutrition.com
              </a>{" "}
              and purchasing our products, you agree to comply with the
              following Terms & Conditions.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-rose-100 text-rose-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-rose-100 text-rose-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Products & Usage
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>Warr Nutrition provides nutritional supplements...</p>
                <p>Products are intended for personal consumption only.</p>
                <p>Use only as advised by professionals.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-rose-100 text-rose-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Orders & Payments
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>Orders confirmed only after successful payment.</p>
                <p>All prices in INR and inclusive of taxes.</p>
                <p>We may cancel orders due to fraud or unavailability.</p>
              </div>
            </section>

            {/* Section 5 (Health Disclaimer) */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Health Disclaimer
              </h2>
              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
                <div className="text-gray-700 leading-relaxed">
                  <p className="font-medium">Important Health Information:</p>
                  <p>Consult a doctor if you have medical concerns...</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-rose-100 text-rose-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We are not responsible for misuse or negligent handling of
                products.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                Contact Information
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 font-medium">
                  For any queries regarding these Terms & Conditions:
                </p>
                <div className="space-y-3 text-gray-700">
                  <p>📧 Email: support@warrnutrition.com</p>
                  <p>📞 Phone: +91 89200 26757</p>
                  <p>🏢 Address: Booth No-100, Sector 21D Market, Faridabad</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
