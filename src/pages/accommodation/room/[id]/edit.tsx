import NavBar from "~/components/navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterInputs, api } from "~/utils/api";
import { roomEditSchema } from "~/utils/apitypes";
import { useRouter } from "next/router";
import { dynamicRouteID, notAuthenticated } from "~/utils/helpers";
import { useEffect } from "react";
import Link from "next/link";
import bgpic from "public/images/addaccom_bg.png";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import LoadingSpinner from "~/components/loadingSpinner";
import Error404 from "~/pages/404";
import Error from "~/pages/_error";

export default function EditRoom() {
  const userSession = useSession({ required: true });
  const { id } = dynamicRouteID(useRouter());
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RouterInputs["room"]["edit"]>({
    resolver: zodResolver(roomEditSchema),
    defaultValues: {
      id: "",
    },
  });

  useEffect(() => {
    setValue("id", id);
  }, [id, setValue]);

  const editRoom = api.room.edit.useMutation();

  const { data: firstData, isLoading: queryLoading } =
    api.room.getOne.useQuery(id);

  if (notAuthenticated(userSession.status)) {
    return <LoadingSpinner />;
  }

  if (firstData === null) {
    return Error404();
  }

  if (firstData?.accommodation.landlord !== userSession.data?.user.id) {
    return <Error statusCode={401} />;
  }

  return (
    <div className="">
      <img
        className="absolute bg-cover bg-fixed bg-center"
        src={bgpic.src}
        alt="background"
      />

      {/* className="absolute bottom-1 right-1/2 h-[100%] translate-x-1/2 opacity-70" */}

      <NavBar />
      <div className="absolute inset-x-0 flex h-screen items-center justify-center">
        <div className="w-1/3 rounded-xl bg-white px-10 py-10">
          <div className="item-center flex justify-center px-2 pb-0 pt-0 drop-shadow-md">
            <h1 className="text-3xl font-bold text-p-dviolet">Edit Room</h1>
          </div>

          <div className="flex justify-center pb-6 drop-shadow-md">
            <p className="text-sm italic text-gray-400"></p>
          </div>

          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(
              (d) => {
                editRoom.mutate(d);
                toast.success("Successfully Edited Room!", {
                  position: "bottom-right",
                  duration: 1000,
                });
                router.back();
                setTimeout(() => router.reload(), 50);
              },
              (error) => {
                console.log(error);
                toast.error("Cannot Edit Room!", {
                  position: "bottom-right",
                  duration: 1000,
                });
              },
            )}
          >
            <div className="flex flex-col space-y-2.5">
              <div>
                <input
                  className="w-full rounded-xl px-2 py-2 shadow shadow-gray-400/100"
                  placeholder="Price"
                  pattern="^\d+(\.\d+)?$"
                  type="text"
                  title="Must be a positive float value."
                  defaultValue={firstData?.price}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  {...register("price", {
                    valueAsNumber: true,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setValueAs: (value: string) => parseFloat(value).toFixed(2),
                  })}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                ></input>
              </div>

              <div>
                <input
                  className="w-full rounded-xl px-2 py-2 shadow shadow-gray-400/100"
                  placeholder="Number of Beds"
                  pattern="[0-9]+"
                  type="number"
                  defaultValue={firstData?.num_of_beds}
                  {...register("num_of_beds", { valueAsNumber: true })}
                ></input>
              </div>
              {/* yung tatlong dropdown */}
              <div>
                <h2 className="form-h2">Availability</h2>
                <select
                  className="form-dropdown peer"
                  placeholder="Type"
                  {...register("occupied", {
                    setValueAs: (value) => {
                      return value == "yes";
                    },
                  })}
                >
                  <option value="no" selected={firstData?.occupied === false}>
                    Unoccupied
                  </option>
                  <option value="yes" selected={firstData?.occupied === true}>
                    Occupied
                  </option>
                </select>
              </div>
              <div>
                <h2 className="form-h2">Airconditioning</h2>
                <select
                  className="form-dropdown peer"
                  placeholder="Type"
                  {...register("with_aircon", {
                    setValueAs: (value) => {
                      return value == "yes";
                    },
                  })}
                >
                  <option
                    value="yes"
                    selected={firstData?.with_aircon === true}
                  >
                    With
                  </option>
                  <option
                    value="no"
                    selected={firstData?.with_aircon === false}
                  >
                    Without
                  </option>
                </select>
              </div>
              <div>
                <h2 className="form-h2">Utilities</h2>
                <select
                  className="form-dropdown peer"
                  placeholder="Type"
                  {...register("with_utilities", {
                    setValueAs: (value) => {
                      return value === "yes";
                    },
                  })}
                >
                  <option
                    value="yes"
                    selected={firstData?.with_utilities === true}
                  >
                    With
                  </option>
                  <option
                    value="no"
                    selected={firstData?.with_utilities === false}
                  >
                    Without
                  </option>
                </select>
              </div>
            </div>
            <br />
            <div>
              <div className="py-2">
                <button className="group relative flex w-full justify-center rounded-full bg-p-dviolet px-4 py-2 font-bold text-white shadow shadow-gray-400/100">
                  Save changes
                </button>
              </div>

              <div>
                <button
                  className="group relative flex w-full justify-center rounded-full bg-gray-500 px-4 py-2 font-bold text-white opacity-75 shadow shadow-gray-400/100"
                  onClick={() => {
                    router.back();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
