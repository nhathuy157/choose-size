import { redirect } from "next/navigation";

export default function Home() {
  // Chuyển hướng về bước đầu wizard
  redirect("/wizard");
}
