import { supabase } from "@/app/supabase-client";

const Brand = () => {
  const { data } = supabase.storage
    .from("misc-images")
    .getPublicUrl("logo.png");
  const logoUrl = data.publicUrl;

  return (
    <div className="flex justify-start gap-x-[0.75rem] w-[13rem] h-[3.5rem] p-[0.5rem]">
      <img
        src={logoUrl}
        alt="Bubble Tea Time logo of an orange boba drink."
        className="object-contain"
      />
      <div className="flex items-center">
        <h6>Bubble Tea Time</h6>
      </div>
    </div>
  );
};

export default Brand;
