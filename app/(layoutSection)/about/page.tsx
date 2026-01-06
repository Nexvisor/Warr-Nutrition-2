import FooterSection from "@/app/component/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Warr Nutrition",
  description:
    "Learn about Warr Nutrition - Your trusted partner in peak performance and well-being. Premium supplements for fitness enthusiasts and athletes.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-lg text-gray-600">
              Your trusted partner in peak performance and well-being
            </p>
            <div className="w-24 h-1 bg-rose-600 mx-auto mt-6"></div>
          </div>

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Warr Nutrition</strong> empowers athletes and fitness
              enthusiasts to unlock elite performance. Visit us at{" "}
              <a
                href="https://www.warrnutrition.com"
                className="text-rose-600 font-medium hover:underline"
              >
                warrnutrition.com
              </a>{" "}
              to explore our product range.
            </p>
          </div>

          {/* About Sections */}
          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span
                  className="bg-rose-100 text-rose-800 rounded-full 
                w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
                >
                  1
                </span>
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To provide high-quality and authentic nutritional supplements
                that support muscle growth, endurance, recovery & overall
                performance — backed by science and trust.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span
                  className="bg-rose-100 text-rose-800 rounded-full 
                w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
                >
                  2
                </span>
                What Sets Us Apart
              </h2>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Premium Quality
                    </h3>
                    <p>
                      Every product is checked for purity, safety, and
                      effectiveness.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Performance-Driven Formulas
                    </h3>
                    <p>Created for athletes who demand the best.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Customer First
                    </h3>
                    <p>Fast delivery, secure checkout & responsive support.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span
                  className="bg-rose-100 text-rose-800 rounded-full 
                w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
                >
                  3
                </span>
                Who We Serve
              </h2>
              <div
                className="bg-rose-50 border-l-4 border-rose-600 
              p-4 rounded-r-lg"
              >
                <p className="text-gray-700 leading-relaxed">
                  From beginners to elite athletes — our products cater to
                  individuals serious about strength, results & wellbeing.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span
                  className="bg-rose-100 text-rose-800 rounded-full 
                w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
                >
                  4
                </span>
                Our Promise
              </h2>
              <div
                className="bg-rose-50 border border-rose-200 rounded-lg 
              p-6 text-center"
              >
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  Authenticity. Transparency. Performance.
                  <br />
                  That’s the Warr Nutrition standard.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
