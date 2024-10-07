import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold text-emerald-600 mb-6">
        Terms and Conditions
      </h1>

      <p className="mb-6">
        Welcome to our exam system. By using our service, you agree to the
        following terms and conditions:
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          1. General Overview
        </h2>
        <p>
          Our platform allows instructors to create, assign, and manage online
          exams. The exams are assigned to specific participants through their
          email addresses. By using our service, you agree to comply with all
          the rules, guidelines, and procedures detailed herein.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          2. Camera Usage and Monitoring
        </h2>
        <p>
          During exams, the system requires access to your camera to ensure the
          integrity of the examination process. Photos are taken at intervals
          and analyzed using AI to identify any instances of cheating. Note that
          no images are stored in our database; they are analyzed in real time
          and discarded immediately thereafter.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          3. Monitoring Behavior During the Exam
        </h2>
        <p>
          While the exam is in progress, your behavior will be monitored to
          detect suspicious activity. This includes, but is not limited to,
          detecting tab switching, copy-pasting actions, and any attempts to
          access other resources during the examination. Our system logs these
          actions to ensure the fairness of the examination process.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          4. Data Storage and Privacy
        </h2>
        <p>
          Our platform stores relevant exam data, including your responses,
          timestamps, and behavioral logs during the exam. These data are saved
          to provide an accurate evaluation of your performance and are shared
          with the instructor for assessment purposes.
        </p>
        <p className="mt-4">
          We respect your privacy and are committed to handling your data
          responsibly. Only the necessary data for the exam process are
          collected, and no personal images are stored beyond their immediate
          purpose for analysis.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          5. User Responsibilities
        </h2>
        <p>By using this platform, you agree to:</p>
        <ul className="list-disc list-inside mt-4">
          <li>
            Keep your login credentials confidential and not share them with
            others.
          </li>
          <li>
            Participate honestly in the exam without using unauthorized
            resources.
          </li>
          <li>
            Allow access to your camera and microphone during the exam for
            monitoring purposes.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          6. Misconduct and Cheating
        </h2>
        <p>
          Any attempts to cheat or circumvent the exam process will be recorded
          and reported to the instructor. The AI analysis and monitoring tools
          are implemented to ensure a fair testing environment for all
          participants.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          7. Changes to Terms
        </h2>
        <p>
          We may update these terms and conditions from time to time. Any
          changes will be posted on this page, and continued use of the platform
          after such changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          8. Contact Information
        </h2>
        <p>
          If you have any questions or concerns about these terms, please
          contact us at
          <a
            href="mailto:support@examsystem.com"
            className="text-emerald-600 hover:underline ml-1"
          >
            support@examsystem.com
          </a>
          .
        </p>
      </section>

      <footer className="text-center text-emerald-600 mt-12">
        <p>
          &copy; {new Date().getFullYear()} Exam System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
