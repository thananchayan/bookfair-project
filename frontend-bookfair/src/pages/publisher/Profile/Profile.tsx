// src/pages/Publisher/ProfileSettings.tsx
import React, { useEffect, useRef, useState } from "react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/common/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 eye icons

type Profile = {
  publicationName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  logoUrl?: string; // optional remote URL from backend
};

const MAX_IMAGE_MB = 3;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const mockLoadProfile = async (): Promise<Profile> => {
  // TODO: replace with your real API call, e.g., GET /api/publisher/me
  return {
    publicationName: "Sunrise Publications",
    contactPerson: "Silva",
    email: "silva@example.com",
    phone: "+94 77 123 4567",
    addressLine1: "No. 15, Flower Road",
    addressLine2: "",
    city: "Colombo",
    country: "Sri Lanka",
    logoUrl: "",
  };
};

const mockUpdateProfile = async (payload: FormData | Profile) => {
  // TODO: replace with your real API call
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true };
};

const mockChangePassword = async (currentPw: string, newPw: string) => {
  // TODO: replace with your real API call
  await new Promise((r) => setTimeout(r, 700));
  if (currentPw === "wrongpass") {
    return { ok: false, message: "Current password is incorrect." };
  }
  return { ok: true };
};

const AvatarPreview: React.FC<{
  file?: File | null;
  url?: string;
  onPick: (f: File) => void;
}> = ({ file, url, onPick }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(url);

  useEffect(() => {
    if (!file) {
      setPreview(url);
      return;
    }
    const obj = URL.createObjectURL(file);
    setPreview(obj);
    return () => URL.revokeObjectURL(obj);
  }, [file, url]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      alert("Please upload a PNG or JPG image.");
      return;
    }
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
      alert(`Image must be under ${MAX_IMAGE_MB} MB.`);
      return;
    }
    onPick(f);
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative group w-20 h-20 rounded-full overflow-hidden background-gray-100 border border-gray-300 cursor-pointer">
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-xs text-gray-400">
            No image
          </div>
        )}


        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-md transition"
          title="Change profile photo"
          aria-label="Change profile photo"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 bo text-gray-700"
          >
            <path d="M9.5 3a1 1 0 0 0-.8.4L7.4 5H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-2.4l-1.3-1.6a1 1 0 0 0-.8-.4h-5Zm2.5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 10Zm7-2a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1Z" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        PNG or JPG, up to {MAX_IMAGE_MB} MB. Square images look best.
      </p>
    </div>
  );
};


const PasswordField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center text-gray-600 hover:text-gray-800"
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide" : "Show"}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

const PasswordSection: React.FC = () => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const valid =
    currentPw.trim().length >= 1 &&
    newPw.length >= 8 &&
    /\d/.test(newPw) &&
    /[A-Za-z]/.test(newPw) &&
    newPw === confirmPw;

  const submit = async () => {
    if (!valid) return;
    setLoading(true);
    const res = await mockChangePassword(currentPw, newPw);
    setLoading(false);
    if (res.ok) {
      alert("Password updated successfully.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } else {
      alert(res.message || "Failed to change password.");
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField
          label="Current Password"
          value={currentPw}
          onChange={setCurrentPw}
          placeholder="••••••••"
        />
        <PasswordField
          label="New Password"
          value={newPw}
          onChange={setNewPw}
          placeholder="At least 8 chars, letters & numbers"
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmPw}
          onChange={setConfirmPw}
          placeholder="Re-type new password"
        />
      </div>

   
      <div className="flex flex-col items-start">
        <Button
          disabled={!valid || loading}
          onClick={submit}
          className="text-base font-semibold px-5 py-3 leading-none"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>

        {!valid && (
          <p className="mt-2 text-xs text-gray-500">
            New password must be ≥ 8 chars, include letters & numbers, and match the confirmation.
          </p>
        )}
      </div>
    </Card>
  );
};

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await mockLoadProfile();
      setProfile(data);
    })();
  }, []);

  const saveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      if (logoFile) {
        const fd = new FormData();
        fd.append("publicationName", profile.publicationName);
        fd.append("contactPerson", profile.contactPerson);
        fd.append("email", profile.email);
        if (profile.phone) fd.append("phone", profile.phone);
        if (profile.addressLine1) fd.append("addressLine1", profile.addressLine1);
        if (profile.addressLine2) fd.append("addressLine2", profile.addressLine2);
        if (profile.city) fd.append("city", profile.city);
        if (profile.country) fd.append("country", profile.country);
        fd.append("logo", logoFile);
        const res = await mockUpdateProfile(fd);
        if (res.ok) alert("Profile saved successfully.");
      } else {
        const res = await mockUpdateProfile(profile);
        if (res.ok) alert("Profile saved successfully.");
      }
    } catch (e) {
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="px-6 md:px-12 py-8">
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <p>Loading profile…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 md:px-12 py-8">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <Card className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Publisher Profile</h3>

        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6">
 
          <AvatarPreview
            file={logoFile ?? undefined}
            url={profile.logoUrl}
            onPick={(f) => setLogoFile(f)}
          />

    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Publication Name</label>
              <input
                value={profile.publicationName}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, publicationName: e.target.value } : p))
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Your publication / company name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Contact Person</label>
              <input
                value={profile.contactPerson}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, contactPerson: e.target.value } : p))
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Contact person"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => (p ? { ...p, email: e.target.value } : p))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="email@domain.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                value={profile.phone || ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value } : p))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="+94 77 123 4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
              <input
                value={profile.addressLine1 || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, addressLine1: e.target.value } : p))
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Street address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address Line 2</label>
              <input
                value={profile.addressLine2 || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, addressLine2: e.target.value } : p))
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                value={profile.city || ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, city: e.target.value } : p))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Colombo"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <input
                value={profile.country || ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, country: e.target.value } : p))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Sri Lanka"
              />
            </div>
          </div>
        </div>


        <div className="flex flex-col items-start">
          <Button
            onClick={saveProfile}
            disabled={saving}
            className="text-base font-semibold px-5 py-3 leading-none"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>

          <p className="mt-2 text-xs text-gray-500">
            Your profile details will be used across reservations and invoices.
          </p>
        </div>
      </Card>

      
      <PasswordSection />
    </div>
  );
};

export default ProfileSettings;
