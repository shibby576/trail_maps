"use client";

import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Logo } from "@/components/logo";

export default function HomePage() {
  const router = useRouter();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const gpxContent = e.target?.result as string;
      sessionStorage.setItem("gpxContent", gpxContent);
      sessionStorage.setItem("gpxFileName", file.name);
      router.push("/customize");
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-6">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <h1 className="text-2xl font-semibold text-gray-900">TrailPrint</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Text */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">
              Turn Your Hike Into Art
            </h2>
            <p className="text-lg text-gray-600">
              Upload your trail data and create a beautiful poster to
              commemorate your adventure
            </p>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
          >
            <input
              type="file"
              accept=".gpx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-900">
                  Drop your GPX file here
                </p>
                <p className="text-sm text-gray-500">or tap to browse</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
