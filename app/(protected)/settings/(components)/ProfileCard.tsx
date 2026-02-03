import { Camera, CircleUser, User } from "lucide-react";

const ProfileCard = () => {
  return (
    <section className="w-full flex flex-col gap-8 bg-background rounded-lg hover:shadow-lg transition-shadow my-8 p-6">
      <div className=" flex-col items-center justify-center h-auto  ">
        <div className="flex items-center gap-2">
          <User />
          <h2 className="text-md border-b-0 pb-0">Profile Information</h2>
        </div>
        <p border-b-0 className="text-sm text-muted-foreground">
          Update your personal details and public profile.
        </p>
      </div>
      <div className="grid grid-cols-2 w-full gap-8">
        <div className=" flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm border-b-0 pb-0">First Name</h2>
            <input
              className="bg-primary/5 p-2 px-3 rounded-md ring-offset-2 border border-muted-foreground  text-sm shadow-sm outline-none focus:ring-primary focus-visible:ring-2"
              type="text"
              placeholder="First Name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm border-b-0 pb-0">Email</h2>
            <input
              className="bg-primary/5 p-2 px-3 rounded-md ring-offset-2 border border-muted-foreground  text-sm shadow-sm outline-none focus:ring-primary focus-visible:ring-2"
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm border-b-0 pb-0">Bio</h2>
            <input
              className="bg-primary/5 p-2 px-3 rounded-md ring-offset-2 border border-muted-foreground  text-sm shadow-sm outline-none focus:ring-primary focus-visible:ring-2"
              type="text"
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
        <div className="flex justify-center items-center border-l">
          <div className="relative  w-30 h-30 bg-primary rounded-full">
            <div className="flex items-center justify-center w-full h-full ">
              <CircleUser size={70} className="text-primary-foreground" />
            </div>
            <Camera
              size={30}
              className="absolute p-2 right-0 bottom-1.5 bg-muted-foreground/60 rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
