"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import NumberFlow from "@number-flow/react";

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  color: string;
  icon: string;
}

interface PricingCardGroupProps {
  plans: PricingPlan[];
  isYearly: boolean;
}

export function PricingCardGroup({ plans, isYearly }: PricingCardGroupProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan, index) => (
        <motion.div
          key={index}
          initial={{ y: 40, opacity: 0 }}
          whileInView={
            isDesktop
              ? {
                  y: plan.isPopular ? -16 : 0,
                  opacity: 1,
                  x: index === 2 ? -20 : index === 0 ? 20 : 0,
                  scale: index === 0 || index === 2 ? 0.95 : 1.0,
                }
              : { y: 0, opacity: 1 }
          }
          viewport={{ once: true }}
          transition={{ duration: 1.4, type: "spring", stiffness: 100, damping: 28, delay: index * 0.1 }}
          className={cn(
            "rounded-2xl border p-6 flex flex-col relative bg-white",
            plan.isPopular ? "border-[#D4AF37] border-2 shadow-lg shadow-[#D4AF3720]" : "border-gray-200",
            !plan.isPopular && "mt-4"
          )}
        >
          {plan.isPopular && (
            <div className="absolute -top-px right-4 bg-[#D4AF37] px-3 py-1 rounded-b-xl flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-white text-white" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Most Popular</span>
            </div>
          )}

          {/* Product icon + name */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${plan.color}15`, border: `1.5px solid ${plan.color}30` }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: plan.color }}>{plan.icon}</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{plan.description}</p>
              <p className="font-black text-gray-900 leading-tight">{plan.name}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-1 flex items-end gap-1">
            <span className="text-3xl font-black text-gray-900">
              ₹<NumberFlow
                value={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                transformTiming={{ duration: 450, easing: "ease-out" }}
                willChange
              />
            </span>
            <span className="text-sm text-gray-400 mb-1">/{plan.period}</span>
          </div>
          {isYearly && (
            <p className="text-xs text-green-600 font-semibold mb-4">
              Save ₹{((plan.monthlyPrice - plan.yearlyPrice) * 12).toLocaleString("en-IN")}/yr
            </p>
          )}
          {!isYearly && <p className="text-xs text-gray-400 mb-4">billed monthly</p>}

          {/* Features */}
          <ul className="flex flex-col gap-2 flex-1 mb-5">
            {plan.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <hr className="border-gray-100 my-2" />

          <Link
            href={plan.href}
            className={cn(
              "mt-4 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block",
              plan.isPopular
                ? "bg-[#1a1c1c] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1c1c]"
                : "bg-gray-50 text-gray-800 border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            )}
          >
            {plan.buttonText}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
