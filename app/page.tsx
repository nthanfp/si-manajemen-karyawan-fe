import { DarkThemeToggle } from "flowbite-react";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";

export default function Home() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Welcome to Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">Card 1</div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">Card 2</div>
      </div>
    </AdminLayout>
  );

}
