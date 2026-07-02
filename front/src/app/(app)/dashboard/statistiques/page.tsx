import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";
import { analyticsByPeriod } from "@/data/mock-analytics";

export default function Page() {
  return <AnalyticsOverview data={analyticsByPeriod} />;
}
