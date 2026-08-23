type ProgressBarProps = {
  currentStep: number;
};

const steps = [
  "Listing",
  "Details",
  "Features",
  "Location",
  "Media",
  "Publish",
];

export default function ProgressBar({
  currentStep,
}: ProgressBarProps) {
  return (
    <div className="w-full">

      <div className="grid grid-cols-6 gap-2 md:gap-3">

        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const active =
            stepNumber === currentStep;

          const completed =
            stepNumber < currentStep;

          return (
            <div
              key={step}
              className="flex flex-col items-center"
            >

              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-lg border-2 transition-all ${
                  completed
                    ? "bg-[#08192E] border-[#08192E] text-[#C9A227]"
                    : active
                    ? "bg-[#C9A227] border-[#C9A227] text-[#08192E] shadow-md"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {completed
                  ? "✓"
                  : stepNumber}
              </div>

              <span
                className={`mt-3 text-xs md:text-sm font-semibold text-center transition ${
                  active
                    ? "text-[#B8922E]"
                    : completed
                    ? "text-[#08192E]"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>

            </div>
          );
        })}

      </div>

      {/* Progress line */}
      <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-[#C9A227] rounded-full transition-all duration-500"
          style={{
            width: `${
              ((currentStep - 1) /
                (steps.length - 1)) *
              100
            }%`,
          }}
        />

      </div>

      <p className="text-center text-sm text-gray-400 mt-3">
        Step {currentStep} of {steps.length}
      </p>

    </div>
  );
}