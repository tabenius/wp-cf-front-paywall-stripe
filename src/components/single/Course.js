import SingleContent from "./SingleContent";
import { t } from "@/lib/i18n";

export default function Course({ data }) {
  return (
    <SingleContent
      data={data}
      meta={
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          {t("common.course")}
        </p>
      }
    />
  );
}
