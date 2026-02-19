import { updateProfileDetails } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Camera,
  CircleUser,
  Loader,
  Pen,
  Pencil,
  Save,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ProfilePicture from "./ProfilePicture";

const ProfileCard = () => {
  const { data, status, update } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onSubmit" });

  const bioContent = watch("bio", "");

  const onSubmit = async (data) => {
    const result = await updateProfileDetails(data);
    console.log(data);
    if (result?.success) {
      await update({
        user: {
          bio: result.data?.bio,
          name: result.data?.fullName,
        },
      });
      toast.success("Profile Updated Successfully", {
        position: "top-center",
      });
    }
  };

  return (
    <section className="w-full flex flex-col gap-8 bg-background rounded-lg hover:shadow-lg transition-shadow my-8 p-6">
      <div className=" flex-col items-center justify-center h-auto  ">
        <div className="flex items-center gap-2">
          <User />
          <h2 className="text-md border-b-0 pb-0">Profile Information</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Update your personal details and public profile.
        </p>
      </div>
      <div className="grid grid-cols-2 w-full gap-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className=" flex flex-col gap-4">
            {/* FullName */}
            <Field>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                className="bg-primary/5 p-2 px-3 rounded-md   text-sm shadow-sm outline-none"
                type="text"
                defaultValue={data?.user?.name}
                placeholder="Full Name"
                {...register("fullName", {
                  required: { value: true, message: "Full Name is required" },
                  minLength: { value: 3, message: "Min is 3 character" },
                  maxLength: { value: 100, message: "Too much Characters" },
                })}
              />
            </Field>

            {/* Email */}

            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="bg-primary/5 p-2 px-3 rounded-md text-sm shadow-sm outline-none "
                type="text"
                disabled
                value={data?.user?.email}
                placeholder="Email"
              />
            </Field>
            {/* Bio */}
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <InputGroup>
                <InputGroupTextarea
                  id="bio"
                  rows={4}
                  maxLength={250}
                  className="bg-primary/5 p-2 px-3 rounded-md resize-none min-h-24 text-sm outline-none "
                  type="text"
                  defaultValue={data?.user.bio}
                  placeholder="Tell us about yourself"
                  {...register("bio", {
                    maxLength: { value: 250, message: "Max is 250 Characters" },
                  })}
                />
                <InputGroupAddon
                  className="bg-primary/5 dark:bg-transparent"
                  align="block-end"
                >
                  <InputGroupText>{bioContent.length}/250</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Button
              type="submit"
              className="mt-4 bg-primary dark:text-foreground w-30 relative shadow-md"
            >
              <Save className="absolute left-6" />
              Save
            </Button>
          </FieldGroup>
        </form>
        {/* Avatar Update */}
        <ProfilePicture />
      </div>
    </section>
  );
};

export default ProfileCard;
