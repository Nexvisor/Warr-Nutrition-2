import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#B50D27] to-[#7a071a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 mr-4 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-xl text-rose-100 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our
            website and purchasing our products.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Effective Date */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-rose-600">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-rose-600 mr-2" />
              <span className="font-semibold text-gray-800">
                Effective Date:
              </span>
            </div>
            <p className="text-gray-600">25 May, 2025</p>
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Website:</strong> www.warrnutrition.com
                <br />
                <strong>Owner:</strong> Warr Nutrition
              </p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-rose-600 mr-3" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be
                bound by the terms and conditions described below. If you do not
                agree to these terms, please do not use this site.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Eligibility
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 18 years old to purchase any products from
                this website. By using our site, you confirm that you are
                legally eligible to enter into binding contracts.
              </p>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                3. Products & Usage Disclaimer
              </h2>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                <p className="text-orange-800 font-semibold">
                  Important Health Notice
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our supplements are not intended to diagnose, treat, cure, or
                prevent any disease...
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Payment Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All prices are listed in INR (₹) and are inclusive of applicable
                taxes...
              </p>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800">
                  <strong>Security:</strong> Your payment information is
                  processed securely...
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Shipping & Delivery
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-rose-50 p-4 rounded-md">
                  <h3 className="font-semibold text-rose-800 mb-2">Coverage</h3>
                  <p className="text-rose-700">We deliver PAN India</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-md">
                  <h3 className="font-semibold text-rose-800 mb-2">
                    Processing Time
                  </h3>
                  <p className="text-rose-700">
                    Orders dispatched within 1–3 business days
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                Delivery timelines...
              </p>
            </div>

            {/* Section 7 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Return & Refund Policy
              </h2>
              <div className="space-y-4">
                <div className="bg-rose-50 border-l-4 border-rose-600 p-4">
                  <p className="text-rose-800 font-semibold">
                    Important: No returns once opened
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  However, if a product is damaged during shipping...
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#B50D27] to-[#7a071a] text-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Mail className="h-6 w-6 mr-3" />
                11. Contact Information
              </h2>

              <p className="mb-6 text-rose-100">
                For any queries regarding your order or these terms...
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-rose-200" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-rose-100">support@warrnutrition.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-rose-200" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-rose-100">+91 89200 26757</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 p-6 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              Last updated: 25 May, 2025 | Subject to change without notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
