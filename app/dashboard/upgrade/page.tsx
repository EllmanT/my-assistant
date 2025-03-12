"use client";
import { Button } from "@/components/ui/button";
import useSubsription from "@/hooks/useSubscription";
import { CheckIcon } from "lucide-react";
import { useTransition } from "react";

export type UserDetails = {
  email: string;
  name: string;
};
function PricingPage() {
  // const { user } = useUser();
  // const router = useRouter();

  const { hasActiveMembership, loading } = useSubsription();

  const [isPending, startTransition] = useTransition();
  console.log(startTransition);

  // const handleUpgrade = () => {
  //   if (!user) return;
  //   const userDetails: UserDetails = {
  //     email: user.primaryEmailAddress?.toString(),
  //     name: user.fullName,
  //   };

  //   startTransition(async () => {
  //     // Load stripe
  //     const stripe = await getStripe();
  //     if (!hasActiveMembership) {
  //       // create stripe portal...
  //       const stripePortalUrl = await createStripePortal();

  //       return router.push(stripePortalUrl);
  //     }
  //     const sessionId = await createCheckoutSession(userDetails);
  //     await stripe?.redirectToCheckout({
  //       sessionId,
  //     });
  //   });
  // };
  return (
    <div className="overflow-y-auto">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className=" mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your Document Companion
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan with the best features and enhanced
          productivity!
        </p>
        <div className="mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl">
          <div className="h-fit rounded-3xl p-8 pb-12 ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore core features at No Cost
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight">Free</span>
            </p>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />2
                Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 3 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Try out the AI Chat Functionality
              </li>
            </ul>
          </div>
          {/* Pro class */}
          <div className="rounded-3xl p-8 text-gray-600 ring-2 ring-indigo-600">
            <h3 className="text-lg font-semibold leading-8 text-indigo-600">
              Pro Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize Productivity with PRO features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                $5.99
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-600">
                /month
              </span>
            </p>
            <Button
              className="focus-cisible:outline-2 mt-6 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || isPending}
            >
              {isPending || loading
                ? "Loading.."
                : hasActiveMembership
                ? "Manage Plan"
                : "Upgrade to Pro"}
              onClick={}
            </Button>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Store up to 20 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Ability to delete documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 100 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Full Power AI Chat Functionality with Memory Recall
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Advanced Analytics
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                24-hour support response time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
