// app/profile/page.tsx
import Header from "@/components/header";
import ProfilePage from "@/components/Profile/ProfilePage ";
import ProtectedRoute from "@/components/Profile/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>
        <Header />
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url("/image.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="min-h-screen"
        >
          <ProfilePage />
        </div>
      </div>
    </ProtectedRoute>
  );
}
