import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import AdvertiseForm from "../components/Advertise/AdvertiseForm";
import PlanSelector from "../components/Advertise/PlanSelector";
import PaymentMethod from "../components/Advertise/PaymentMethod";
import CryptoPayment from "../components/Advertise/CryptoPayment";
import PaymentSuccess from "../components/Advertise/PaymentSuccess";

import { PAYMENT_CONFIG } from "../config/payment";

const Advertise = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [chainFilter, setChainFilter] = useState("all");

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("crypto");

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("light");
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex">

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen">

        <Header
          onChainFilter={setChainFilter}
          chainFilter={chainFilter}
          toggleTheme={toggleTheme}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 p-6">

          <div className="max-w-3xl mx-auto">

            {/* Progress */}

            <div className="flex items-center justify-between mb-8">

              {[1, 2, 3, 4, 5].map((item) => (
                <React.Fragment key={item}>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= item
                        ? "bg-green-500 text-white"
                        : "bg-[#1e232e] text-gray-500"
                    }`}
                  >
                    {item}
                  </div>

                  {item !== 5 && (
                    <div
                      className={`flex-1 h-1 ${
                        step > item
                          ? "bg-green-500"
                          : "bg-gray-700"
                      }`}
                    />
                  )}

                </React.Fragment>
              ))}

            </div>

            {/* STEP 1 */}

            {step === 1 && (
              <AdvertiseForm
                onNext={(data) => {
                  setFormData(data);
                  setStep(2);
                }}
              />
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <PlanSelector
                onBack={() => setStep(1)}
                onNext={(selectedPlan) => {
                  setPlan(selectedPlan);
                  setStep(3);
                }}
              />
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <PaymentMethod
                plan={plan}
                onBack={() => setStep(2)}
                onNext={(method) => {
                  setPaymentMethod(method);

                  if (method === "crypto") {
                    setStep(4);
                  } else {
                    alert("UPI payment coming soon.");
                  }
                }}
              />
            )}

            {/* STEP 4 */}

            {step === 4 && (
              <CryptoPayment
                formData={formData}
                plan={plan}
                paymentMethod={paymentMethod}

                walletAddress={PAYMENT_CONFIG.walletAddress}
                network={PAYMENT_CONFIG.network}
                token={PAYMENT_CONFIG.token}
                symbol={PAYMENT_CONFIG.symbol}

                onBack={() => setStep(3)}

                onSuccess={() => {
                  setStep(5);
                }}
              />
            )}

            {/* STEP 5 */}

            {step === 5 && (
              <PaymentSuccess
                formData={formData}
                plan={plan}
                paymentMethod={paymentMethod}

                walletAddress={PAYMENT_CONFIG.walletAddress}
                network={PAYMENT_CONFIG.network}
                token={PAYMENT_CONFIG.token}
                symbol={PAYMENT_CONFIG.symbol}
              />
            )}

          </div>

        </div>

        <Footer />

      </div>

    </div>
  );
};

export default Advertise;