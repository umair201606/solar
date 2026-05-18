import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { faqItems } from "./faqData";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="bg-primary/15 border border-primary/20 rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-bold text-dark-bg text-sm md:text-base pr-4">
                {item.question}
              </span>
              <span className="w-8 h-8 rounded-full bg-dark-card text-primary flex items-center justify-center shrink-0">
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-primary/10">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
