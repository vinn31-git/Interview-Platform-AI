import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateProfile } from "../services/authService";

const Settings = () => {
  const navigate = useNavigate();

  // Basic local state for the UI
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [defaultRole, setDefaultRole] = useState("Software Engineer");
  const [defaultDifficulty, setDefaultDifficulty] = useState("Medium");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load initial user data from localStorage if available
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setName(user.name || "");
        setBio(user.bio || "");
        setDefaultRole(user.defaultRole || "Software Engineer");
        setDefaultDifficulty(user.defaultDifficulty || "Medium");
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        name,
        bio,
        defaultRole,
        defaultDifficulty,
      });
      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userName", result.user.name);
        alert("Settings saved successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full border border-border bg-secondary/40 rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const labelClass = "block mb-2 text-sm font-medium text-muted-foreground";

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="border-b border-border bg-card/50 backdrop-blur-md px-4 py-3 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
          &larr; Back
        </Button>
        <span className="text-lg font-bold text-primary">User Settings</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        <BlurFade>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            <BorderBeam size={150} duration={12} colorFrom="#10b981" colorTo="#06b6d4" />
            <h2 className="text-2xl font-bold mb-2">Account Preferences</h2>
            <p className="text-muted-foreground text-sm">
              Manage your personal information and interview defaults.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.1}>
          <Card className="p-6 border-border/60 bg-card/50">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className={labelClass}>Bio / Current Role</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={inputClass}
                  rows={3}
                  placeholder="Tell us a bit about your experience..."
                />
              </div>
            </div>
          </Card>
        </BlurFade>

        <BlurFade delay={0.2}>
          <Card className="p-6 border-border/60 bg-card/50">
            <h3 className="text-lg font-semibold mb-4">Interview Defaults</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Default Target Role</label>
                <select
                  value={defaultRole}
                  onChange={(e) => setDefaultRole(e.target.value)}
                  className={inputClass}
                >
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Data Scientist</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Default Difficulty</label>
                <select
                  value={defaultDifficulty}
                  onChange={(e) => setDefaultDifficulty(e.target.value)}
                  className={inputClass}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
          </Card>
        </BlurFade>

        <BlurFade delay={0.3}>
          <Card className="p-6 border-border/60 bg-card/50">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your account password.
                </p>
              </div>
              <Button variant="outline" className="text-red-400 border-red-500/50 hover:bg-red-500/10">
                Update Password
              </Button>
            </div>
          </Card>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <ShimmerButton
              onClick={handleSave}
              disabled={isSaving}
              background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
              shimmerColor="#a7f3d0"
              className="px-8 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>
    </div>
  );
};

export default Settings;
