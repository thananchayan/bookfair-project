// src/pages/Publisher/ProfileSettings.tsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store/store";
import { changePassword, fetchProfile, updateProfile as updateProfileThunk } from "../../../features/auth/authSlice";
import toast from "react-hot-toast";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/common/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 eye icons
import type { MeResponseData } from "../../../lib/api";

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
  error?: string;
}> = ({ label, value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 rounded-md focus:ring-2 focus:ring-sky-400 outline-none border ${error ? "border-red-500" : "border-gray-300"}`}
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
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const PasswordSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  const validate = () => {
    const e: { current?: string; next?: string; confirm?: string } = {};
    if (!currentPw.trim()) e.current = "Current password is required.";
    if (!newPw) e.next = "New password is required.";
    else {
      if (newPw === currentPw) e.next = "New password must be different from current password.";
      else if (newPw.length < 8) e.next = "New password must be at least 8 characters.";
      else if (!/[a-z]/.test(newPw)) e.next = "Include at least one lowercase letter.";
      else if (!/[A-Z]/.test(newPw)) e.next = "Include at least one uppercase letter.";
      else if (!/\d/.test(newPw)) e.next = "Include at least one number.";
      else if (!/[!@#$%^&*(),.?":{}|<>_\-\[\]\/\\;+='`~]/.test(newPw)) e.next = "Include at least one special character.";
      else if (newPw.includes(" ")) e.next = "Password must not contain spaces.";
    }
    if (!confirmPw) e.confirm = "Please confirm your new password.";
    else if (newPw !== confirmPw) e.confirm = "Passwords do not match.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    const hasErrors = !!(e.current || e.next || e.confirm);
    if (hasErrors) return;
    setLoading(true);
    const action = await dispatch(changePassword({ oldPassword: currentPw, newPassword: newPw }));
    setLoading(false);
    if (changePassword.fulfilled.match(action)) {
      toast.success(action.payload?.message || "Password changed successfully");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setErrors({});
    } else if (changePassword.rejected.match(action)) {
      const msg = (action.payload as string) || action.error.message || "Failed to change password";
      toast.error(msg);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>

      {(errors.current || errors.next || errors.confirm) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <p className="font-semibold mb-1">Can't update password</p>
          <p>{errors.current || errors.next || errors.confirm}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField
          label="Current Password"
          value={currentPw}
          onChange={(v) => { setCurrentPw(v); if (errors.current) setErrors((p) => ({ ...p, current: undefined })); }}
          placeholder="••••••••"
        />
        <PasswordField
          label="New Password"
          value={newPw}
          onChange={(v) => { setNewPw(v); if (errors.next) setErrors((p) => ({ ...p, next: undefined })); }}
          placeholder="At least 8 chars, letters & numbers"
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmPw}
          onChange={(v) => { setConfirmPw(v); if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined })); }}
          placeholder="Re-type new password"
        />
      </div>

   
      <div className="flex flex-col items-start">
        <Button
          disabled={loading}
          onClick={submit}
          className="text-base font-semibold px-5 py-3 leading-none"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>

        <p className="mt-2 text-xs text-gray-500">
          New password must be at least 8 characters, include upper, lower, number and symbol, and match the confirmation.
        </p>
      </div>
    </Card>
  );
};

const ProfileSettings: React.FC = () => {
  // New minimal profile from /auth/me
  const dispatch = useDispatch<AppDispatch>();
  const [me, setMe] = useState<MeResponseData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  // Keep legacy state to avoid type errors in commented section
  const [profile, setProfile] = useState<Profile>({
    publicationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const saveProfile = async () => {};

  const auth = useSelector((s: RootState) => s.auth);
  const [savingProfile, setSavingProfile] = useState(false);
  const [form, setForm] = useState<{ username: string; phonenumber: string; address: string }>({ username: "", phonenumber: "", address: "" });

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (e: any) {
        const msg = e?.message || "Failed to load profile";
        toast.error(msg);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (auth.profile) {
      setMe(auth.profile);
      setForm({
        username: auth.profile.username,
        phonenumber: auth.profile.phonenumber,
        address: auth.profile.address,
      });
    }
  }, [auth.profile]);

  if (loadingProfile) {
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

      {/* Minimal profile card from /auth/me */}
      <Card className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <h3 className="text-lg font-semibold text-foreground">My Profile</h3>
        {me ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm text-gray-600 mb-1">User ID</label>
              <input value={me.id} disabled className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50" />
            </div> */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input value={me.username} disabled className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
              <input value={me.phonenumber} disabled className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input value={me.address} disabled className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Profession</label>
              <input value={me.profession} disabled className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input value={me.date} disabled className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No profile data available.</p>
        )}
      </Card>

      <Card className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Edit Profile</h3>
        {me ? (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.username || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.username)) {
                toast.error("Please enter a valid email for username");
                return;
              }
              if (!form.phonenumber || !/^\d{7,15}$/.test(form.phonenumber.replace(/[^\d]/g, ""))) {
                toast.error("Please enter a valid phone number");
                return;
              }
              if (!form.address) {
                toast.error("Address is required");
                return;
              }
              setSavingProfile(true);
              try {
                const action = await dispatch(
                  updateProfileThunk({
                    username: form.username,
                    phonenumber: form.phonenumber,
                    address: form.address,
                    profession: me.profession,
                  })
                );
                if (updateProfileThunk.fulfilled.match(action)) {
                  const res = action.payload;
                  toast.success(res.message || "Profile updated successfully");
                } else if (updateProfileThunk.rejected.match(action)) {
                  const msg = (action.payload as string) || action.error.message || "Failed to update profile";
                  toast.error(msg);
                }
              } catch (err: any) {
                const msg = err?.message || "Failed to update profile";
                toast.error(msg);
              } finally {
                setSavingProfile(false);
              }
            }}
          >
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-600 mb-1">Username (email)</label>
              <input
                type="email"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="md:col-span-1">b
              <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
              <input
                value={form.phonenumber}
                onChange={(e) => setForm((p) => ({ ...p, phonenumber: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="0771234567"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Your address"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={savingProfile} className="text-base font-semibold px-5 py-3 leading-none">
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500">No profile data available.</p>
        )}
      </Card>

      {/* Commenting out extended fields until backend supports them */}
      {false && (
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
      )}

      
      <PasswordSection />
    </div>
  );
};

export default ProfileSettings;








