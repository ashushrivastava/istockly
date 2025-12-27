// frontend/src/pages/CancellationRefundPage.jsx
// Cancellation and Refund Policy page

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const CancellationRefundPage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-gray-400 text-lg mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <p className="text-gray-300 leading-relaxed">
                At iStockly, we strive to provide the best learning experience for our students. 
                We understand that sometimes plans change, and we've designed our cancellation and 
                refund policy to be fair and transparent.
              </p>
            </section>

            {/* Refund Eligibility */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Refund Eligibility</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>You are eligible for a full refund if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You request a refund within <strong className="text-yellow-400">7 days</strong> of purchase</li>
                  <li>You have watched less than <strong className="text-yellow-400">20%</strong> of the course content</li>
                  <li>You have not downloaded any course materials or certificates</li>
                  <li>The course content is significantly different from what was advertised</li>
                  <li>There are technical issues on our platform preventing you from accessing the course</li>
                </ul>
              </div>
            </section>

            {/* Non-Refundable */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Non-Refundable Situations</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Refunds will NOT be provided if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>More than 7 days have passed since the date of purchase</li>
                  <li>You have watched more than 20% of the course content</li>
                  <li>You have downloaded course materials or received a certificate</li>
                  <li>You change your mind after completing a significant portion of the course</li>
                  <li>You violate our terms of service or code of conduct</li>
                  <li>You purchased the course during a promotional sale (sale items are final)</li>
                </ul>
              </div>
            </section>

            {/* Refund Process */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center space-x-3 mb-4">
                <RefreshCw className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">How to Request a Refund</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>To request a refund, please follow these steps:</p>
                <ol className="list-decimal list-inside space-y-3 ml-4">
                  <li>Send an email to <a href="mailto:support@istockly.com" className="text-yellow-400 hover:underline">support@istockly.com</a></li>
                  <li>Include your order ID and registered email address</li>
                  <li>Provide a brief reason for the refund request</li>
                  <li>Our team will review your request within 2-3 business days</li>
                  <li>If approved, the refund will be processed within 7-10 business days</li>
                </ol>
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 font-medium">
                    Note: Refunds will be credited to the original payment method used during purchase.
                  </p>
                </div>
              </div>
            </section>

            {/* Refund Timeline */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Refund Processing Timeline</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black rounded-lg p-4 border border-zinc-800">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">2-3 Days</div>
                    <div className="text-sm">Request Review</div>
                  </div>
                  <div className="bg-black rounded-lg p-4 border border-zinc-800">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">7-10 Days</div>
                    <div className="text-sm">Refund Processing</div>
                  </div>
                  <div className="bg-black rounded-lg p-4 border border-zinc-800">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">3-5 Days</div>
                    <div className="text-sm">Bank Processing</div>
                  </div>
                </div>
                <p className="text-sm">
                  * Total refund time may take up to 15-20 business days depending on your bank or payment provider.
                </p>
              </div>
            </section>

            {/* Cancellation */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-4">Course Cancellation by iStockly</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  In rare cases, we may need to cancel or discontinue a course. If this happens:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You will be notified via email at least 30 days in advance</li>
                  <li>You will receive a full refund automatically</li>
                  <li>We may offer equivalent alternative courses at no additional cost</li>
                  <li>All course materials you've downloaded will remain accessible</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-4">Questions or Concerns?</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you have any questions about our Cancellation and Refund Policy, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong className="text-white">Email:</strong> <a href="mailto:support@istockly.com" className="text-yellow-400 hover:underline">support@istockly.com</a></p>
                  <p><strong className="text-white">Phone:</strong> <a href="tel:+911234567890" className="text-yellow-400 hover:underline">+91 1234567890</a></p>
                  <p><strong className="text-white">Address:</strong> Patna, Bihar, India</p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <section className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <p className="text-yellow-400 text-center">
                This policy is subject to change. We will notify users of any significant changes via email 
                and update the "Last updated" date at the top of this page.
              </p>
            </section>

            {/* Ashu Section */}
            <section className="text-center py-8">
              <p className="text-gray-500 text-sm">Istokely</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationRefundPage;