import { Accordion } from "@/components/ui/Accordion";
import { featuredFaq } from "@/lib/content/faq";

export function HomeFaq() {
  return <Accordion items={featuredFaq} />;
}
