import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postData from "../../../utils/postData";
import BasicSpinner from "../../Basic/BasicSpinner";
import useAxiosInstance from "../../../utils/axiosInstance";

const PayPalSubscriptionPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxiosInstance("v1", true);

  useEffect(() => {
    const loadPayPalScript = async () => {
      setLoading(true);
      try {
        // Fetch subscription details from the server
        const { resData, error } = await postData("/subscriptions/subscribe/", {
          plan_id: planId,
        });

        if (error || !resData) {
          throw new Error(error || "Failed to get subscription details.");
        }

        const { subscription_id, approve_url } = resData;

        // Create and load PayPal SDK script
        const script = document.createElement("script");
        script.src =
          "https://www.paypal.com/sdk/js?client-id=Aeji_7ogB2GGBphoel4b751SE474HCEm-filOCRWsgiqtnLeUSpkk06Er1bahchRmG2n824aq7CmmGt-&vault=true&intent=subscription";
        script.setAttribute("data-sdk-integration-source", "button-factory");
        script.async = true;

        script.onload = () => {
          if (window.paypal) {
            window.paypal
              .Buttons({
                style: {
                  shape: "rect",
                  color: "gold",
                  layout: "vertical",
                  label: "subscribe",
                },
                createSubscription: function (data, actions) {
                  return actions.subscription.create({
                    plan_id: planId,
                  });
                },
                onApprove: async function (data, actions) {
                  try {
                    const approveResponse = await axiosInstance.get(
                      `/subscriptions/approve/?subscription_id=${subscription_id}`
                    );
                    if (!approveResponse.ok) {
                      throw new Error("Failed to approve subscription");
                    }
                    toast.success("Subscription successful!");
                    navigate("/subscription-success");
                  } catch (error) {
                    console.error("Error approving subscription:", error);
                    toast.error(
                      "Failed to approve subscription. Please try again."
                    );
                  }
                },
                onError: function (err) {
                  console.error("PayPal error:", err);
                  toast.error(
                    "An error occurred while processing your subscription. Please try again."
                  );
                },
              })
              .render("#paypal-button-container")
              .catch((error) => {
                console.error("Failed to render PayPal buttons:", error);
                toast.error(
                  "Failed to load PayPal. Please refresh the page and try again."
                );
              });
          }
          setLoading(false);
        };

        script.onerror = () => {
          console.error("Failed to load PayPal SDK");
          toast.error(
            "Failed to load PayPal. Please check your internet connection and try again."
          );
          setLoading(false);
        };

        document.body.appendChild(script);

        window.open(approve_url, "_blank");
      } catch (error) {
        console.error("Error initiating subscription:", error);
        setError("Failed to initiate subscription. Please try again.");
        setLoading(false);
      }
    };

    loadPayPalScript();

    return () => {
      // Cleanup PayPal script
      const script = document.querySelector(
        'script[src^="https://www.paypal.com/sdk/js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [planId, navigate]);

  if (loading) {
    return <BasicSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-2xl font-bold mb-4">Complete Your Subscription</h1>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default PayPalSubscriptionPage;
