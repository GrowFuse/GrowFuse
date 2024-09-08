import { useEffect } from "react";
import { api } from "~/trpc/client";

const Page2 = () => {
  const { mutate } = api.auth.getGitHubLoginUrl.useMutation({
    onSuccess: (r) => console.log(r),
    onError: (e) => console.log(e),
  });

  useEffect(() => {
    mutate();
  }, []);

  return <div className="w-full h-screen bg-gray-400 text-white">Page2</div>;
};

export default Page2;
