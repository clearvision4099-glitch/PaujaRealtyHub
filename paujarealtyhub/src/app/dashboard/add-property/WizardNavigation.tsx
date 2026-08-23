type WizardNavigationProps = {
  currentStep: number;

  setCurrentStep: React.Dispatch<
    React.SetStateAction<number>
  >;

  loading: boolean;

  onPublish: () => void;
};

export default function WizardNavigation({
  currentStep,
  setCurrentStep,
  loading,
  onPublish,
}: WizardNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">

      <button
        type="button"
        disabled={currentStep === 1}
        onClick={() =>
          setCurrentStep((prev) =>
            Math.max(prev - 1, 1)
          )
        }
        className="px-6 py-3 border border-gray-300 text-[#0B1F3A] rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Back
      </button>

      {currentStep < 6 ? (
        <button
          type="button"
          onClick={() =>
            setCurrentStep((prev) =>
              Math.min(prev + 1, 6)
            )
          }
          className="bg-[#08192E] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition shadow-sm"
        >
          Next →
        </button>
      ) : (
        <button
          type="button"
          onClick={onPublish}
          disabled={loading}
          className="bg-[#C9A227] text-[#08192E] px-7 py-3 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          {loading
            ? "Publishing..."
            : "Publish Property"}
        </button>
      )}

    </div>
  );
}