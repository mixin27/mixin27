import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

type Props = {
  slug: string;
  noCount?: boolean;
  showCount?: boolean;
};

const supabase = createClient();

const ViewCount = ({ slug, noCount = false, showCount = true }: Props) => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const incrementView = async () => {
      try {
        const { error } = await supabase.rpc("increment", {
          slug_text: slug,
          type_text: "blogs",
        });
        if (error) {
          console.error(
            "An error has occurred while incrementing the view count: ",
            error
          );
        }
      } catch (error) {
        console.error(
          "An error has occurred while incrementing the view count: ",
          error
        );
      }
    };

    if (!noCount) {
      incrementView();
    }

    return () => {};
  }, [slug, noCount]);

  useEffect(() => {
    const getViewCount = async () => {
      try {
        const { data: views, error } = await supabase
          .from("views")
          .select("count")
          .match({ slug: slug })
          .single();

        if (error) {
          console.error(
            "An error has occurred while getting the view count: ",
            error
          );
        } else {
          setViews(views?.count ?? 0);
        }
      } catch (error) {
        console.error(
          "An error has occurred while getting the view count: ",
          error
        );
      }
    };

    getViewCount();

    return () => {};
  }, [slug]);

  if (showCount) {
    return <div>{views} views</div>;
  } else {
    return <></>;
  }
};

export default ViewCount;
